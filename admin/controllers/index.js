import Admin from "../models/admin.model.js";

export const homeController = (req, res) => {
	res.render("index");
};

export const adminController = (req, res) => {
	Admin.find(null, { password: 0 }, function (err, docs) {
		if (docs[0] == null) {
			return res.send("Admins not available");
		}

		res.render("admin", { data: docs });
	});
};
