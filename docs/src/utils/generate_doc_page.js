import matter from "gray-matter";
import path from "path";
import anchor from "markdown-it-anchor";
import hljs from "highlight.js";
import MarkdownIt from "markdown-it";
import {fileURLToPath} from "url";
import katex from "katex";
import tm from "markdown-it-texmath";
import footnote_plugin from "markdown-it-footnote";
import markdownItCodeCopy from "markdown-it-code-copy";
import {parse} from "node-html-parser";
import {loadLinks, loadMeta, loadScripts, loadSettings, loadSidebarLinks} from "./load_config.js";

import {generateSidebarList} from "./generate_sidebar.js";
import {getDocURL} from "./get_doc_url.js";
import {formatDate} from "./datetime.js";
import { blockquoteAlertWrapper } from "./blockquote_alert_renderer.js";

// get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let content_dir = path.join(__dirname, "..", "..", "content");

// markdown-it options
const md = MarkdownIt({
	html: true,
	xhtmlOut: true,
	breaks: true,
	highlight: highlightCode,
});
md.use(anchor, {
	slugify: (s) => encodeURIComponent(String(s).trim().toLowerCase().replace(/\s+/g, "-")),
	permalink: anchor.permalink.headerLink({
		safariReaderFix: true,
	}),
});
md.use(tm, {
	engine: katex,
	delimiters: "dollars",
	katexOptions: {output: "mathml", trust: true},
});
md.use(markdownItCodeCopy, {
	iconClass: "copy-icon",
	iconStyle: "",
});
md.use(footnote_plugin);
md.use(blockquoteAlertWrapper, {});

/**
 * Generates a doc page for express to render
 *
 * @param {string} url  URL of doc, eg. /folder/doc.html
 * @returns {{
 *  post: string,
 *  title: string,
 *  date: string,
 *  description: string,
 *  docs: string,
 *  next: string,
 *  prev: string,
 *  nextTitle:string,
 *  prevTitle:string
 * }}
 */
export function generateDocPage(url) {
	// replace trailing .html
	url = url.replace(/\.html$/, "");
	// Get the file tree
	const path_chunks = url.split("/");
	// remove first empty string
	path_chunks.shift();
	// decode chunks to get actual file name
	for (let i = 0; i < path_chunks.length; i++) {
		path_chunks[i] = decodeURIComponent(path_chunks[i]);
	}
	// Get absolute file path
	const filename = path_chunks.pop();
	const file_relative_path = path_chunks.join("/");
	const filepath = path.join(
		content_dir,
		file_relative_path,
		(filename ? filename : "index") + ".md",
	);

	// read the markdown file
	const file = matter.read(filepath);

	// use markdown-it to convert content to HTML
	const content = file.content;
	const html = md.render(content);

	// in nextTitle and prevTitle, we need path of the file,
	// in-case a .html path was given, switch it to .md
	return {
		post: html,
		title: file.data.title,
		date: formatDate(file.data.date),
		description: file.data.description,
		next: getDocURL(content_dir, file.data.next) || "",
		nextTitle: parseDocTitle(file.data.next ? file.data.next.replace(/\.html$/, ".md") : ""),
		prev: getDocURL(content_dir, file.data.prev) || "",
		prevTitle: parseDocTitle(file.data.prev ? file.data.prev.replace(/\.html$/, ".md") : ""),
		docs: generateSidebarList(content_dir, filepath),
		toc: generateTOC(html),
		// Configuration options set by the user
		config: config_options,
	};
}

/**
 * Takes file path of doc and returns title
 *
 * @param {string} file_path absolute OR relative to content directory
 * @returns {string} title of the document
 */
export function parseDocTitle(file_path) {
	if (!file_path) {
		return "";
	}
	// read file
	const file = file_path.startsWith(content_dir)
		? matter.read(file_path)
		: matter.read(path.join(content_dir, file_path));
	return file.data.title || file_path.replace(/^\d+_/, "").replaceAll("_", " ");
}

const config_options = {
	meta: loadMeta(),
	links: loadLinks(),
	scripts: loadScripts(),
	sidebar: {
		links: loadSidebarLinks(),
	},
	settings: loadSettings(),
};

