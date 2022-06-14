import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		maxLength: 50,
	},
	is_sorting: {
		type: Number,
	},
	is_active: {
		type: Number,
		required: true,
		maxLength: 1,
	},
	createdAt: {
		type: Date,
		default: Date.now,
		required: true,
	},
	updatedAt: {
		type: Date,
		default: Date.now,
		required: true,
	},
});

const Category = new mongoose.model("Category", categorySchema);

export default Category;
