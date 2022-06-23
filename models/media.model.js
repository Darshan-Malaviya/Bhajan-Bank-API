import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		type: {
			type: String,
			enum: ["image", "video", "audio", "document", "other"],
			required: true,
		},
		url: {
			type: String,
			required: true,
		},
		contentType: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "ContentType",
		},
		isActive: {
			type: Boolean,
			default: true,
			required: true,
		},
	},
	{ timestamps: true }
);

const Media = mongoose.model("Media", mediaSchema);

export default Media;
