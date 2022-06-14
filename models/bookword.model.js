const mongooose = require("mongoose");

// style schema for book words
const styleSchema = new mongooose.Schema({
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
const bookwordSchema = new mongooose.Schema(
	{
		uniqueId: {
			type: String,
			required: true,
			unique: true,
		},
		bookId: {
			type: mongooose.Schema.Types.ObjectId,
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

const Bookword = mongooose.model("Bookword", bookwordSchema);

module.exports = Bookword;
