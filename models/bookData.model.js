import mongoose from "mongoose";

const bookDataSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
		},
		book: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Book",
			required: true,
		},
		data: {
			type: String,
			required: true,
		},
		isActive: {
			type: Boolean,
			default: true,
		},
	},
	{ timestamps: true }
);

const BookData = mongoose.model("BookData", bookDataSchema);

export default BookData;
