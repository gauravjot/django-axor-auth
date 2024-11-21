import {minifyJS} from "./build";

test("minifyJS Test 1", () => {
	const input = "function foo() { console.log('foo'); }";
	const expected = "function foo(){console.log('foo');}";
	const actual = minifyJS(input);
	expect(actual).toBe(expected);
});

test("minifyJS Test 2: New Lines and Tabs", () => {
	const input = "function foo() {\n\tconsole.log('foo');\n}";
	const expected = "function foo(){console.log('foo');}";
	const actual = minifyJS(input);
	expect(actual).toBe(expected);
});

test("minifyJS Test 3: Arithmatics", () => {
	const input = "const a = 1 + 2 * 3 / 4 - 5;";
	const expected = "const a=1+2*3/4-5;";
	const actual = minifyJS(input);
	expect(actual).toBe(expected);
});

test("minifyJS Test 4: Escape String Literals", () => {
	const input = 'let isMobile = window.matchMedia("only screen and (max-width: 1023px)").matches;';
	const expected = 'let isMobile=window.matchMedia("only screen and (max-width: 1023px)").matches;';
	const actual = minifyJS(input);
	expect(actual).toBe(expected);
});

test("minifyJS Test 5: & and | Operators", () => {
	const input =
		'if (parent.tagName.toUpperCase() === "LI" && parent.classList.contains("accordion") || isTrue) {\nparent.setAttribute("aria-expanded", "true");\n}';
	const expected =
		'if(parent.tagName.toUpperCase()==="LI"&&parent.classList.contains("accordion")||isTrue){parent.setAttribute("aria-expanded","true");}';
	const actual = minifyJS(input);
	expect(actual).toBe(expected);
});
