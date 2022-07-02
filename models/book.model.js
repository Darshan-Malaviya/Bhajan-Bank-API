import mongoose from "mongoose";

//books model schema
// fields need to add createdBy, updatedBy
const bookSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		author: {
			type: String,
		},
		publisher: {
			type: String,
		},
		description: {
			type: String,
			required: true,
		},
		image: {
			type: String,
			required: true,
		},
		url: {
			type: String,
			required: true,
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

const Book = mongoose.model("Book", bookSchema);

export default Book;
