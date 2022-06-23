export const themeMiddleware = (req, res, next) => {
	const theme = req.session.theme;
	if (theme) {
		req.app.locals.theme = theme;
	} else {
		req.app.locals.theme = "dark";
	}
	next();
};
