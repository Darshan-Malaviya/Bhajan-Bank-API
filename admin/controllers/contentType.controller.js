import ContentType from "../models/contentType.model.js";
import { v4 as uuidv4 } from "uuid";
import { randomStringFromCrypto } from "../helpers/uniqueGenerator.js";
import { messagePusher } from "../middlewares/message.middleware.js";
import { redisSet, redisGet } from "../../database/redisDb.js";

export const contentTypesController = async (req, res) => {
	var rows = await ContentType.find({});
	res.render("pages/contentType/index", {
		title: "ContentType",
		table: "contentType",
		pagePath: "ContentType",
		rows: rows,
	});
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
};

export const contentTypeCreatePostController = async (req, res) => {
	const csrfValue = await redisGet(req.body.csrfToken);
	if (csrfValue) {
		ContentType.create(
			{
				name: req.body.name,
				identifier: req.body.identifier,
				description: req.body.description,
				isActive: true,
			},
			(err, contentType) => {
				if (err) {
					return res.send({
						status: false,
						message: "Error: " + err,
					});
				} else {
					return res.send({
						status: true,
						message: contentType.name + " ContentType created successfully",
						id: contentType._id,
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
	const csrfValue = await redisGet(req.body.csrfToken);
	if (csrfValue) {
		ContentType.findByIdAndUpdate(
			id,
			{
				name: req.body.name,
				identifier: req.body.identifier,
				description: req.body.description,
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
							message: "Error: " + err,
						});
					}
				} else {
					return res.send({
						status: true,
						message: `"${doc.name}" ContentType updated statusfully`,
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

export const contentTypeDeleteController = (req, res) => {
	const id = req.params.id;
	ContentType.findByIdAndDelete(id, (err, row) => {
		if (err) {
			return res.send({
				status: false,
				message: "Error: " + err,
			});
		} else {
			return res.send({
				status: true,
				message: `"${row.name}" ContentType deleted successfully`,
			});
		}
	});
};

export const contentTypeStatusController = async (req, res) => {
	const id = req.params.id;
	const isActive = req.body.isActive === "true" ? true : false;
	ContentType.findByIdAndUpdate(id, { isActive: isActive }, (err, doc) => {
		if (err) {
			if (err.name === "CastError") {
				return res.send({
					status: false,
					message: "Invalid id",
				});
			} else {
				return res.send({
					status: false,
					message: "Error: " + err,
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
	});
};
