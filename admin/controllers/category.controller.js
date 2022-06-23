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
	res.render("pages/category/index", {
		title: title,
		table: "category",
		pagePath: "Category",
		rows: rows,
	});
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
};

export const categoryCreatePostController = async (req, res) => {
	const csrfValue = await redisGet(req.body.csrfToken);
	if (csrfValue) {
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
					return res.send({
						status: true,
						id: doc._id,
						message: `${doc.name} created successfully`,
					});
				}
			}
		);
	} else {
		return res.send({
			status: false,
			message: "Form expired. Please try again",
		});
	}
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
	const csrfValue = await redisGet(req.body.csrfToken);
	if (csrfValue) {
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
					return res.send({
						status: true,
						message: `${doc.name} updated successfully`,
					});
				}
			}
		);
	} else {
		return res.send({
			status: false,
			message: "Form expired. Please try again",
		});
	}
};

export const categoryDeleteController = (req, res) => {
	const id = req.params.id;
	Category.findByIdAndDelete(id, (err, row) => {
		if (err) {
			return res.send({
				status: false,
				message: "Category not deleted Error : " + err,
			});
		} else {
			return res.send({
				status: true,
				message: `${row.name} deleted successfully`,
			});
		}
	});
};

export const categoryStatusController = async (req, res) => {
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
