/**
 * Get all the dynamic links and add click event listener to them
 */
let dynamic_a = document.querySelectorAll('[data-type="dynamic"]');
let loader = document.querySelector("#loading");
for (let i = 0; i < dynamic_a.length; i++) {
	dynamic_a[i].addEventListener("click", function (e) {
		//prevent event action
		e.preventDefault();
		dynamic_a[i].setAttribute("aria-current", "true");
		try {
			let parent = dynamic_a[i].parentElement;
			while (parent.id !== "sidebar-doc-list") {
				// if tagName is button, then it is an accordion
				if (parent.tagName.toUpperCase() === "LI" && parent.classList.contains("accordion")) {
					parent.setAttribute("aria-expanded", "true");
				}
				parent = parent.parentElement;
			}
		} catch (e) {
			// do nothing
		}
		// disable other aria-currents
		for (let j = 0; j < dynamic_a.length; j++) {
			if (dynamic_a[j] !== dynamic_a[i]) {
				dynamic_a[j].setAttribute("aria-current", "false");
			}
		}
		// find any other links with same href
		let other_links = document.querySelectorAll(`[href="${dynamic_a[i].href}"]`);
		for (let j = 0; j < other_links.length; j++) {
			other_links[j].setAttribute("aria-current", "true");
		}
		loader.classList.add("show");
		// fetch page contents if base url is same
		if (dynamic_a[i].href.startsWith(window.location.origin)) {
			fetch(dynamic_a[i].href)
				.then((response) => {
					response.text().then((text) => renderContent(text, dynamic_a[i].href));
				})
				.catch(() => {
					window.location.replace(dynamic_a[i].href);
				});
		} else {
			window.location.replace(dynamic_a[i].href);
		}
	});
}

/**
 * Render new content to the page
 * @param {string} html
 * @param {string} href
 */
function renderContent(html, href) {
	html = new DOMParser().parseFromString(html, "text/html");
	// Plug main content
	if (plug(html, "#content")) {
		// Plug title
		plug(html, "title");

		// Push new location
		history.pushState({}, "", href);
		// Hide loader
		loader.classList.remove("show");
		// Scroll to top
		window.scrollTo(0, 0);
	} else {
		window.location.replace(href);
	}
}

/**
 * Get the innerHTML content of elementSelector inside the html document
 * and plug it into the element with the same selector in the current document.
 * @param {Document} html
 * @param {string} elementSelector
 */
function plug(html, elementSelector) {
	try {
		let element = document.querySelector(elementSelector);
		if (element) {
			element.innerHTML = html.querySelector(elementSelector).innerHTML;
			return true;
		}
		return false;
	} catch (e) {
		return false;
	}
}

/**
 * Fire event on back and forward button click in browser
 */
window.addEventListener("popstate", function (e) {
	window.location.replace(document.location.href);
});