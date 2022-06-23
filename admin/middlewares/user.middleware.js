export const userVerification = (req, res, next) => {
	const user = req.session.user;
	if (user) {
		req.app.locals.user = user;
		return next();
	}
	return res.redirect("/admin/login?next=" + req.originalUrl);
};
