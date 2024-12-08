import {type TreeNode} from "./get_files.js";
import { SETTINGS } from "../config/app.js";
import { buildTree } from './get_files';

const DYNAMIC = SETTINGS.dynamic_hydration ?? false;

/**
 * This function generates a list that is used in the sidebar
 * to show the document tree.
 */
export function generateSidebarList(version: string, docs: any, highlight: string = ""): string {
  const g = generate(version, buildTree(docs), highlight);
  return g;
}

function generate(version: string, docs: TreeNode[], highlight = "") {
  let html = "<div><ul>";
	try {
    for (let i = 0; i < docs.length; i++) {
      let doc = docs[i];
			if (doc.children.length > 0) {
        // item is a directory
				if (doc.path && doc.is_empty === false) {
					html += '<li class="accordion" id="' + doc.slug + '">';
					html += '<p class="flex place-items-center">';
					html += `<a href="/${version}/${doc.slug}" class="flex-1" aria-current="${highlight === doc.path}" ${DYNAMIC ? 'data-type="dynamic"' : ""}><span>${doc.title}</span></a>`;
					html += '<button class="accordion__button" title="Expand"></button>';
					html += "</p>";
					html += generate(version, doc.children, highlight); // nested list
					html += "</li>";
				} else {
					html += '<li class="accordion" id="' + doc.slug + '">';
					html += '<button class="accordion__button"><span>' + doc.title + "</span></button>";
					html += generate(version, doc.children, highlight); // nested list
					html += "</li>";
				}
      } else {
        // Skip index.md
        if (doc.path === "index.md") {
          continue;
        }

				html +=
					`<li><a href="/${version}/` + doc.slug +
					'" aria-current="' +
					(highlight === doc.path) +
					`" ${DYNAMIC ? 'data-type="dynamic"' : ""}>` +
					doc.title +
					"</a></li>";
			}
		}
  } catch (err) {
		console.log(err);
	}
	html += "</ul></div>";
	return html;
}
