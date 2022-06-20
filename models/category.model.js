import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			maxLength: 50,
		},
		displayPosition: {
			type: Number,
		},
		isActive: {
			type: Boolean,
			default: true,
		},
	},
	{ timestamps: true }
);

const Category = new mongoose.model("Category", categorySchema);

export default Category;
