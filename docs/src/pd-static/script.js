// Sidebar toggle: breakpoint `md`
let sb = document.getElementById("sidebar");
let content = document.getElementById("content");
let nb = document.getElementById("navbar");
let isMobile = window.matchMedia("only screen and (max-width: 1023px)").matches;
if (isMobile) {
	hideSidebar();
}
if (window.matchMedia("only screen and (max-width: 1279px)").matches) {
	hideToc();
}
window.addEventListener("resize", () => {
	isMobile = window.matchMedia("only screen and (max-width: 1023px)").matches;
	if (isMobile) {
		hideSidebar();
	} else {
		showSidebar();
	}
	if (window.matchMedia("only screen and (max-width: 1279px)").matches) {
		hideToc();
	} else {
		showToc();
	}
});
function toggleSidebar() {
	if (sb.dataset.hidden === "true") {
		showSidebar();
	} else {
		hideSidebar();
	}
}
function showSidebar() {
	if (isMobile) {
		sb.dataset.hidden = "false";
		content.classList.remove("sidebar-open");
	} else {
		sb.dataset.hidden = "false";
		content.classList.add("sidebar-open");
		content.classList.remove("ml-16");
	}
}
function hideSidebar() {
	if (window.matchMedia("only screen and (min-width: 1536px)").matches) {
		return; // dont hide sidebar on large screens
	}
	if (isMobile) {
		sb.dataset.hidden = "true";
		content.classList.remove("sidebar-open");
	} else {
		sb.dataset.hidden = "true";
		content.classList.remove("sidebar-open");
		content.classList.add("ml-16");
	}
}

// Toggle TOC
function toggleToc() {
	if (window.matchMedia("only screen and (min-width: 1536px)").matches) {
		return; // dont hide
	}
	let toc = document.getElementById("toc-container");
	if (toc.dataset.hidden === "true") {
		showToc();
	} else {
		hideToc();
	}
	document.getElementsByClassName("toc-toggle-btn")[0].classList.toggle("rotate-arr");
}
function showToc() {
	let toc = document.getElementById("toc-container");
	toc.dataset.hidden = "false";
}
function hideToc() {
	let toc = document.getElementById("toc-container");
	toc.dataset.hidden = "true";
}

// Expand accordion for open page
const sbDocList = document.getElementById("sidebar-doc-list").getElementsByTagName("a");
for (let i = 0; i < sbDocList.length; i++) {
	if (sbDocList[i].getAttribute("aria-current") === "true") {
		let parent = sbDocList[i].parentElement;
		while (parent.id !== "sidebar-doc-list") {
			// if tagName is button, then it is an accordion
			if (parent.tagName.toUpperCase() === "LI" && parent.classList.contains("accordion")) {
				parent.setAttribute("aria-expanded", "true");
			}
			parent = parent.parentElement;
		}
		break;
	}
}

// Sidebar accordions on click listeners
const sbAccordions = document.getElementsByClassName("accordion");
for (let i = 0; i < sbAccordions.length; i++) {
	// Get first element of the accordion
	const btn = sbAccordions[i].getElementsByTagName("button")[0];
	btn.addEventListener("click", function (e) {
		e.preventDefault();
		let parent = e.target.parentElement;
		while (!parent.classList.contains("accordion")) {
			parent = parent.parentElement;
			if (parent.id === "sidebar-doc-list") {
				break;
			}
		}
		parent.setAttribute(
			"aria-expanded",
			parent.getAttribute("aria-expanded") === "true" ? "false" : "true",
		);
	});
}

// Highlight the current heading in toc on page scroll
window.addEventListener("scroll", () => {
	let tocLinks = document.getElementById("toc");
	if (typeof tocLinks !== "undefined" && tocLinks !== null) {
		tocLinks = tocLinks.getElementsByTagName("a");
		// If mobile, return
		if (isMobile) {
			return;
		}
		let latest;
		let fromTop = window.scrollY;
		// Get all headings under the element with id `md-content`
		const mdContent = document.getElementById("md-content");
		const mdHeads = mdContent.querySelectorAll("h2, h3, h4");
		for (let i = 0; i < mdHeads.length; i++) {
			// When heading is halfway from top, highlight the toc link
			if (
				mdHeads[i].offsetTop <= fromTop + 50 &&
				mdHeads[i].offsetTop + mdHeads[i].offsetHeight > fromTop + 50
			) {
				// Remove if new heading is selected
				latest = tocLinks[i];
			}
		}
		if (latest) {
			for (let i = 0; i < tocLinks.length; i++) {
				tocLinks[i].setAttribute("aria-current", "false");
			}
			latest.setAttribute("aria-current", "true");
		}
	}
});

// Shrink Nav bar on scroll
let target = nb.getElementsByTagName("div")[0];
window.onscroll = function () {
	let currentScrollPos = window.scrollY;
	if (currentScrollPos < 300) {
		target.classList.remove("h-14");
		target.classList.add("h-16");
	} else {
		target.classList.remove("h-16");
		target.classList.add("h-14");
	}
};

// When anchor links are clicked, have some offset from top
// see: https://jsfiddle.net/ianclark001/eqtosjtv/
(function (document, history, location) {
	var HISTORY_SUPPORT = !!(history && history.pushState);

	var anchorScrolls = {
		ANCHOR_REGEX: /^#[^ ]+$/,
		OFFSET_HEIGHT_PX: 96,

		/**
		 * Establish events, and fix initial scroll position if a hash is provided.
		 */
		init: function () {
			this.scrollToCurrent();
			window.addEventListener("hashchange", this.scrollToCurrent.bind(this));
			document.body.addEventListener("click", this.delegateAnchors.bind(this));
		},

		/**
		 * Return the offset amount to deduct from the normal scroll position.
		 * Modify as appropriate to allow for dynamic calculations
		 */
		getFixedOffset: function () {
			return this.OFFSET_HEIGHT_PX;
		},

		/**
		 * If the provided href is an anchor which resolves to an element on the
		 * page, scroll to it.
		 * @param  {String} href
		 * @return {Boolean} - Was the href an anchor.
		 */
		scrollIfAnchor: function (href, pushToHistory) {
			let match, rect, anchorOffset;

			if (!this.ANCHOR_REGEX.test(href)) {
				return false;
			}

			match = document.getElementById(href.slice(1));

			if (match) {
				rect = match.getBoundingClientRect();
				anchorOffset = window.scrollY + rect.top - this.getFixedOffset();
				window.scrollTo(window.scrollY, anchorOffset);

				// Add the state to history as-per normal anchor links
				if (HISTORY_SUPPORT && pushToHistory) {
					history.pushState({}, document.title, location.pathname + href);
				}
			}

			return !!match;
		},

		/**
		 * Attempt to scroll to the current location's hash.
		 */
		scrollToCurrent: function () {
			this.scrollIfAnchor(window.location.hash);
		},

		/**
		 * If the click event's target was an anchor, fix the scroll position.
		 */
		delegateAnchors: function (e) {
			let elem = e.target;

			if (elem.nodeName === "A" && this.scrollIfAnchor(elem.getAttribute("href"), true)) {
				e.preventDefault();
			}
		},
	};

	window.addEventListener("DOMContentLoaded", anchorScrolls.init.bind(anchorScrolls));
})(window.document, window.history, window.location);
