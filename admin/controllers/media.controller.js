import { Media } from "../../models/index.js";
import { ContentType } from "../models/index.js";
import { randomStringFromCrypto } from "../helpers/uniqueGenerator.js";
import { redisSet, redisGet } from "../../database/redisDb.js";
import { messagePusher } from "../middlewares/message.middleware.js";

export const mediaController = async (req, res) => {
	const rows = await Media.find({}).populate("contentType");
	return res.render("pages/media/index", {
		title: "Media",
		table: "media",
		rows: rows,
	});
};

export const mediaCreateGetController = async (req, res) => {
	const csrfToken = randomStringFromCrypto(16);
	redisSet(csrfToken, "csrfToken", 60 * 5); // 5 minutes

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
};

export const mediaCreatePostController = async (req, res) => {
	const file = req.file;
	const { name, type, contentType, csrfToken } = req.body;

	const csrfValue = await redisGet(req.body.csrfToken);
	if (!csrfValue) {
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
					messagePusher(req, "success", "Media created successfully");
					return res.redirect("/admin/media");
				}
			}
		);
	}
};

export const mediaDeleteController = async (req, res) => {
	const { id } = req.params;
	Media.findByIdAndDelete(id, (err, row) => {
		if (err) {
			return res.send({
				status: false,
				message: "Error : " + err,
			});
		} else {
			return res.send({
				status: true,
				message: `${row.name} deleted successfully`,
			});
		}
	});
};

export const mediaStatusController = async (req, res) => {
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
				return res.send({
					status: true,
					message: `${doc.name} ${
						isActive ? "Activated" : "Deactivated"
					} successfully`,
				});
			}
		}
	);
};
