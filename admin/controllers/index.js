export const homeController = (req, res) => {
	res.render("pages/index", { title: "Dashboard", pagePath: "Dashboard" });
};
