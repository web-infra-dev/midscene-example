import { Agent, type AgentOpt } from "@midscene/core";
import SampleDevice, {type  SampleDeviceOptions } from "./sample-device";


// utility function to create a midscene agent for the sample device
export async function midsceneAgentForSampleDevice(options: SampleDeviceOptions, agentOptions?: AgentOpt): Promise<Agent<SampleDevice>> {
  const device = new SampleDevice(options);
  await device.launch();
	return new Agent(device, agentOptions);
}

// customized agent for the sample device
// usage:
// const device = new SampleDevice(options);
// const agent = new SampleDeviceAgent(device, agentOptions);
// await agent.myOwnMethod();
export class SampleDeviceAgent extends Agent<SampleDevice> {
  constructor(device: SampleDevice, agentOptions?: AgentOpt) {
    console.log("creating sample device agent");
    super(device, agentOptions);
  }

  async myOwnMethod() {
    console.log("calling my own method");
  }
} 
