import express from "express";
import {
	bookDeleteController,
	booksController,
	bookViewController,
} from "../controllers/book.controller.js";

const router = express.Router();

router.get("/", booksController);

router.get("/delete/:id", bookDeleteController);

router.get("/:operation/:id?", bookViewController);

export default router;
