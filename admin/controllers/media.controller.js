import fs from "fs";
import { Media } from "../../models/index.js";
import { ContentType } from "../models/index.js";
import { randomStringFromCrypto } from "../helpers/uniqueGenerator.js";
import { redisSet, redisGet } from "../../database/redisDb.js";
import { messagePusher } from "../middlewares/message.middleware.js";
import PermissionChecker from "../helpers/permissionChecker.js";

export const mediaController = async (req, res) => {
	if (new PermissionChecker(req.user).hasPermission("list_medias")) {
		const rows = await Media.find({}).populate("contentType");
		return res.render("pages/media/index", {
			title: "Media",
			table: "media",
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

export const mediaCreateGetController = async (req, res) => {
	if (new PermissionChecker(req.user).hasPermission("create_media")) {
		const csrfToken = randomStringFromCrypto(16);
		redisSet(csrfToken, "mediaCreate", 60 * 5); // 5 minutes

		const contentTypes = await ContentType.find({ isActive: true });
		const mediaTypes = await Media.schema.path("type").enumValues;

		const resParams = {
			pagePath: "Media Create",
			title: "Media Create",
			operation: "create",
			table: "media",
			csrfToken: csrfToken,
			contentTypes: contentTypes,
			mediaTypes: mediaTypes,
		};
		return res.render("pages/media/form", resParams);
	} else {
		messagePusher(
			req,
			"danger",
			"You do not have permission to view this page"
		);
		res.redirect("/admin");
	}
};

export const mediaCreatePostController = async (req, res) => {
	if (new PermissionChecker(req.user).hasPermission("create_media")) {
		const file = req.file;
		const { name, type, contentType, csrfToken } = req.body;

		const csrfValue = await redisGet(req.body.csrfToken);
		if (csrfValue !== "mediaCreate") {
			messagePusher(req, "error", "Form expired. Please try again.");
			return res.redirect("/media/create");
		}
		if (!file) {
			messagePusher(req, "error", "Please upload a file");
			return res.redirect("/admin/media/create");
		} else {
			Media.create(
				{
					name: name,
					type: type,
					contentType: contentType,
					url: file.path,
					isActive: true,
				},
				(err, media) => {
					if (err) {
						messagePusher(req, "error", "Error creating media");
						return res.redirect("/admin/media/create");
					} else {
						if (media) {
							messagePusher(req, "success", "Media created successfully");
							return res.redirect("/admin/media");
						} else {
							messagePusher(req, "error", "Error creating media");
							return res.redirect("/admin/media/create");
						}
					}
				}
			);
		}
	} else {
		messagePusher(req, "danger", "You do not have permission to create media");
		res.redirect("/admin");
	}
};

export const mediaDeleteController = async (req, res) => {
	if (new PermissionChecker(req.user).hasPermission("delete_media")) {
		const { id } = req.params;

		Media.findByIdAndDelete(id, (err, row) => {
			if (err) {
				return res.send({
					status: false,
					message: "Error : " + err,
				});
			} else {
				if (row) {
					fs.unlink(row.url, (err) => {
						if (err) {
							console.log(err);
						}
					});
					return res.send({
						status: true,
						message: "Media deleted successfully",
					});
				} else {
					return res.send({
						status: false,
						message: "Media not found",
					});
				}
			}
		});
	} else {
		return res.send({
			status: false,
			message: "You do not have permission to delete media",
			redirect: "/admin",
		});
	}
};

export const mediaStatusController = async (req, res) => {
	if (new PermissionChecker(req.user).hasPermission("edit_media")) {
		const id = req.params.id;
		const isActive = req.body.isActive === "true" ? true : false;
		Media.findByIdAndUpdate(
			id,
			{
				isActive: isActive,
			},
			(err, doc) => {
				if (err) {
					if (err.name === "CastError") {
						return res.send({
							status: false,
							message: "Invalid id",
						});
					} else {
						return res.send({
							status: false,
							message: "Error : " + err,
						});
					}
				} else {
					if (doc) {
						return res.send({
							status: true,
							message: `${doc.name} ${
								isActive ? "Activated" : "Deactivated"
							} successfully`,
						});
					} else {
						return res.send({
							status: false,
							message: "Media not found",
						});
					}
				}
			}
		);
	} else {
		return res.send({
			status: false,
			message: "You do not have permission to edit media",
			redirect: "/admin",
		});
	}
};
