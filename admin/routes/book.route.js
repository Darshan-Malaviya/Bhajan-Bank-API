import express from "express";
import {
	bookCreateGetController,
	bookCreatePostController,
	bookDeleteController,
	booksController,
	bookUpdateGetController,
	bookUpdatePostController,
	bookViewController,
} from "../controllers/book.controller.js";
import { imageUpload } from "../helpers/multerStorage.js";

const router = express.Router();

router.get("/", booksController);

router.get("/delete/:id", bookDeleteController);

router.get("/create", bookCreateGetController);
router.get("/view/:id", bookViewController);
router.get("/update/:id", bookUpdateGetController);

router.post("/create", bookCreatePostController);
router.post("/update/:id", imageUpload.single('image'), bookUpdatePostController);

export default router;
