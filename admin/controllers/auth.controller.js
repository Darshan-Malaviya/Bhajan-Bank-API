import { Admin } from "../models/index.js";
import { randomStringFromCrypto } from "../helpers/uniqueGenerator.js";
import { messagePusher } from "../middlewares/message.middleware.js";
import { redisSet, redisGet } from "../../database/redisDb.js";
import { comparePassword } from "../helpers/password.js";
import { getUsersPermissions } from "../services/admin.service.js";

export const loginGetController = (req, res) => {
	const next = req.query.next || "/admin";
	if (req.session.user) {
		return res.redirect(next);
	}
	const csrfToken = randomStringFromCrypto(16);
	redisSet(csrfToken, "csrfToken", 60 * 1); // 1 minute

	const resParams = {
		pagePath: "Login",
		title: "Login",
		csrfToken: csrfToken,
		next: next,
	};
	res.render("pages/auth/login", resParams);
};

export const loginPostController = async (req, res) => {
	const { email, password, csrfToken } = req.body;
	const csrfValue = await redisGet(csrfToken);
	if (csrfValue) {
		try {
			var user = await Admin.findOne(
				{ email: email, isActive: true },
				{ __v: 0, createdAt: 0, updatedAt: 0, permissions: 0 }
			);
			const permissions = await getUsersPermissions(user._id);
			user = { ...user.toObject(), permissions };
		} catch (error) {
			return res.send({
				status: false,
				message: "Invalid email or password",
			});
		}
		if (user) {
			const isPasswordCorrect = await comparePassword(password, user.password);
			if (isPasswordCorrect) {
				user.password = undefined;
				user.__v = undefined;
				user.createdAt = undefined;
				user.updatedAt = undefined;

				// Set session
				req.session.user = user;
				return res.send({
					status: true,
					message: "Login success",
				});
			} else {
				return res.send({
					status: false,
					message: "Invalid email or password",
				});
			}
		} else {
			return res.send({
				status: false,
				message: "Invalid email or password",
			});
		}
	} else {
		return res.send({
			status: false,
			message: "form expired, please try again",
		});
	}
};

export const logoutController = (req, res) => {
	req.session.destroy();
	messagePusher(req, "success", "Logout successfully");
	return res.redirect("/admin/login");
};
