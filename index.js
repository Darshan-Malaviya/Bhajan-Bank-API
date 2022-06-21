import "dotenv/config";
import express from "express";
import session from "express-session";
import { v4 as uuidv4 } from "uuid";
import bodyParser from "body-parser";

import db from "./database/db.js";
import apiRouter from "./routes/index.js";
import adminRouter from "./admin/routes/index.js";
import { Admin, Permission } from "./admin/models/index.js";
import { getBreadcrumbs } from "./admin/middlewares/breadcrumbs.middleware.js";

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

app.use((req, res, next) => {
	res.locals.req = req;
	next();
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Routes for the app
// public routes for static files
app.use("/public", express.static("public"));
app.use("/admin/public", express.static("admin/public"));

// admin routes
app.use("/admin", getBreadcrumbs, adminRouter);

// api routes
app.use("/api", apiRouter);

app.get("/", (req, res) => {

	Permission.aggregate([
		{ $match: { isActive: true } },
		{ $lookup: { from: "contenttypes", localField: "contentType", foreignField: "_id", as: "contentType" } },
		{
			$group: {
				_id: "$contentType.identifier",
				permissions: {
					$push: "$name",
				},
			}
		},
		{
			$set: {
				contentType: {
					$arrayElemAt: ["$_id", 0],
				}
			},
		},
		{
			$project: {
				_id: 0,
				contentType: 1,
				permissions: 1,
			}
		},
	])
		.then(permissions => {
			res.send(permissions);
		}).catch(err => {
			res.send(err);
		});
});

// Start the server
app.listen(PORT, () => {
	console.log(`server is listnening at : http://localhost:${PORT}`);
});