function highlightCode(str, lang, attrs) {
	let attr = parseCodeBlockAttrs(attrs);
	let line_start = attr.start ? attr.start : 1;

	let block = `<pre class="hljsp-pre${attr.color ? " " + attr.color : ""}">`;
	if (attr.title) {
		block += `<div class="hljsp-title">${attr.title}</div>`;
	}
	let hl = `${str}`;
	let hl_success = false;
	if (lang && hljs.getLanguage(lang)) {
		try {
			hl = hljs.highlight(str, {language: lang}).value;
			hl_success = true;
		} catch (__) {}
	}
	if (hl_success) {
		block += `<code class="language-${lang}" style="counter-reset: line ${line_start - 1};">`;
	} else {
		block += `<code>`;
	}
	let classes = [];
	if (attr.lines) {
		classes.push("hljsp-linenums");
	}
	// split into lines array
	let lines = hl.split("\n");
	// trim the last line if it is empty
	if (lines[lines.length - 1] === "") {
		lines.pop();
	}
	// wrap each line in a span and highlight if needed
	const highlighted_lines = attr.highlight
		? highlightedLines(attr.highlight, lines.length + line_start)
		: [];
	lines = lines.map((line, index) => {
		let is_highlighted_line = highlighted_lines.includes(index + line_start);
		let span_class = classes.join(" ") + (is_highlighted_line ? " hljsp-linehl" : "");
		span_class = span_class.trim();
		return `<span class="${span_class}">${line}</span>`;
	});
	// join the lines back
	block += lines.join("\n");
	block += "</code></pre>";
	return block;
}

/**
 *
 * @param {*} str
 * @returns {{lines?:boolean; color?: good|bad; title?:string; highlight?:string; start?:number}}
 */
export function parseCodeBlockAttrs(str) {
	const obj = {};
	str.replace(/(\w+)(?:\s*=\s*"([^"]*)")?/g, (match, key, value) => {
		if (value === "true" || value === undefined) {
			obj[key] = true;
		} else if (value === "false") {
			obj[key] = false;
		} else {
			if (key === "start") {
				try {
					obj[key] = parseInt(value);
				} catch (e) {
					obj[key] = 1;
				}
			} else {
				obj[key] = value;
			}
		}
	});
	return obj;
}

/**
 *
 * @param {number} lineNumber
 * @param {*} hlLinesAttribute e.g. "1-3,5,7-9,10-*"
 * @param {number} maxLines
 * @returns {number[]} e.g. [1,2,3,5,7,8,9,10,11,12,13,14,15]
 */
export function highlightedLines(hlLinesAttribute, maxLines) {
	const hlLinesRanges = hlLinesAttribute.split(","); // Split the hl_lines attribute value by comma
	const highlightedLines = [];

	hlLinesRanges.forEach((range) => {
		range = range.trim();
		if (range === "") {
			return;
		}
		if (range.includes("-")) {
			const [start, end] = range.split("-");
			if (start === "*") {
				for (let i = 1; i <= Number(end); i++) {
					highlightedLines.push(i);
				}
			} else if (end === "*") {
				for (let i = Number(start); i <= maxLines; i++) {
					highlightedLines.push(i);
				}
				// We can break here because * will always be the last range
				return;
			} else {
				for (let i = Number(start); i <= Number(end); i++) {
					highlightedLines.push(i);
				}
			}
		} else {
			highlightedLines.push(Number(range));
		}
	});

	return highlightedLines;
}

/**
 * Generate TOC for the markdown content
 */
function generateTOC(html) {
	// Get all headings under the element with id `md-content`
	const mdContent = parse(html);
	const mdHeads = mdContent.querySelectorAll("h2, h3, h4");
	// Get all hrefs of a tag inside heading, also note the level
	const mdHeadingList = [];
	for (let i = 0; i < mdHeads.length; i++) {
		mdHeadingList.push({
			text: mdHeads[i].textContent,
			href: `#${mdHeads[i].id}`,
			level: mdHeads[i].tagName,
		});
	}
	// TOC: Render the table of contents
	let res = `<ul id="toc">`;
	for (let i = 0; i < mdHeadingList.length; i++) {
		res += `<li class="${giveMarginForHeading(mdHeadingList[i])}">`;
		res += `<a href="${mdHeadingList[i].href}">${mdHeadingList[i].text}</a>`;
		res += `</li>`;
	}
	res += `</ul>`;
	function giveMarginForHeading(heading) {
		if (heading.level === "H2" || heading.level === "H1") {
			return "pl-0";
		} else if (heading.level === "H3") {
			return "toc-h3-indent";
		} else {
			return "toc-h4-indent";
		}
	}
	return res;
}
