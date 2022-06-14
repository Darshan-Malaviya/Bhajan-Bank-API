import Admin from "../models/admin.model.js";
import bcrypt from "bcrypt";

export const createAdmin = async (req, res) => {
	const body = req.body;

	bcrypt.hash(body.password, 10, async function (err, hash) {
		try {
			const adminData = new Admin({
				name: body.name,
				email: body.email,
				password: hash,
				is_role: body.is_role,
				is_active: body.is_active,
				permissions: body.permissions,
				createdAt: body.createdAt,
				updatedAt: body.updatedAt,
			});

			const result = await adminData.save();

			res.send(result);
		} catch (err) {
			console.log(err);
			res.send(err);
		}
	});
};

export const getAllAdmin = async (req, res) => {
	Admin.find(null, { password: 0 }, function (err, docs) {
		if (docs[0] == null) {
			return res.send("Admins not available");
		}

		res.send(docs);
	});
};

export const getAdmin = async (req, res) => {
	Admin.find({ _id: req.params.id }, { password: 0 }, function (err, docs) {
		if (err === null) {
			if (docs[0] == null) {
				return res.send("Admin not available");
			}
			console.log(docs);
			return res.send(docs);
		}

		return res.send(err);
	});
};

export const updateAdmin = async (req, res) => {
	const body = req.body;

	Admin.find({ _id: req.params.id }, function (err, docs) {
		if (err === null) {
			if (docs[0] == null) {
				return res.send("Admin not available");
			}

			console.log(body.name, docs[0]["name"]);

			const name = body.name ? body.name : docs[0]["name"];
			const email = body.email ? body.email : docs[0]["email"];
			const is_role = body.is_role ? body.is_role : docs[0]["is_role"];
			const is_active = body.is_active ? body.is_active : docs[0]["is_active"];
			const permissions = body.permissions
				? body.permissions
				: docs[0]["permissions"];

			Admin.updateOne(
				{ _id: req.params.id },
				{
					name: name,
					email: email,
					is_role: is_role,
					is_active: is_active,
					permissions: permissions,
					updatedAt: Date.now(),
				},
				function (err, doc) {
					console.log("Update");
					return res.send(doc);
				}
			);

			return true;
		}

		console.log("err");
		res.send(err);
	});
};

export const deleteAdmin = (req, res) => {
	Admin.deleteOne({ _id: req.params.id }, function () {
		res.send("Admin deleted");
	});
};

export const login = (req, res) => {
	const body = req.body;

	Admin.find({ email: body.email }, function (err, docs) {
		if (docs[0] == null) {
			return res.send("E-mail not valid");
		}

		bcrypt.compare(body.password, docs[0]["password"], function (err, result) {
			if (result == true) {
				return res.send("Login successfull");
			}

			res.send("E-mail or Password invalid");
		});
	});
};
