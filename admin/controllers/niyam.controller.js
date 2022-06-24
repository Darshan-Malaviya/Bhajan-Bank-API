import { Niyam, Category, Media } from "../../models/index.js";
import { messagePusher } from "../middlewares/message.middleware.js";
import { redisSet, redisGet } from "../../database/redisDb.js";
import PermissionChecker from "../helpers/permissionChecker.js";
import { randomStringFromCrypto } from "../helpers/uniqueGenerator.js";

export const niyamController = async (req, res) => {
	if (new PermissionChecker(req.user).hasPermission("list_niyams")) {
		const isActive = req.query.type;
		var title = "";
		if (isActive == "active") {
			title = "Active Niyams";
			var rows = await Niyam.find({ isActive: true }).populate("category");
		} else if (isActive == "inactive") {
			title = "Inactive Niyams";
			var rows = await Niyam.find({ isActive: false }).populate("category");
		} else {
			title = "Niyam";
			var rows = await Niyam.find().populate("category");
		}
		res.render("pages/niyam/index", {
			title: title,
			table: "niyam",
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

export const niyamCreateGetController = async (req, res) => {
	if (new PermissionChecker(req.user).hasPermission("create_niyam")) {
		const csrfToken = randomStringFromCrypto(16);
		redisSet(csrfToken, "csrfToken", 60 * 5); // 5 minutes

		const categories = await Category.find({ isActive: true });
		const medias = await Media.find({ isActive: true });
		const inputTypes = await Niyam.schema.path("inputType").enumValues;
		const targetTypes = await Niyam.schema.path("targetType").enumValues;
		const extraFunctions = await Niyam.schema.path("extraFunction").enumValues;
		res.render("pages/niyam/view", {
			title: "Create Niyam",
			table: "niyam",
			operation: "create",
			csrfToken: csrfToken,
			categories: categories,
			medias: medias,
			inputTypes: inputTypes,
			targetTypes: targetTypes,
			extraFunctions: extraFunctions,
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

export const niyamCreatePostController = async (req, res) => {
	if (new PermissionChecker(req.user).hasPermission("create_niyam")) {
		const body = req.body;
		const csrfTokenFromRedis = await redisGet(body.csrfToken);
		if (csrfTokenFromRedis) {
			Object.keys(body).forEach((key) => {
				if (body[key] === null || body[key] === "") {
					delete body[key];
				}
			});
			Niyam.create(req.body, (err, niyam) => {
				if (err) {
					return res.send({
						status: false,
						message: "Error while creating niyam " + err,
					});
				} else {
					if (niyam) {
						return res.send({
							status: true,
							message: "Niyam created successfully",
							niyam: niyam,
						});
					} else {
						return res.send({
							status: false,
							message: "Error creating niyam",
						});
					}
				}
			});
		} else {
			return res.send({
				status: false,
				message: "form expired, please try again",
			});
		}
	} else {
		return res.status(403).send({
			status: false,
			message: "You do not have permission to create niyam",
		});
	}
};

export const niyamUpdateGetController = async (req, res) => {
	const id = req.params.id;
	if (new PermissionChecker(req.user).hasPermission("edit_niyam")) {
		const csrfToken = randomStringFromCrypto(16);
		redisSet(csrfToken, "csrfToken", 60 * 5); // 5 minutes
		const row = await Niyam.findById(id).populate("category");
		if (row) {
			const categories = await Category.find({ isActive: true });
			const medias = await Media.find({ isActive: true });
			const inputTypes = await Niyam.schema.path("inputType").enumValues;
			const targetTypes = await Niyam.schema.path("targetType").enumValues;
			const extraFunctions = await Niyam.schema.path("extraFunction")
				.enumValues;
			res.render("pages/niyam/view", {
				title: "Update Niyam",
				table: "niyam",
				operation: "update",
				csrfToken: csrfToken,
				row: row,
				id: id,
				categories: categories,
				medias: medias,
				inputTypes: inputTypes,
				targetTypes: targetTypes,
				extraFunctions: extraFunctions,
			});
		} else {
			messagePusher(req, "danger", "Niyam not found");
			res.redirect("/admin/niyam");
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

export const niyamUpdatePostController = async (req, res) => {
	const id = req.params.id;
	if (new PermissionChecker(req.user).hasPermission("edit_niyam")) {
		const body = req.body;
		const csrfTokenFromRedis = await redisGet(body.csrfToken);
		if (csrfTokenFromRedis) {
			Niyam.findByIdAndUpdate(id, body, (err, niyam) => {
				if (err) {
					return res.send({
						status: false,
						message: "Error while updating niyam " + err,
					});
				} else {
					if (niyam) {
						return res.send({
							status: true,
							message: "Niyam updated successfully",
							niyam: niyam,
						});
					} else {
						return res.send({
							status: false,
							message: "Error updating niyam",
						});
					}
				}
			});
		} else {
			return res.send({
				status: false,
				message: "form expired, please try again",
			});
		}
	} else {
		return res.status(403).send({
			status: false,
			message: "You do not have permission to update niyam",
		});
	}
};

export const niyamDeleteController = async (req, res) => {
	const id = req.params.id;
	if (new PermissionChecker(req.user).hasPermission("delete_niyam")) {
		Niyam.findByIdAndRemove(id, (err, niyam) => {
			if (err) {
				return res.send({
					status: false,
					message: "Error while deleting niyam " + err,
				});
			} else {
				if (niyam) {
					return res.send({
						status: true,
						message: "Niyam deleted successfully",
						niyam: niyam,
					});
				} else {
					return res.send({
						status: false,
						message: "Error deleting niyam",
					});
				}
			}
		});
	} else {
		return res.status(403).send({
			status: false,
			message: "You do not have permission to delete niyam",
		});
	}
};

export const niyamStatusController = async (req, res) => {
	const id = req.params.id;
	const isActive = req.body.isActive === "true" ? true : false;
	if (new PermissionChecker(req.user).hasPermission("edit_niyam")) {
		Niyam.findByIdAndUpdate(id, { isActive: isActive }, (err, niyam) => {
			if (err) {
				return res.send({
					status: false,
					message: "Error while updating niyam " + err,
				});
			} else {
				if (niyam) {
					return res.send({
						status: true,
						message: "Niyam status updated successfully",
						niyam: niyam,
					});
				} else {
					return res.send({
						status: false,
						message: "Error updating niyam",
					});
				}
			}
		});
	} else {
		return res.status(403).send({
			status: false,
			message: "You do not have permission to update niyam",
		});
	}
};
