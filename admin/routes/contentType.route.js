import express from 'express';
import {
    contentTypeCreateGetController,
    contentTypeCreatePostController,
    contentTypeDeleteController,
    contentTypesController,
    contentTypeUpdateGetController,
    contentTypeUpdatePostController,
    contentTypeViewController,
} from '../controllers/contentType.controller.js';
import { idValidationMiddleware } from '../middlewares/idValidator.middleware.js';

const router = express.Router();


router.get('/', contentTypesController);

router.get("/delete/:id", idValidationMiddleware, contentTypeDeleteController);

router.get("/create", contentTypeCreateGetController);
router.get("/view/:id", idValidationMiddleware, contentTypeViewController);
router.get("/update/:id", idValidationMiddleware, contentTypeUpdateGetController);

router.post("/create", contentTypeCreatePostController);
router.post("/update/:id", idValidationMiddleware, contentTypeUpdatePostController);

export default router;