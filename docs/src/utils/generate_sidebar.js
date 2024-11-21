import fs, {existsSync} from "fs";
import path from "path";
import {getDocURL} from "./get_doc_url.js";
import {getFiles} from "./get_files.js";
import {SETTINGS} from "../../config/app.js";

const DYNAMIC = SETTINGS.dynamic_hydration ?? false;

/**
 * This function generates a list that is used in the sidebar
 * to show the document tree
 *
 * @param {string} content_dir - Absolute path to content directory
 * @param {string} highlight - Absolute path of doc to highlight if it is opened.
 * @returns {string} HTML
 */
export function generateSidebarList(content_dir, highlight = "") {
	const data = getFiles(content_dir);
	return generate(content_dir, data, highlight);
}

function generate(content_dir, data, highlight = "") {
	let html = "<div><ul>";
	try {
		// Read the meta.json file if it exists
		const meta_path = path.join(path.dirname(data[0].path), "meta.json");
		let aliases = {};
		if (existsSync(meta_path)) {
			try {
				const meta = JSON.parse(fs.readFileSync(meta_path));
				if (meta.order && meta.order.length > 0) {
					// Sort the files based on the order in meta.json
					data.sort((a, b) => {
						const a_index = meta.order.indexOf(path.basename(a.path));
						const b_index = meta.order.indexOf(path.basename(b.path));
						return a_index - b_index;
					});
				}
				if (meta.alias) {
					aliases = meta.alias;
				}
			} catch (e) {
				throw new Error(
					`Error reading meta.json file for ${item.path}. Check if the file is valid JSON.`,
				);
			}
		}
		for (let i = 0; i < data.length; i++) {
			let item = data[i];
			if (item.files) {
				// Check if has index.md file
				const index_md = item.files.find((f) => path.basename(f.path) === "index.md");
				// item is a directory
				let dir_name = path.basename(item.path);
				if (index_md) {
					html += '<li class="accordion" id="' + dir_name + '">';
					// Check if alias was given in meta.json file
					if (aliases[dir_name]) {
						dir_name = aliases[dir_name];
					}
					html += '<p class="flex place-items-center">';
					html += `<a href="${getDocURL(content_dir, index_md.path)}" class="flex-1" aria-current="${highlight === index_md.path}" ${DYNAMIC ? 'data-type="dynamic"' : ""}><span>${dir_name}</span></a>`;
					html += '<button class="accordion__button" title="Expand"></button>';
					html += "</p>";
					html += generate(content_dir, item.files, highlight); // nested list
					html += "</li>";
				} else {
					html += '<li class="accordion" id="' + dir_name + '">';
					// Check if alias was given in meta.json file
					if (aliases[dir_name]) {
						dir_name = aliases[dir_name];
					}
					html += '<button class="accordion__button"><span>' + dir_name + "</span></button>";
					html += generate(content_dir, item.files, highlight); // nested list
					html += "</li>";
				}
			} else {
				// file name
				let file_name = path.basename(item.path);
				// Ignore index.md
				if (file_name === "index.md") {
					continue;
				}
				// item is a file
				// title from md document
				let name = item.title;
				// if an alias is provided in meta.json then we will use that
				// otherwise we use document title
				if (aliases[file_name]) {
					name = aliases[file_name];
				} else {
					// Regex [digit+]_ to remove the number prefix.
					if (/^\d+_/.test(name)) {
						// This will only be the case if no title is given inside .md file
						// and file name is being used for title
						name = name.replace(/^\d+_/, "");
					}
				}
				html +=
					'<li><a href="' +
					getDocURL(content_dir, item.path) +
					'" aria-current="' +
					(highlight === item.path) +
					`" ${DYNAMIC ? 'data-type="dynamic"' : ""}>` +
					name +
					"</a></li>";
			}
		}
	} catch (err) {
		console.log(err);
	}
	html += "</ul></div>";
	return html;
}
