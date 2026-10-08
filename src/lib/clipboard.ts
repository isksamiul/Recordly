/**
 * Cross-platform clipboard helper.
 * Tries Electron native clipboard IPC first, then navigator.clipboard, and finally document.execCommand fallback.
 */
export async function copyTextToClipboard(text: string): Promise<boolean> {
	if (typeof window !== "undefined" && window.electronAPI?.writeClipboardText) {
		try {
			const result = await window.electronAPI.writeClipboardText(text);
			if (result?.success) {
				return true;
			}
		} catch {
			// Fall through to browser clipboard
		}
	}

	if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
		try {
			await navigator.clipboard.writeText(text);
			return true;
		} catch {
			// Fall through to execCommand
		}
	}

	if (typeof document !== "undefined") {
		try {
			const textarea = document.createElement("textarea");
			textarea.value = text;
			textarea.style.position = "fixed";
			textarea.style.left = "-9999px";
			textarea.style.top = "-9999px";
			textarea.setAttribute("readonly", "");
			document.body.appendChild(textarea);
			textarea.select();
			const successful = document.execCommand("copy");
			document.body.removeChild(textarea);
			if (successful) return true;
		} catch {
			// Failed all copy attempts
		}
	}

	return false;
}
