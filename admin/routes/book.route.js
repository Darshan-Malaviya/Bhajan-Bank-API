import express from "express";
import {
	bookCreateGetController,
	bookCreatePostController,
	bookDataController,
	bookDataCreateGetController,
	bookDataCreatePostController,
	bookDataDeleteController,
	bookDataStatusController,
	bookDataUpdateGetController,
	bookDataUpdatePostController,
	bookDeleteController,
	bookWordController,
	booksController,
	bookStatusController,
	bookUpdateGetController,
	bookUpdatePostController,
	bookWordAddController,
	bookWordDeleteController,
	bookWordGetController,
	bookWordStatusController,
	bookWordUpdateController,
	// bookViewController,
} from "../controllers/book.controller.js";
import {
	bookDataValidationMiddleware,
	bookValidationMiddleware,
	bookWordValidationMiddleware,
	idValidationMiddleware,
	idValidationMiddlewareForApi,
} from "../middlewares/validator.middleware.js";

const router = express.Router();
const dataRouter = express.Router();

router.get("/", booksController);
router.get("/create", bookCreateGetController);
router.post("/create", bookValidationMiddleware, bookCreatePostController);
router.get("/update/:id", idValidationMiddleware, bookUpdateGetController);
router.post(
	"/update/:id",
	idValidationMiddlewareForApi,
	bookValidationMiddleware,
	bookUpdatePostController
);
router.post(
	"/update-status/:id",
	idValidationMiddlewareForApi,
	bookStatusController
);
router.delete(
	"/delete/:id",
	idValidationMiddlewareForApi,
	bookDeleteController
);

router.get("/words", bookWordController);
router.get("/word/:id", idValidationMiddlewareForApi, bookWordGetController);
router.post("/word/add", bookWordValidationMiddleware, bookWordAddController);
router.post(
	"/word/update/:id",
	idValidationMiddlewareForApi,
	bookWordValidationMiddleware,
	bookWordUpdateController
);
router.post(
	"/word/update-status/:id",
	idValidationMiddlewareForApi,
	bookWordStatusController
);
router.delete(
	"/word/delete/:id",
	idValidationMiddlewareForApi,
	bookWordDeleteController
);

dataRouter.get("/", bookDataController);
dataRouter.delete(
	"/:id",
	idValidationMiddlewareForApi,
	bookDataDeleteController
);
dataRouter.get("/create", bookDataCreateGetController);
dataRouter.post(
	"/create",
	bookDataValidationMiddleware,
	bookDataCreatePostController
);
dataRouter.get(
	"/update/:id",
	idValidationMiddlewareForApi,
	bookDataUpdateGetController
);
dataRouter.post(
	"/update/:id",
	idValidationMiddlewareForApi,
	bookDataValidationMiddleware,
	bookDataUpdatePostController
);
dataRouter.post(
	"/update-status/:id",
	idValidationMiddlewareForApi,
	bookDataStatusController
);

export default router;
export { dataRouter };
