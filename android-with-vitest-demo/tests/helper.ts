import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import { AndroidPage } from '@midscene/android';
const execPromise = promisify(exec);

interface StartAppOptions {
  /**
   * The name of the application package
   */
  pkg: string;
  /**
   * The name of the main application activity.
   * This or action is required in order to be able to launch an app.
   */
  activity?: string;
  /**
   * The name of the intent action that will launch the required app.
   * This or activity is required in order to be able to launch an app.
   */
  action?: string;
  /**
   * If this property is set to `true`
   * and the activity name does not start with '.' then the method
   * will try to add the missing dot and start the activity once more
   * if the first startup try fails.
   * `true` by default.
   */
  retry?: boolean;
  /**
   * Set it to `true` in order to forcefully
   * stop the activity if it is already running.
   * `true` by default.
   */
  stopApp?: boolean;
  /**
   * The name of the package to wait to on
   * startup (this only makes sense if this name is
   * different from the one, which is set as `pkg`)
   */
  waitPkg?: string;
  /**
   * The name of the activity to wait to on
   * startup (this only makes sense if this name is different
   * from the one, which is set as `activity`)
   */
  waitActivity?: string;
  /**
   * The number of milliseconds to wait until the
   * `waitActivity` is focused
   */
  waitDuration?: number;
  /**
   * The number of the user profile to start
   * the given activity with. The default OS user profile (usually zero) is used
   * when this property is unset
   */
  user?: string | number;
  /**
   * If `false` then adb won't wait
   * for the started activity to return the control.
   * `true` by default.
   */
  waitForLaunch?: boolean;
  category?: string;
  flags?: string;
  optionalIntentArguments?: string;
}

interface LaunchOptions {
  deviceId?: string;
  uri?: string;
  app?: StartAppOptions;
}

/**
 * Get all connected Android device IDs
 * @returns List of device IDs
 * @throws Error when unable to retrieve device list
 */
export async function getConnectedDevices(): Promise<string[]> {
  try {
    const { stdout } = await execPromise('adb devices');
    const devices = stdout
      .split('\n')
      .slice(1) // Skip the first line "List of devices attached"
      .map((line) => {
        const [id, status] = line.split('\t');
        return { id, status };
      })
      .filter(({ id, status }) => id && status && status.trim() === 'device')
      .map(({ id }) => id);

    return devices;
  } catch (error) {
    console.error('Failed to get device list:', error);
    throw new Error('Unable to get connected Android device list');
  }
}

/**
 * Verify if the device is accessible
 * @param deviceId Device ID
 * @returns true if the device is accessible, false otherwise
 */
export async function isDeviceAccessible(deviceId: string): Promise<boolean> {
  try {
    await execPromise(`adb -s ${deviceId} shell echo "Device is ready"`);
    return true;
  } catch {
    return false;
  }
}

/**
 * Launch Android page
 * @param opt Launch options
 * @returns AndroidPage instance
 * @throws Error when no available device is found
 */
export async function launchPage(opt: LaunchOptions): Promise<AndroidPage> {
  // If device ID is provided, use it directly
  let deviceId = opt.deviceId;

  if (!deviceId) {
    // Get all connected devices
    const devices = await getConnectedDevices();

    if (devices.length === 0) {
      throw new Error('No available Android devices found');
    }

    if (devices.length > 1) {
      console.warn(
        `Multiple devices detected: ${devices.join(', ')}. Using the first device: ${devices[0]}`,
      );
    }

    // Use the first available device
    deviceId = devices[0];
  }

  // Verify if the device is accessible
  const isAccessible = await isDeviceAccessible(deviceId);
  if (!isAccessible) {
    throw new Error(
      `Device ${deviceId} is not accessible, please check the connection status`,
    );
  }

  const androidPage = new AndroidPage({
    deviceId,
  });

  const adb = await androidPage.getAdb();

  // handle URI (if provided), support app page and web page
  if (opt.uri) {
    try {
      await adb.startUri(opt.uri);
    } catch (error) {
      console.error(`Error starting URI: ${error}`);
    }
  }

  if (opt.app) {
    try {
      await adb.startApp(opt.app);
    } catch (error) {
      console.error(`Error starting app: ${error}`);
    }
  }

  return androidPage;
}
