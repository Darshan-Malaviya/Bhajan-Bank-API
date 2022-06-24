import mongoose from "mongoose";

const niyamSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		category: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Category",
			required: true,
		},
		shortDescription: {
			type: String,
			required: true,
		},
		description: {
			type: String,
		},
		image: {
			type: String,
			required: true,
		},
		gifImage: {
			type: String,
		},
		inputType: {
			type: String,
			enum: [
				"text",
				"boolean",
				"rangeSelection",
				"bookSelection",
				"checkboxSelection",
			],
			required: true,
		},
		targetType: {
			type: String,
			enum: ["text", "boolean", "bookSelection", "checkboxSelection"],
			required: true,
		},
		extraFunction: {
			type: String,
			enum: ["book", "mantralekhan", "mantrajap", "video", ""],
			required: true,
		},
		displayPosition: {
			type: Number,
		},
		templeTarget: {
			type: Number,
		},
		isActive: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true }
);

const Niyam = mongoose.model("Niyam", niyamSchema);

export default Niyam;
