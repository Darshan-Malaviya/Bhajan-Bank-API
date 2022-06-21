import { randomStringFromCrypto } from "../helpers/uniqueGenerator.js";
import { messagePusher } from "../middlewares/message.middleware.js";
import { redisSet, redisGet } from "../../database/redisDb.js";
import { Admin } from "../models/index.js";
import { encryptPassword } from "../helpers/password.js";

export const adminsController = async (req, res) => {
	var rows = await Admin.find({}, { password: 0 });
	res.render("pages/admin/index", {
		title: "Admin",
		table: "admin",
		pagePath: "Admin",
		rows: rows,
	});
};

export const adminViewController = async (req, res) => {
	const id = req.params.id;

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
};

export const adminCreatePostController = async (req, res) => {
	const csrfValue = await redisGet(req.body.csrfToken);
	if (csrfValue) {
		const encryptedPassword = await encryptPassword(req.body.password);
		Admin.create(
			{
				name: req.body.name,
				email: req.body.email,
				password: encryptedPassword,
				isActive: false,
				isSuperUser: false,
			},
			(err, admin) => {
				if (err) {
					if (err.code == 11000) {
						return res.send({
							status: false,
							message: `Admin with email ${admin.email} already exists.`,
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
						message: `${admin.name} created successfully`,
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
	const csrfValue = await redisGet(req.body.csrfToken);
	if (csrfValue) {
		Admin.findByIdAndUpdate(
			id,
			{
				name: req.body.name,
				email: req.body.email,
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
						message: `${doc.name} updated successfully`,
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

export const adminDeleteController = (req, res) => {
	const id = req.params.id;

	Admin.findByIdAndDelete(id, (err, row) => {
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
};

export const adminUsersPermissionPostController = async (req, res) => {
	const id = req.params.id;
};

export const adminStatusController = async (req, res) => {
	const id = req.params.id;
	const isActive = req.body.isActive === "true" ? true : false;
	Admin.findByIdAndUpdate(
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

export const adminSuperUserStatusController = async (req, res) => {
	const id = req.params.id;
	const isSuperUser = req.body.isSuperUser === "true" ? true : false;
	Admin.findByIdAndUpdate(
		id,
		{
			isSuperUser: isSuperUser,
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
						isSuperUser ? "Activated" : "Deactivated"
					} successfully`,
				});
			}
		}
	);
};
