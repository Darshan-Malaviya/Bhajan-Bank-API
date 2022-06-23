export const homeController = (req, res) => {
	res.render("index", { title: "Dashboard" });
};

export const themeController = (req, res) => {
	const theme = req.body.theme;
	if (theme === "dark" || theme === "light") {
		req.session.theme = theme;
		return res.send({
			status: true,
			message: "Theme changed successfully",
		});
	} else {
		return res.send({
			status: false,
			message: "Theme not changed",
		});
	}
};
