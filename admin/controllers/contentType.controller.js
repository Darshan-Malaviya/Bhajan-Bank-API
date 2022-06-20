import ContentType from "../models/contentType.model.js";
import { v4 as uuidv4 } from "uuid";
import { randomStringFromCrypto } from "../helpers/uniqueGenerator.js";
import { messagePusher } from "../middlewares/message.middleware.js";
import { redisSet, redisGet } from "../../database/redisDb.js";

export const contentTypesController = async (req, res) => {
    var rows = await ContentType.find({});
    res.render("pages/contentType/index", { title: "ContentType", table: "contentType", pagePath: "ContentType", rows: rows });
}

export const contentTypeViewController = async (req, res) => {
    const id = req.params.id;
    var row = await ContentType.findById(id).lean();
    const resParams = {
        pagePath: "ContentType / View",
        title: "ContentType View",
        operation: "view",
        row: row,
        id: id,
        table: "contentType",
    };
    res.render("pages/contentType/view", resParams);
};

export const contentTypeCreateGetController = async (req, res) => {
    const csrfToken = randomStringFromCrypto(16);
    redisSet(csrfToken, "csrfToken", 60 * 5); // 5 minutes

    const resParams = {
        pagePath: "ContentType Create",
        title: "ContentType Create",
        operation: "create",
        table: "contentType",
        csrfToken: csrfToken,
    };
    res.render("pages/contentType/view", resParams);
}

export const contentTypeCreatePostController = async (req, res) => {
    const csrfToken = req.body.csrfToken;
    if (csrfToken) {
        const csrfValue = await redisGet(csrfToken);
        if (csrfValue) {
            ContentType.create({
                name: req.body.name,
                identifier: req.body.identifier,
                description: req.body.description
            }, (err, contentType) => {
                if (err) {
                    messagePusher(req, "danger", "ContentType not created\nError : " + err);
                }
                else {
                    if (contentType) {
                        messagePusher(req, "success", contentType.name + " ContentType created successfully");
                    }
                    else {
                        messagePusher(req, "danger", "ContentType not found");
                    }
                }
            });
        } else {
            messagePusher(req, "danger", "Invalid csrf token");
        }
    } else {
        messagePusher(req, "danger", "CSRF Token not found");
    }
    return res.redirect("/admin/contentType");
};

export const contentTypeUpdateGetController = async (req, res) => {
    const id = req.params.id;
    const csrfToken = randomStringFromCrypto(16);
    redisSet(csrfToken, "csrfToken", 60 * 5); // 5 minutes

    const row = await ContentType.findById(id).lean();
    const resParams = {
        pagePath: "ContentType Update",
        title: "ContentType Update",
        operation: "update",
        id: id,
        row: row,
        table: "contentType",
        csrfToken: csrfToken,
    };
    res.render("pages/contentType/view", resParams);
};

export const contentTypeUpdatePostController = async (req, res, next) => {
    const id = req.params.id;
    const csrfToken = req.body.csrfToken;
    if (csrfToken) {
        const csrfValue = await redisGet(csrfToken);
        if (csrfValue) {
            ContentType.findByIdAndUpdate(id, {
                name: req.body.name,
                identifier: req.body.identifier,
                description: req.body.description
            }, (err, doc) => {
                if (err) {
                    if (err.name === 'CastError') {
                        messagePusher(req, "danger", "Invalid ContentType id");
                    } else {
                        messagePusher(req, "danger", "ContentType not updated " + err);
                    }
                } else {
                    messagePusher(req, "success", `"${doc.name}" ContentType updated successfully`);
                }
            });
        } else {
            messagePusher(req, "danger", "Invalid CSRF token");
        }
    } else {
        messagePusher(req, "danger", "CSRF token not found");
    }
    return res.redirect("/admin/contentType");
};

export const contentTypeDeleteController = (req, res) => {
    const id = req.params.id;
    ContentType.findByIdAndDelete(id, (err, row) => {
        if (err) {
            messagePusher(req, "danger", "ContentType not deleted");
        } else {
            if (row) {
                messagePusher(
                    req,
                    "success",
                    row.name + " ContentType deleted successfully"
                );
            } else {
                messagePusher(req, "danger", "ContentType not found");
            }
        }
        res.redirect("/admin/contentType");
    });
};
