import { randomStringFromCrypto } from "../helpers/uniqueGenerator.js";
import { messagePusher } from "../middlewares/message.middleware.js";
import { redisSet, redisGet } from "../../database/redisDb.js";
import { Admin } from "../models/index.js";
import { encryptPassword } from "../helpers/password.js";
import { getUserPermissionsByContentTypeGroup } from "../services/admin.service.js";

export const adminsController = async (req, res) => {
	var rows = await Admin.find({}, { password: 0 });
	res.render("pages/admin/index", {
		title: "Admin",
		table: "admin",
		rows: rows,
	});
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
	const password = req.body.password;
	if (password === "") {
		return res.send({
			status: false,
			message: "Password is required",
		});
	}
	if (csrfValue) {
		const encryptedPassword = await encryptPassword(password);
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
						id: admin._id,
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
	try {
		const row = await Admin.findById(id);
		const permissions = await getUserPermissionsByContentTypeGroup(id);
		const resParams = {
			pagePath: "Admin Update",
			title: "Admin Update",
			operation: "update",
			id: id,
			row: row,
			table: "admin",
			csrfToken: csrfToken,
			permissions: permissions,
		};
		return res.render("pages/admin/view", resParams);
	} catch (err) {
		messagePusher(req, "error", err.message);
		return res.redirect("/admin/admin");
	}
};

export const adminUpdatePostController = async (req, res, next) => {
	const id = req.params.id;
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

export const adminUsersPermissionPostController = async (req, res) => {
	const id = req.params.id;
	const permissions = req.body["permissions[]"];
	// if (!permissions) {
	// 	return res.send({
	// 		status: false,
	// 		message: "Please select atleast one permission",
	// 	});
	// }
	try {
		Admin.findByIdAndUpdate(
			id,
			{
				permissions: permissions,
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
						message: `${doc.name}'s permissions updated successfully`,
					});
				}
			}
		);
	} catch (err) {
		return res.send({
			status: false,
			message: "Error : " + err,
		});
	}
};

export const adminResetPasswordController = async (req, res) => {
	const id = req.params.id;
	const { password, confirmPassword, csrfToken } = req.body;
	const csrfValue = await redisGet(csrfToken);
	if (csrfValue) {
		if (password === confirmPassword) {
			const encryptedPassword = await encryptPassword(password);
			Admin.findByIdAndUpdate(
				id,
				{
					password: encryptedPassword,
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
							message: `${doc.name}'s password updated successfully`,
						});
					}
				}
			);
		} else {
			return res.send({
				status: false,
				message: "Passwords do not match",
			});
		}
	} else {
		return res.send({
			status: false,
			message: "form expired, please try again",
		});
	}
};
