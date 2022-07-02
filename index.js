import "dotenv/config";
import express from "express";
import session from "express-session";
import { v4 as uuidv4 } from "uuid";
import bodyParser from "body-parser";
import fs from "fs";

import db from "./database/db.js";
import apiRouter from "./routes/index.js";
import adminRouter from "./admin/routes/index.js";
import BookData from "./models/bookData.model.js";
import { redisFlushAll } from "./database/redisDb.js";

const PORT = process.env.port || 8000;

const app = express();

//db connection
db();

app.use(
	session({
		genid: (req) => {
			return uuidv4();
		},
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: false,
		cookie: {
			maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
			secure: false,
		},
	})
);

app.set("view engine", "ejs");
app.set("views", ["./admin/views", "./views"]);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Routes for the app
// public routes for static files
app.use("/public", express.static("public"));
app.use("/admin/public", express.static("admin/public"));

// admin routes
app.use("/admin", adminRouter);

// api routes
app.use("/api", apiRouter);

// home route
app.get("/", async (req, res) => {
	// fs.readFile("./vachnamrutText.json", "utf-8", async (err, data) => {
	// 	if (err) throw err;
	// 	var chapterList = JSON.parse(data);
	// 	for (var i = 0; i < chapterList.length; i++) {
	// 		var chapter = chapterList[i];
	// 		var bookData = new BookData({
	// 			title: chapter.title,
	// 			book: "62ac637d38b4c7339bffabd5",
	// 			data: chapter.content,
	// 		});
	// 		await bookData.save();
	// 	}
	// });
	return res.send({
		status: true,
		message: "Welcome to the API",
	});
});

// Start the server
app.listen(PORT, () => {
	console.log(`server is listnening at : http://localhost:${PORT}`);
});
