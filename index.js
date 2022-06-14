import "dotenv/config";
import express from "express";

import db from "./db.js";
import apiRouter from "./routes/index.js";
import adminRouter from "./admin/routes/index.js";

const PORT = process.env.port || 8000;

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.set("view engine", "ejs");
app.set("views", ["./admin/views", "./views"]);

//db connection
db();

// Routes for the app
// public routes for static files
app.use("/public", express.static("public"));

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
