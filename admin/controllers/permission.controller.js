import { v4 as uuidv4 } from "uuid";
import { randomStringFromCrypto } from "../helpers/uniqueGenerator.js";
import { messagePusher } from "../middlewares/message.middleware.js";
import { redisSet, redisGet } from "../../database/redisDb.js";
import { ContentType, Permission } from "../models/index.js";
import { getPermissions } from "../services/permission.service.js";

export const permissionsController = async (req, res) => {
	var rows = await getPermissions();
	res.render("pages/permission/index", {
		title: "Permission",
		table: "permission",
		pagePath: "Permission",
		rows: rows,
	});
};

export const permissionCreateGetController = async (req, res) => {
	const csrfToken = randomStringFromCrypto(16);
	redisSet(csrfToken, "csrfToken", 60 * 5); // 5 minutes

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
};

export const permissionCreatePostController = async (req, res) => {
	const csrfValue = await redisGet(req.body.csrfToken);
	if (csrfValue) {
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
					return res.send({
						status: true,
						message: permission.name + " Permission created successfully",
						id: permission._id,
					});
				}
			}
		);
	} else {
		return res.send({
			status: false,
			message: "form expired, please try again",
		});
	}
};

export const permissionUpdateGetController = async (req, res) => {
	const id = req.params.id;

	const csrfToken = randomStringFromCrypto(16);
	redisSet(csrfToken, "csrfToken", 60 * 5); // 5 minutes

	const row = await Permission.findById(id).populate("contentType");
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
};

export const permissionUpdatePostController = async (req, res, next) => {
	const id = req.params.id;
	const csrfValue = await redisGet(req.body.csrfToken);
	if (csrfValue) {
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
					return res.send({
						status: true,
						message: doc.name + " Permission updated successfully",
						id: doc._id,
					});
				}
			}
		);
	} else {
		return res.send({
			status: false,
			message: "form expired, please try again",
		});
	}
};

export const permissionDeleteController = (req, res) => {
	const id = req.params.id;
	Permission.findByIdAndDelete(id, (err, row) => {
		if (err) {
			return res.send({
				status: false,
				message: err.message,
			});
		} else {
			return res.send({
				status: true,
				message: row.name + " Permission deleted successfully",
				id: row._id,
			});
		}
	});
};

export const permissionStatusController = async (req, res) => {
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
				return res.send({
					status: true,
					message: doc.name + " Permission status updated successfully",
					id: doc._id,
				});
			}
		}
	);
};
