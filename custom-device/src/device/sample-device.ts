import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import {
	type DeviceAction,
	type InterfaceType,
	type Size,
	z,
} from "@midscene/core";
import {
	type AbstractInterface,
	type ActionTapParam,
	defineAction,
	defineActionTap,
} from "@midscene/core/device";
import Jimp from "jimp";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Here we mock a device by a static screenshot, and define two actions without true device implementation: tap and close app panel. Once these actions are called, we will print some logs to show the action is performed.

const screenshotPath = path.join(__dirname, "../fixture", "screenshot-2x.png");

export default class SampleDevice implements AbstractInterface {
	private cachedScreenshot: string | null = null;
	private cachedSize: Size | null = null;
	interfaceType: InterfaceType = "my-device";
	uri: string | undefined;
	description: string;

	constructor() {
		this.description = "Sample Device";
	}


	actionSpace(): DeviceAction<any>[] {
		return [
			defineActionTap(async (param: ActionTapParam) => {
				const element = param.locate;
				console.log(`Mock tap at: ${element?.center || "unknown"}`);
			}),
			defineAction({
				name: "CloseAppPanel",
				description: "Close the app panel on screen",
				paramSchema: z.object({
					withAnimation: z.boolean().optional(),
				}),
				call: async (param) => {
					const withAnimation = param.withAnimation;
					console.log(
						`We should close the app panel ${
							withAnimation ? "with" : "without"
						} animation now`,
					);
				},
			}),
		];
	}

	describe(): string {
		return "this is a demo device for Midscene";
	}

	async size(): Promise<Size> {
		const image = await Jimp.read(screenshotPath);
		this.cachedSize = {
			width: image.bitmap.width,
			height: image.bitmap.height,
			dpr: 2, // Based on the filename suggesting 2x resolution
		};

		console.log(
			`Mock device size: ${this.cachedSize.width}x${this.cachedSize.height} (dpr: ${this.cachedSize.dpr})`,
		);
		return this.cachedSize;
	}

	async screenshotBase64(): Promise<string> {
		const imageBuffer = await fs.promises.readFile(screenshotPath);
		this.cachedScreenshot = `data:image/png;base64,${imageBuffer.toString(
			"base64",
		)}`;
		console.log("Mock screenshot loaded");
		return this.cachedScreenshot;
	}

	async destroy(): Promise<void> {
		console.log("Mock device destroyed");
	}
}
