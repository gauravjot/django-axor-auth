import fs from "fs";
import matter from "gray-matter";
import path from "path";

/**
 * Get all md files from the content folder and the subfolders
 * @param {string} dir - Path to directory where files are located
 * @returns {{path: string; title: string; files?:[]}[]}
 * Readable tree of md files in `dir`
 * -  `path`  - absolute path to the file or directory
 * -  `title` - title of the document provided inside the file or
 *            the file name or directory name
 * -  `files` - an array of objects if the path is a directory
 */
export function getFiles(dir) {
	let arr = [];
	const items = fs.readdirSync(dir);
	// sort alphabetically
	items.sort((a, b) => (a < b ? -1 : 1));
	// iterate over files and recurse if it is a directory
	for (let i = 0; i < items.length; i++) {
		let item_path = path.join(dir, items[i]);
		// check if item is a directory or file
		if (fs.statSync(item_path).isDirectory()) {
			// Get files inside the directory
			let dir_items = getFiles(item_path);
			if (dir_items.length > 0) {
				arr.push({
					title: items[i],
					path: item_path,
					files: dir_items,
				});
			}
		} else {
			if (!items[i].endsWith(".md") || items[i].startsWith("_")) {
				// skip non-md files and files starting with _ (hidden)
				continue;
			}
			arr.push({
				path: item_path,
				title: matter.read(item_path).data.title || items[i].replace(".md", ""),
			});
		}
	}
	return arr;
}
