import Category from "../../models/category.model.js";
import { v4 as uuidv4 } from "uuid";
import { randomStringFromCrypto } from "../helpers/uniqueGenerator.js";
import { messagePusher } from "../middlewares/message.middleware.js";
import { redisSet, redisGet } from "../../database/redisDb.js";

export const categorysController = async (req, res) => {
    const isActive = req.query.type;
    var title = "";
    if (isActive == "active") {
        title = "Active Categories";
        var rows = await Category.find({ isActive: true });
    } else if (isActive == "inactive") {
        title = "Inactive Categories";
        var rows = await Category.find({ isActive: false });
    } else {
        title = "Category";
        var rows = await Category.find();
    }
    res.render("pages/category/index", { title: title, table: "category", pagePath: "Category", rows: rows });
}

export const categoryViewController = async (req, res) => {
    const id = req.params.id;
    var row = await Category.findById(id).lean();
    const resParams = {
        pagePath: "Category / View",
        title: "Category View",
        operation: "view",
        row: row,
        id: id,
        table: "category",
    };
    res.render("pages/category/view", resParams);
};

export const categoryCreateGetController = async (req, res) => {
    const csrfToken = randomStringFromCrypto(16);
    redisSet(csrfToken, "csrfToken", 60 * 5); // 5 minutes

    const resParams = {
        pagePath: "Category Create",
        title: "Category Create",
        operation: "create",
        table: "category",
        csrfToken: csrfToken,
    };
    res.render("pages/category/view", resParams);
}

export const categoryCreatePostController = async (req, res) => {
    const csrfToken = req.body.csrfToken;
    if (csrfToken) {
        const csrfValue = await redisGet(csrfToken);
        if (csrfValue) {
            Category.create({
                name: req.body.name,
                displayPosition: req.body.displayPosition,
                isActive: req.body.isActive === "on" ? true : false,
            }, (err, category) => {
                if (err) {
                    messagePusher(req, "danger", "Category not created\nError : " + err);
                }
                else {
                    if (category) {
                        messagePusher(req, "success", category.name + " Category created successfully");
                    }
                    else {
                        messagePusher(req, "danger", "Category not found");
                    }
                }
            });
        } else {
            messagePusher(req, "danger", "Invalid csrf token");
        }
    } else {
        messagePusher(req, "danger", "CSRF Token not found");
    }
    return res.redirect("/admin/category");
};

export const categoryUpdateGetController = async (req, res) => {
    const id = req.params.id;
    const csrfToken = randomStringFromCrypto(16);
    redisSet(csrfToken, "csrfToken", 60 * 5); // 5 minutes

    const row = await Category.findById(id).lean();
    const resParams = {
        pagePath: "Category Update",
        title: "Category Update",
        operation: "update",
        id: id,
        row: row,
        table: "category",
        csrfToken: csrfToken,
    };
    res.render("pages/category/view", resParams);
};

export const categoryUpdatePostController = async (req, res, next) => {
    const id = req.params.id;
    const csrfToken = req.body.csrfToken;
    if (csrfToken) {
        const csrfValue = await redisGet(csrfToken);
        if (csrfValue) {
            Category.findByIdAndUpdate(id, {
                name: req.body.name,
                displayPosition: req.body.displayPosition,
                isActive: req.body.isActive === "on" ? true : false,
            }, (err, doc) => {
                if (err) {
                    if (err.name === 'CastError') {
                        messagePusher(req, "danger", "Invalid Category id");
                    } else {
                        messagePusher(req, "danger", "Category not updated " + err);
                    }
                } else {
                    messagePusher(req, "success", `"${doc.name}" Category updated successfully`);
                }
            });
        } else {
            messagePusher(req, "danger", "Invalid CSRF token");
        }
    } else {
        messagePusher(req, "danger", "CSRF token not found");
    }
    return res.redirect("/admin/category");
};

export const categoryDeleteController = (req, res) => {
    const id = req.params.id;
    Category.findByIdAndDelete(id, (err, row) => {
        if (err) {
            messagePusher(req, "danger", "Category not deleted");
        } else {
            if (row) {
                messagePusher(
                    req,
                    "success",
                    row.name + " Category deleted successfully"
                );
            } else {
                messagePusher(req, "danger", "Category not found");
            }
        }
        res.redirect("/admin/category");
    });
};

export const categoryStatusController = async (req, res) => {
    const id = req.params.id;
    const isActive = req.body.isActive;
    if (isActive) {
        Category.findByIdAndUpdate(id, {
            isActive: isActive === "true" ? true : false,
        }, (err, doc) => {
            if (err) {
                if (err.name === 'CastError') {
                    return res.status(400).send("Invalid Category id");
                } else {
                    return res.status(500).send(err);
                }
            } else {
                return res.send(`${doc.name} Category updated successfully`)
            }
        });

    } else {
        return res.status(400).send("Bad Request");
    }
}