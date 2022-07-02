import Category from "../../models/category.model.js";
import { v4 as uuidv4 } from "uuid";
import { randomStringFromCrypto } from "../helpers/uniqueGenerator.js";
import { messagePusher } from "../middlewares/message.middleware.js";
import { redisSet, redisGet } from "../../database/redisDb.js";
import PermissionChecker from "../helpers/permissionChecker.js";

export const categorysController = async (req, res) => {
	if (new PermissionChecker(req.user).hasPermission("list_categorys")) {
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
		res.render("pages/category/index", {
			title: title,
			table: "category",
			pagePath: "Category",
			rows: rows,
		});
	} else {
		messagePusher(
			req,
			"danger",
			"You do not have permission to view this page"
		);
		res.redirect("/admin");
	}
};

export const categoryCreateGetController = async (req, res) => {
	if (new PermissionChecker(req.user).hasPermission("create_category")) {
		const csrfToken = randomStringFromCrypto(16);
		redisSet(csrfToken, "categoryCreate", 60 * 5); // 5 minutes

		const resParams = {
			pagePath: "Category Create",
			title: "Category Create",
			operation: "create",
			table: "category",
			csrfToken: csrfToken,
		};
		res.render("pages/category/view", resParams);
	} else {
		messagePusher(
			req,
			"danger",
			"You do not have permission to view this page"
		);
		res.redirect("/admin");
	}
};

export const categoryCreatePostController = async (req, res) => {
	if (new PermissionChecker(req.user).hasPermission("create_category")) {
		const csrfValue = await redisGet(req.body.csrfToken);
		if (csrfValue == "categoryCreate") {
			Category.create(
				{
					name: req.body.name,
					displayPosition: req.body.displayPosition,
					isActive: true,
				},
				(err, doc) => {
					if (err) {
						return res.send({
							status: false,
							message: "Category not created Error : " + err,
						});
					} else {
						if (doc) {
							return res.send({
								status: true,
								id: doc._id,
								message: doc.name + "Category created successfully",
							});
						} else {
							return res.send({
								status: false,
								message: "Category not created",
							});
						}
					}
				}
			);
		} else {
			return res.send({
				status: false,
				message: "Form expired. Please try again",
				redirect: "/admin/category/create",
			});
		}
	} else {
		return res.send({
			status: false,
			message: "You do not have permission to view this page",
			redirect: "/admin",
		});
	}
};

export const categoryUpdateGetController = async (req, res) => {
	if (new PermissionChecker(req.user).hasPermission("edit_category")) {
		const id = req.params.id;
		const csrfToken = randomStringFromCrypto(16);
		redisSet(csrfToken, "categoryUpdate", 60 * 5); // 5 minutes

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
	} else {
		messagePusher(
			req,
			"danger",
			"You do not have permission to view this page"
		);
		res.redirect("/admin");
	}
};

export const categoryUpdatePostController = async (req, res, next) => {
	if (new PermissionChecker(req.user).hasPermission("edit_category")) {
		const id = req.params.id;
		const csrfValue = await redisGet(req.body.csrfToken);
		if (csrfValue == "categoryUpdate") {
			Category.findByIdAndUpdate(
				id,
				{
					name: req.body.name,
					displayPosition: req.body.displayPosition,
				},
				(err, doc) => {
					if (err) {
						if (err.name === "CastError") {
							return res.send({
								status: false,
								message: "Invalid Id",
							});
						} else {
							return res.send({
								status: false,
								message: "Category not updated Error : " + err,
							});
						}
					} else {
						if (doc) {
							return res.send({
								status: true,
								id: doc._id,
								message: `${doc.name} updated successfully`,
							});
						} else {
							return res.send({
								status: false,
								message: "Category not updated",
							});
						}
					}
				}
			);
		} else {
			return res.send({
				status: false,
				message: "Form expired. Please try again",
				redirect: "/admin/category/update/" + id,
			});
		}
	} else {
		return res.send({
			status: false,
			message: "You do not have permission to update the category",
			redirect: "/admin",
		});
	}
};

export const categoryDeleteController = (req, res) => {
	if (new PermissionChecker(req.user).hasPermission("delete_category")) {
		const id = req.params.id;
		Category.findByIdAndDelete(id, (err, row) => {
			if (err) {
				return res.send({
					status: false,
					message: "Category not deleted Error : " + err,
				});
			} else {
				if (row) {
					return res.send({
						status: true,
						message: `${row.name} deleted successfully`,
					});
				} else {
					return res.send({
						status: false,
						message: "Invalid Id",
					});
				}
			}
		});
	} else {
		return res.send({
			status: false,
			message: "You do not have permission to delete the category",
			redirect: "/admin",
		});
	}
};

export const categoryStatusController = async (req, res) => {
	if (new PermissionChecker(req.user).hasPermission("edit_category")) {
		const id = req.params.id;
		const isActive = req.body.isActive === "true" ? true : false;
		Category.findByIdAndUpdate(
			id,
			{
				isActive: isActive,
			},
			(err, doc) => {
				if (err) {
					if (err.name === "CastError") {
						return res.send({
							status: false,
							message: "Invalid Id",
						});
					} else {
						return res.send({
							status: false,
							message: "Category not updated Error : " + err,
						});
					}
				} else {
					if (doc) {
						return res.send({
							status: true,
							message: `${doc.name} updated successfully`,
						});
					} else {
						return res.send({
							status: false,
							message: "Category not found",
						});
					}
				}
			}
		);
	} else {
		return res.send({
			status: false,
			message: "You do not have permission to update the category",
			redirect: "/admin",
		});
	}
};
