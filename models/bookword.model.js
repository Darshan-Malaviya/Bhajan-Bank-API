import mongoose from "mongoose";
import { v4 as uuidV4 } from "uuid";

// style schema for book words
const styleSchema = mongoose.Schema({
	bold: {
		type: Boolean,
		default: false,
	},
	underline: {
		type: Boolean,
		default: false,
	},
	color: {
		type: String,
		default: "black",
	},
	align: {
		type: String,
		default: "left",
		enum: ["left", "center", "right", "justify"],
	},
});

// books keyword model schema
// fields need to add createdBy, updatedBy
const bookwordSchema = new mongoose.Schema(
	{
		uniqueId: {
			type: String,
			required: true,
			unique: true,
		},
		book: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Book",
			required: true,
		},
		word: {
			type: String,
			required: true,
		},
		meaning: {
			type: String,
		},
		style: {
			type: styleSchema,
			required: true,
			default: {
				bold: false,
				underline: false,
				color: "black",
				align: "left",
			},
		},
		isActive: {
			type: Boolean,
			default: true,
		},
	},
	{
		timestamps: true,
	}
);

const Bookword = mongoose.model("Bookword", bookwordSchema);

export default Bookword;
