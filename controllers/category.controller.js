import Category from "../models/category.model.js";

const createCategory = async (req, res) => {
	const body = req.body;

	try {
		const catData = new Category({
			name: body.name,
			is_sorting: body.is_sorting,
			is_active: body.is_active,
			createdAt: body.createdAt,
			updatedAt: body.updatedAt,
		});

		const result = await catData.save();

		res.send(result);
	} catch (err) {
		console.log(err);
		res.send(err);
	}
};

const getAllCategory = async (req, res) => {
	Category.find(null, null, function (err, docs) {
		if (docs[0] == null) {
			return res.send("Category not available");
		}

		res.send(docs);
	});
};

const getCategory = async (req, res) => {
	Category.find({ _id: req.params.id }, null, function (err, docs) {
		if (err === null) {
			if (docs[0] == null) {
				return res.send("Category not available");
			}
			console.log(docs);
			return res.send(docs);
		}

		return res.send(err);
	});
};

const updateCategory = async (req, res) => {
	const body = req.body;

	Category.find({ _id: req.params.id }, function (err, docs) {
		if (err === null) {
			if (docs[0] == null) {
				return res.send("Category not available");
			}

			const name = body.name ? body.name : docs[0]["name"];
			const is_sorting = body.is_sorting
				? body.is_sorting
				: docs[0]["is_sorting"];
			const is_active = body.is_active ? body.is_active : docs[0]["is_active"];

			Category.updateOne(
				{ _id: req.params.id },
				{
					name: name,
					is_sorting: is_sorting,
					is_active: is_active,
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

const deleteCategory = (req, res) => {
	Category.deleteOne({ _id: req.params.id }, function () {
		res.send("Category deleted");
	});
};

export {
	createCategory,
	getAllCategory,
	getCategory,
	updateCategory,
	deleteCategory,
};
