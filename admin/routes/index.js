import express from "express";
import { homeController } from "../controllers/index.js";
import bookRouter from "./book.route.js";

const router = express.Router();

// admin public file serve
router.use("/public", express.static("/admin/public"));

router.get("/", homeController);

// admin/books
router.use("/book", bookRouter);

export default router;
