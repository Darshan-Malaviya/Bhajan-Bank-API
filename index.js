import "dotenv/config";
import express from "express";
import handlebars from "express-handlebars";
import session from "express-session";
import { v4 as uuidv4 } from "uuid";

import db from "./db.js";
import apiRouter from "./routes/index.js";
import adminRouter from "./admin/routes/index.js";

const PORT = process.env.port || 8000;

const app = express();

app.use(
	session({
		genid: (req) => {
			return uuidv4(); // use UUIDs for session IDs
		},
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: false,
		cookie: {
			maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
			secure: true,
		},
	})
);

const hbs = handlebars.create({
	defaultLayout: "main",
	extname: ".hbs",
	partialsDir: ["admin/views/partials"],
});

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.set("views", ["./admin/views", "./views"]);

//db connection
db();

// Routes for the app
// public routes for static files
app.use("/public", express.static("public"));
app.use("/admin/public", express.static("admin/public"));

// admin routes
app.use("/admin", adminRouter);

// api routes
app.use("/api", apiRouter);

app.get("/", (req, res) => {
	res.send({ status: true, message: "Hello World" });
});

// Start the server
app.listen(PORT, () => {
	console.log(`server is listnening at : http://localhost:${PORT}`);
});
