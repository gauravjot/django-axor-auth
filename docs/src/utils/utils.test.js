import path from "path";
import {fileURLToPath} from "url";
import {getDocURL} from "./get_doc_url.js";
import {highlightedLines, parseCodeBlockAttrs} from "./generate_doc_page.js";

// get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
let content_dir = path.join(__dirname, "..", "content");

test("getDocURL Test 2: Absolute Path", () => {
	const input = path.join(content_dir, "0_Installation.md");
	const expected = "/0_Installation.html";
	const actual = getDocURL(content_dir, input);
	expect(actual).toBe(expected);
});

test("getDocURL Test 3: Nested Path", () => {
	const input = path.join(content_dir, "nested", "0_Installation.md");
	const expected = "/nested/0_Installation.html";
	const actual = getDocURL(content_dir, input);
	expect(actual).toBe(expected);
});

test("getDocURL Test 4: Nested Path with Single Space", () => {
	const input = path.join(content_dir, "nested", "0 Installation.md");
	const expected = "/nested/0%20Installation.html";
	const actual = getDocURL(content_dir, input);
	expect(actual).toBe(expected);
});

test("getDocURL Test 5: Nested Path with Multiple Spaces", () => {
	const input = path.join(content_dir, "nested", "0 Installation  1.md");
	const expected = "/nested/0%20Installation%20%201.html";
	const actual = getDocURL(content_dir, input);
	expect(actual).toBe(expected);
});

test("getDocURL Test 6: Nested Path with Special Characters", () => {
	const input = path.join(content_dir, "nested", "0 Installation 1!@#$%^&(),'_+{}[].md");
	// URL safe characters are not escaped,
	// see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent#description
	const expected = "/nested/0%20Installation%201!%40%23%24%25%5E%26()%2C'_%2B%7B%7D%5B%5D.html";
	const actual = getDocURL(content_dir, input);
	expect(actual).toBe(expected);
});

test("highlightedLines Test 1: Empty String", () => {
	const input = "";
	const expected = [];
	const actual = highlightedLines(input);
	expect(actual).toEqual(expected);
});

test("highlightedLines Test 2: Single Line", () => {
	const input = "1";
	const expected = [1];
	const actual = highlightedLines(input, 5);
	expect(actual).toEqual(expected);
});

test("highlightedLines Test 3: Multiple Lines", () => {
	const input = "1,2,3";
	const expected = [1, 2, 3];
	const actual = highlightedLines(input, 5);
	expect(actual).toEqual(expected);
});

test("highlightedLines Test 4: Range", () => {
	const input = "1-3";
	const expected = [1, 2, 3];
	const actual = highlightedLines(input, 5);
	expect(actual).toEqual(expected);
});

test("highlightedLines Test 5: Range ending with *", () => {
	const input = "1-3,7-*";
	const expected = [1, 2, 3, 7, 8, 9];
	const actual = highlightedLines(input, 9);
	expect(actual).toEqual(expected);
});

test("highlightedLines Test 6: Range starting with *", () => {
	const input = "*-3,6-7,9";
	const expected = [1, 2, 3, 6, 7, 9];
	const actual = highlightedLines(input, 9);
	expect(actual).toEqual(expected);
});

test("parseCodeBlockAttrs Test 1: Empty String", () => {
	const input = "";
	const expected = {};
	const actual = parseCodeBlockAttrs(input);
	expect(actual).toEqual(expected);
});

test("parseCodeBlockAttrs Test 2: All Attributes", () => {
	const input = 'color="good" lines highlight="1,3-7" title="Code"';
	const expected = {
		color: "good",
		lines: true,
		highlight: "1,3-7",
		title: "Code",
	};
	const actual = parseCodeBlockAttrs(input);
	expect(actual).toEqual(expected);
});

test("parseCodeBlockAttrs Test 2: Lines Attribute", () => {
	const input = 'lines="false"';
	const expected = {
		lines: false,
	};
	const actual = parseCodeBlockAttrs(input);
	expect(actual).toEqual(expected);
});
