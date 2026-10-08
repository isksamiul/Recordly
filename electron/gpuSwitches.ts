export interface GpuSwitches {
	useAngle?: string;
	useGl?: string;
	disableFeatures?: string[];
}


export function shouldForceLinuxEgl(env: NodeJS.ProcessEnv): boolean {
	const flag = env.RECORDLY_FORCE_EGL?.trim().toLowerCase();
	return flag === "1" || flag === "true";
}

export function getGpuSwitches(
	platform: NodeJS.Platform,
	env: NodeJS.ProcessEnv = process.env,
): GpuSwitches {
	if (platform === "darwin") {
		return {
			useAngle: "metal",
			disableFeatures: ["MacCatapLoopbackAudioForScreenShare"],
		};
	}

	if (platform === "win32") {
		return { useAngle: "d3d11" };
	}

	if (platform === "linux") {
		const useGl = env.RECORDLY_USE_GL ?? (shouldForceLinuxEgl(env) ? "egl" : undefined);
		const useAngle = env.RECORDLY_USE_ANGLE;
		return {
			...(useGl ? { useGl } : {}),
			...(useAngle ? { useAngle } : {}),
			disableFeatures: ["VaapiVideoDecoder", "VaapiVideoEncoder"],
		};
	}

	return {};
}
