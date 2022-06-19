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

const router = express.Router();


router.get('/', contentTypesController);

router.get("/delete/:id", contentTypeDeleteController);

router.get("/create", contentTypeCreateGetController);
router.get("/view/:id", contentTypeViewController);
router.get("/update/:id", contentTypeUpdateGetController);

router.post("/create", contentTypeCreatePostController);
router.post("/update/:id", contentTypeUpdatePostController);

export default router;