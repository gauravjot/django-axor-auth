import anchor from "markdown-it-anchor";
import hljs from "highlight.js";
import MarkdownIt from "markdown-it";
import katex from "katex";
import tm from "markdown-it-texmath";
import footnote_plugin from "markdown-it-footnote";
import markdownItCodeCopy from "markdown-it-code-copy";
import {parse} from "node-html-parser";
import { blockquoteAlertWrapper } from "./blockquote_alert_renderer.js";


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
 * Convert markdown content to HTML
 */
export function render(md_content: string) {
	const html = md.render(md_content);

	// in nextTitle and prevTitle, we need path of the file,
	// in-case a .html path was given, switch it to .md
  return { html: html, toc: generateTOC(html) };
}

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
	let classes: string[] = [];
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
  return {
    lines: ('lines' in obj) ? obj.lines as boolean : null,
    color: ('color' in obj) ? obj.color as string : null,
    title: ('title' in obj) ? obj.title as string : null,
    highlight: ('highlight' in obj) ? obj.highlight as string : null,
    start: ('start' in obj) ? obj.start as number : null,
  };
}

/**
 *
 * @param {number} lineNumber
 * @param {*} hlLinesAttribute e.g. "1-3,5,7-9,10-*"
 * @param {number} maxLines
 * @returns {number[]} e.g. [1,2,3,5,7,8,9,10,11,12,13,14,15]
 */
export function highlightedLines(hlLinesAttribute, maxLines): number[] {
	const hlLinesRanges = hlLinesAttribute.split(","); // Split the hl_lines attribute value by comma
	const highlightedLines: number[] = [];

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
	const mdHeadingList: any[] = [];
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
