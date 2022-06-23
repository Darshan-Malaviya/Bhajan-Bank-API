import mongoose from "mongoose";

// Create a new schema for all models here contentType is the name of the collection in the database
const contentTypeSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		identifier: {
			type: String,
			required: true,
			unique: true,
		},
		description: {
			type: String,
			required: true,
		},
		isActive: {
			type: Boolean,
			required: true,
			default: true,
		},
	},
	{ timestamps: true }
);

const ContentType = mongoose.model("ContentType", contentTypeSchema);

export default ContentType;
