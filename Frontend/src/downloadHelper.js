// Creates a blob and serves it to the user
export function downloadFile(data, filename, type) {
	const blob = new Blob([data], { type });
	const url = URL.createObjectURL(blob);
	const link = document.createElement("a");
	link.href = url;
	link.download = filename;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
}
