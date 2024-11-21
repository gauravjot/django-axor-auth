import express from "express";
// import { urlencoded, json } from "body-parser";
import {join} from "path";
import path from "path";
import {fileURLToPath} from "url";
import {generateDocPage} from "./utils/generate_doc_page.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.static(join(__dirname, "..", "public")));
app.use("/pd-static", express.static(join(__dirname, "pd-static")));
// app.use(urlencoded({ extended: true }));
// app.use(json());

// Set up EJS
app.set("views", join(__dirname, "./templates"));
app.set("view engine", "ejs");

/*
 * Routes
 */
app.get("*", (req, res) => {
	res.render("doc_page", generateDocPage(req.url));
});

/*
 * Start server
 */

const app_instance = app.listen(3000, () => {
	console.log("Server started at http://localhost:3000/");
});

process.on("SIGINT", function () {
	app_instance.close();
	process.exit();
});
