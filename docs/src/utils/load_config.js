import {META, INLCUDE, SETTINGS} from "../../config/app.js";
import {SIDEBAR} from "../../config/sidebar.js";

export function loadMeta() {
	return META;
}

export function loadSettings() {
	return SETTINGS;
}

export function loadLinks() {
	const stylesheets = [];
	INLCUDE.links.forEach((link) => {
		// Create HTML link element
		let html = `<link rel="${link.rel}" href="${link.href}" ${link.crossorigin ? "crossorigin" : ""}/>`;
		stylesheets.push(html);
	});
	return stylesheets;
}

export function loadScripts() {
	const scripts = [];
	INLCUDE.scripts.forEach((script) => {
		// Create HTML script element
		scripts.push(`<script src="${script.src}"></script>`);
	});
	return scripts;
}

export function loadSidebarLinks() {
	const links = SIDEBAR.permalinks;
	// main
	let mainlinks = [];
	if (links.main.enabled) {
		mainlinks = links.main.links.map((link) => {
			return `<li><a href="${link.href}" ${
				link.open_in_new
					? `target="_blank"
      rel="noopener noreferrer"`
					: ""
			}>${link.title}</a></li>`;
		});
	}
	// foot
	let footlinks = [];
	if (links.foot.enabled) {
		footlinks = links.foot.links.map((link) => {
			return `<a href="${link.href}" ${
				link.open_in_new
					? `target="_blank"
      rel="noopener noreferrer"`
					: ""
			}>${link.title}</a>`;
		});
	}
	return {
		main: mainlinks,
		foot: footlinks,
	};
}
