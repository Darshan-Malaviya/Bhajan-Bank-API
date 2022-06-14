import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
	{
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
	},
	{ timestamps: true }
);

const Category = new mongoose.model("Category", categorySchema);

export default Category;
