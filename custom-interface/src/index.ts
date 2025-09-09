import { Agent } from "@midscene/core";
import SampleDevice, {type  SampleDeviceOptions } from "./device/sample-device";

export async function midsceneAgentForSampleDevice(options: SampleDeviceOptions): Promise<Agent<SampleDevice>> {
  const device = new SampleDevice(options);
  await device.launch();
	return new Agent(device);
}
