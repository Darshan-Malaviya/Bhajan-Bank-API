import { v4 as uuidv4 } from "uuid";
import { randomStringFromCrypto } from "../helpers/uniqueGenerator.js";
import { messagePusher } from "../middlewares/message.middleware.js";
import { redisSet, redisGet } from "../../database/redisDb.js";
import { idValidator } from "../helpers/validation.js";
import { ContentType, Permission } from '../models/index.js'

export const permissionsController = async (req, res) => {
    var rows = await Permission.find({}).populate('contentType');
    res.render("pages/permission/index", { title: "Permission", table: "permission", pagePath: "Permission", rows: rows });
}

export const permissionViewController = async (req, res) => {
    const id = req.params.id;
    var row = await Permission.findById(id).populate('contentType');
    const resParams = {
        pagePath: "Permission / View",
        title: "Permission View",
        operation: "view",
        row: row,
        id: id,
        table: "permission",
    };
    res.render("pages/permission/view", resParams);
};

export const permissionCreateGetController = async (req, res) => {
    const csrfToken = randomStringFromCrypto(16);
    redisSet(csrfToken, "csrfToken", 60 * 5); // 5 minutes

    const contentTypes = await ContentType.find({}, { identifier: 1 });

    const resParams = {
        pagePath: "Permission Create",
        title: "Permission Create",
        operation: "create",
        table: "permission",
        csrfToken: csrfToken,
        contentTypes: contentTypes,
    };
    res.render("pages/permission/view", resParams);
}

export const permissionCreatePostController = async (req, res) => {
    const csrfToken = req.body.csrfToken;
    if (csrfToken) {
        const csrfValue = await redisGet(csrfToken);
        if (csrfValue) {
            Permission.create({
                name: req.body.name,
                identifier: req.body.identifier,
                description: req.body.description,
                contentType: req.body.contentType,
                isActive: req.body.isActive == "on" ? true : false,
            }, (err, permission) => {
                if (err) {
                    messagePusher(req, "danger", "Permission not created\nError : " + err);
                }
                else {
                    if (permission) {
                        messagePusher(req, "success", permission.name + " Permission created successfully");
                    }
                    else {
                        messagePusher(req, "danger", "Permission not found");
                    }
                }
            });
        } else {
            messagePusher(req, "danger", "Invalid csrf token");
        }
    } else {
        messagePusher(req, "danger", "CSRF Token not found");
    }
    return res.redirect("/admin/permission");
};

export const permissionUpdateGetController = async (req, res) => {
    const id = req.params.id;

    const csrfToken = randomStringFromCrypto(16);
    redisSet(csrfToken, "csrfToken", 60 * 5); // 5 minutes

    const row = await Permission.findById(id).populate('contentType');
    const contentTypes = await ContentType.find({}, { identifier: 1 });

    const resParams = {
        pagePath: "Permission Update",
        title: "Permission Update",
        operation: "update",
        id: id,
        row: row,
        table: "permission",
        csrfToken: csrfToken,
        contentTypes: contentTypes,
    };
    res.render("pages/permission/view", resParams);
};

export const permissionUpdatePostController = async (req, res, next) => {
    const id = req.params.id;
    const csrfToken = req.body.csrfToken;
    if (csrfToken) {
        const csrfValue = await redisGet(csrfToken);
        if (csrfValue) {
            Permission.findByIdAndUpdate(id, {
                name: req.body.name,
                identifier: req.body.identifier,
                description: req.body.description,
                contentType: req.body.contentType,
                isActive: req.body.isActive == 'on' ? true : false,
            }, (err, doc) => {
                if (err) {
                    if (err.name === 'CastError') {
                        messagePusher(req, "danger", "Invalid Permission id");
                    } else {
                        messagePusher(req, "danger", "Permission not updated " + err);
                    }
                } else {
                    messagePusher(req, "success", `"${doc.name}" Permission updated successfully`);
                }
            });
        } else {
            messagePusher(req, "danger", "Invalid CSRF token");
        }
    } else {
        messagePusher(req, "danger", "CSRF token not found");
    }
    return res.redirect("/admin/permission");
};

export const permissionDeleteController = (req, res) => {
    const id = req.params.id;
    Permission.findByIdAndDelete(id, (err, row) => {
        if (err) {
            messagePusher(req, "danger", "Permission not deleted");
        } else {
            if (row) {
                messagePusher(
                    req,
                    "success",
                    row.name + " Permission deleted successfully"
                );
            } else {
                messagePusher(req, "danger", "Permission not found");
            }
        }
        res.redirect("/admin/permission");
    });
};
