import PermissionChecker from "../helpers/permissionChecker.js";
// import { getUsersPermissions } from "../services/admin.service.js";

export const userVerification = async (req, res, next) => {
	const user = req.session.user;
	if (user) {
		// const permissions = await getUsersPermissions(user._id);
		// user.permissions = permissions;
		req.user = user;
		req.app.locals.user = user;
		req.app.locals.PermissionChecker = PermissionChecker;
		return next();
	}
	if (req.xhr) {
		return res.status(403).json({
			message: "You are not logged in",
			redirect: "/admin/login?next=" + req.originalUrl,
		});
	} else {
		return res.redirect("/admin/login?next=" + req.originalUrl);
	}
};
