export function readDeviceList(name: string): string[] {
  const value = process.env[name];
  if (!value?.trim()) throw new Error(`Set ${name} in .env for this Project.`);
  const devices = value.split(',').map((item) => item.trim());
  if (devices.some((item) => !item) || new Set(devices).size !== devices.length)
    throw new Error(`${name} must contain distinct, non-empty values.`);
  return devices;
}

export function readEndpointList(name: string): string[] {
  const endpoints = readDeviceList(name).map((value) => {
    const url = new URL(value);
    if (!['http:', 'https:'].includes(url.protocol))
      throw new Error(`${name} must contain absolute HTTP(S) URLs.`);
    return url.href.replace(/\/$/, '');
  });
  if (new Set(endpoints).size !== endpoints.length)
    throw new Error(`${name} must refer to distinct endpoints.`);
  return endpoints;
}

// The Project file limit bounds demand, so no extra waiting queue is needed.
export function createDevicePool<T>(
  devices: readonly T[],
  capacity: number,
  label: string,
) {
  if (devices.length < capacity)
    throw new Error(
      `${label} needs at least ${capacity} devices; configured ${devices.length}. Use SERIAL=1 for one device.`,
    );
  const available = [...devices];
  const leased = new Set<T>();
  return {
    acquire(): T {
      if (!available.length)
        throw new Error(`${label} has no free device. Check its file limit.`);
      const device = available.shift()!;
      leased.add(device);
      return device;
    },
    release(device: T) {
      if (!leased.delete(device))
        throw new Error(`${label} device was not leased by this pool.`);
      available.push(device);
    },
  };
}

export type DevicePool<T> = ReturnType<typeof createDevicePool<T>>;
