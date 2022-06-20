import { randomStringFromCrypto } from "../helpers/uniqueGenerator.js";
import { messagePusher } from "../middlewares/message.middleware.js";
import { redisSet, redisGet } from "../../database/redisDb.js";
import { idValidator } from "../helpers/validation.js";
import { Admin } from '../models/index.js';
import { encryptPassword } from "../helpers/password.js";

export const adminsController = async (req, res) => {
    var rows = await Admin.find({}, { password: 0 });
    res.render("pages/admin/index", { title: "Admin", table: "admin", pagePath: "Admin", rows: rows });
}

export const adminViewController = async (req, res) => {
    const id = req.params.id

    const validateResult = idValidator(id);
    if (validateResult.error) {
        messagePusher(req, "danger", validateResult.error.message);
        return res.redirect("/admin/admin");
    }

    var row = await Admin.findById(id, { password: 0 });
    const resParams = {
        pagePath: "Admin / View",
        title: "Admin View",
        operation: "view",
        row: row,
        id: id,
        table: "admin",
    };
    res.render("pages/admin/view", resParams);
};

export const adminCreateGetController = async (req, res) => {
    const csrfToken = randomStringFromCrypto(16);
    redisSet(csrfToken, "csrfToken", 60 * 5); // 5 minutes

    const resParams = {
        pagePath: "Admin Create",
        title: "Admin Create",
        operation: "create",
        table: "admin",
        csrfToken: csrfToken,
    };
    res.render("pages/admin/view", resParams);
}

export const adminCreatePostController = async (req, res) => {
    const csrfToken = req.body.csrfToken;
    if (csrfToken) {
        const csrfValue = await redisGet(csrfToken);
        if (csrfValue) {
            const encryptedPassword = await encryptPassword(req.body.password);
            Admin.create({
                name: req.body.name,
                email: req.body.email,
                password: encryptedPassword,
                isActive: req.body.isActive == "on" ? true : false,
                isSuperUser: req.body.isSuperUser == "on" ? true : false,
            }, (err, admin) => {
                if (err) {
                    if (err.code == 11000) {
                        messagePusher(req, "danger", req.body.email + " Email already exists");
                    } else {
                        messagePusher(req, "danger", "Admin not created\nError : " + err);
                    }
                }
                else {
                    if (admin) {
                        messagePusher(req, "success", admin.name + " Admin created successfully");
                    }
                    else {
                        messagePusher(req, "danger", "Admin not found");
                    }
                }
            });
        } else {
            messagePusher(req, "danger", "Invalid csrf token");
        }
    } else {
        messagePusher(req, "danger", "CSRF Token not found");
    }
    return res.redirect("/admin/admin");
};

export const adminUpdateGetController = async (req, res) => {
    const id = req.params.id;

    const csrfToken = randomStringFromCrypto(16);
    redisSet(csrfToken, "csrfToken", 60 * 5); // 5 minutes

    const row = await Admin.findById(id);

    const resParams = {
        pagePath: "Admin Update",
        title: "Admin Update",
        operation: "update",
        id: id,
        row: row,
        table: "admin",
        csrfToken: csrfToken,
    };
    res.render("pages/admin/view", resParams);
};

export const adminUpdatePostController = async (req, res, next) => {
    const id = req.params.id;
    const csrfToken = req.body.csrfToken;
    if (csrfToken) {
        const csrfValue = await redisGet(csrfToken);
        if (csrfValue) {
            Admin.findByIdAndUpdate(id, {
                name: req.body.name,
                email: req.body.email,
                isActive: req.body.isActive == "on" ? true : false,
                isSuperUser: req.body.isSuperUser == "on" ? true : false,
            }, (err, doc) => {
                if (err) {
                    if (err.name === 'CastError') {
                        messagePusher(req, "danger", "Invalid Admin id");
                    } else {
                        messagePusher(req, "danger", "Admin not updated " + err);
                    }
                } else {
                    messagePusher(req, "success", `"${doc.name}" Admin updated successfully`);
                }
            });
        } else {
            messagePusher(req, "danger", "Invalid CSRF token");
        }
    } else {
        messagePusher(req, "danger", "CSRF token not found");
    }
    return res.redirect("/admin/admin");
};

export const adminDeleteController = (req, res) => {
    const id = req.params.id;

    Admin.findByIdAndDelete(id, (err, row) => {
        if (err) {
            messagePusher(req, "danger", "Admin not deleted");
        } else {
            if (row) {
                messagePusher(
                    req,
                    "success",
                    row.name + " Admin deleted successfully"
                );
            } else {
                messagePusher(req, "danger", "Admin not found");
            }
        }
        res.redirect("/admin/admin");
    });
};

export const adminUsersPermissionGetController = async (req, res) => {
    const id = req.params.id;

    const csrfToken = randomStringFromCrypto(16);
    redisSet(csrfToken, "csrfToken", 60 * 5); // 5 minutes

    const row = await Admin.findById(id);
    const resParams = {
        pagePath: row.name + "'s Permission",
        title: row.name + "'s Permission",
        operation: "usersPermission",
        row: row,
        id: id,
        table: "admin",
    };
    res.render("pages/admin/usersPermission", resParams);
}

export const adminUsersPermissionPostController = async (req, res) => {
    const id = req.params.id

    const validateResult = idValidator(id);
    if (validateResult.error) {
        messagePusher(req, "danger", validateResult.error.message);
        return res.redirect("/admin/admin");
    }
}