import path from "path";

/**
 * Generates URL string of the doc
 *
 * @param {string} content_dir Absolute path to content directory
 * @param {string} file_path Absolute file path
 * @returns {string} URL for doc
 */
export function getDocURL(content_dir, file_path) {
	if (!file_path) {
		return;
	}
	if (file_path.endsWith(".html")) {
		return file_path; // already html path given
	}
	let uri = file_path.split(content_dir).pop();
	// split the uri into chunks
	const encoded_uri_chunks = uri.split(path.sep);
	// encode each chunk
	for (let i = 0; i < encoded_uri_chunks.length; i++) {
		// see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent#description
		encoded_uri_chunks[i] = encodeURIComponent(encoded_uri_chunks[i]);
	}
	// pack the chunks back together, remove .md and add .html
	let result = encoded_uri_chunks.join("/").replace(/\.md$/, "") + ".html";
	return result.startsWith("/") ? result : "/" + result;
}
