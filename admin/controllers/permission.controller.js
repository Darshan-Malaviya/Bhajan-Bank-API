import { v4 as uuidv4 } from "uuid";
import { randomStringFromCrypto } from "../helpers/uniqueGenerator.js";
import { messagePusher } from "../middlewares/message.middleware.js";
import { redisSet, redisGet } from "../../database/redisDb.js";
import { ContentType, Permission } from "../models/index.js";
import { getPermissions } from "../services/permission.service.js";
import PermissionChecker from "../helpers/permissionChecker.js";

export const permissionsController = async (req, res) => {
	if (new PermissionChecker(req.user).hasPermission("list_permissions")) {
		var rows = await getPermissions();
		res.render("pages/permission/index", {
			title: "Permission",
			table: "permission",
			pagePath: "Permission",
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

export const permissionCreateGetController = async (req, res) => {
	if (new PermissionChecker(req.user).hasPermission("create_permission")) {
		const csrfToken = randomStringFromCrypto(16);
		redisSet(csrfToken, "permissionCreate", 60 * 5); // 5 minutes

		const contentTypes = await ContentType.find({ isActive: true });

		const resParams = {
			pagePath: "Permission Create",
			title: "Permission Create",
			operation: "create",
			table: "permission",
			csrfToken: csrfToken,
			contentTypes: contentTypes,
		};
		res.render("pages/permission/view", resParams);
	} else {
		messagePusher(
			req,
			"danger",
			"You do not have permission to view this page"
		);
		res.redirect("/admin");
	}
};

export const permissionCreatePostController = async (req, res) => {
	if (new PermissionChecker(req.user).hasPermission("create_permission")) {
		const csrfValue = await redisGet(req.body.csrfToken);
		if (csrfValue === "permissionCreate") {
			Permission.create(
				{
					name: req.body.name,
					identifier: req.body.identifier,
					description: req.body.description,
					contentType: req.body.contentType,
					isActive: true,
				},
				(err, permission) => {
					if (err) {
						return res.send({
							status: false,
							message: err.message,
						});
					} else {
						if (permission) {
							return res.send({
								status: true,
								message: permission.name + " Permission created successfully",
								id: permission._id,
							});
						} else {
							return res.send({
								status: false,
								message: "Permission not created",
							});
						}
					}
				}
			);
		} else {
			return res.send({
				status: false,
				message: "form expired, please try again",
				redirect: "/admin/permission/create",
			});
		}
	} else {
		return res.send({
			status: false,
			message: "You do not have permission to create permission",
			redirect: "/admin",
		});
	}
};

export const permissionUpdateGetController = async (req, res) => {
	if (new PermissionChecker(req.user).hasPermission("edit_permission")) {
		const id = req.params.id;

		const csrfToken = randomStringFromCrypto(16);
		redisSet(csrfToken, "permissionUpdate", 60 * 5); // 5 minutes

		const row = await Permission.findById(id).populate("contentType");
		if (row) {
			const contentTypes = await ContentType.find({ isActive: true });

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
		} else {
			messagePusher(req, "danger", "Permission not found");
			res.redirect("/admin/permission");
		}
	} else {
		messagePusher(
			req,
			"danger",
			"You do not have permission to view this page"
		);
		res.redirect("/admin");
	}
};

export const permissionUpdatePostController = async (req, res, next) => {
	if (new PermissionChecker(req.user).hasPermission("edit_permission")) {
		const id = req.params.id;
		const csrfValue = await redisGet(req.body.csrfToken);
		if (csrfValue === "permissionUpdate") {
			Permission.findByIdAndUpdate(
				id,
				{
					name: req.body.name,
					identifier: req.body.identifier,
					description: req.body.description,
					contentType: req.body.contentType,
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
								message: err.message,
							});
						}
					} else {
						if (doc) {
							return res.send({
								status: true,
								message: doc.name + " Permission updated successfully",
								id: doc._id,
							});
						} else {
							return res.send({
								status: false,
								message: "Permission not found",
							});
						}
					}
				}
			);
		} else {
			return res.send({
				status: false,
				message: "form expired, please try again",
				redirect: "/admin/permission/update/" + id,
			});
		}
	} else {
		return res.send({
			status: false,
			message: "You do not have permission to update permission",
			redirect: "/admin",
		});
	}
};

export const permissionDeleteController = (req, res) => {
	if (new PermissionChecker(req.user).hasPermission("delete_permission")) {
		const id = req.params.id;
		Permission.findByIdAndDelete(id, (err, row) => {
			if (err) {
				return res.send({
					status: false,
					message: err.message,
				});
			} else {
				if (row) {
					return res.send({
						status: true,
						message: row.name + " Permission deleted successfully",
						id: row._id,
					});
				} else {
					return res.send({
						status: false,
						message: "Permission not found",
					});
				}
			}
		});
	} else {
		return res.send({
			status: false,
			message: "You do not have permission to delete permission",
			redirect: "/admin",
		});
	}
};

export const permissionStatusController = async (req, res) => {
	if (new PermissionChecker(req.user).hasPermission("edit_permission")) {
		const id = req.params.id;
		Permission.findByIdAndUpdate(
			id,
			{
				isActive: req.body.isActive,
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
							message: err.message,
						});
					}
				} else {
					if (doc) {
						return res.send({
							status: true,
							message: doc.name + " Permission status updated successfully",
							id: doc._id,
						});
					} else {
						return res.send({
							status: false,
							message: "Permission not found",
						});
					}
				}
			}
		);
	} else {
		return res.send({
			status: false,
			message: "You do not have permission to update permission",
			redirect: "/admin",
		});
	}
};
