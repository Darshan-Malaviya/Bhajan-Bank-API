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
import { idValidationMiddleware } from "../middlewares/idValidator.middleware.js";

const router = express.Router();

router.get("/", booksController);

router.get("/delete/:id", idValidationMiddleware, bookDeleteController);

router.get("/create", bookCreateGetController);
router.get("/view/:id", idValidationMiddleware, bookViewController);
router.get("/update/:id", idValidationMiddleware, bookUpdateGetController);

router.post("/create", bookCreatePostController);
router.post("/update/:id", idValidationMiddleware, bookUpdatePostController);

export default router;
