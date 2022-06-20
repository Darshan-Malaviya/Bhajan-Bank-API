import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		isActive: {
			type: Boolean,
			default: true,
		},
		isSuperUser: {
			type: Boolean,
			default: false,
		},
		permissions: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Permission",
			},
		],
	},
	{ timestamps: true }
);

const Admin = mongoose.model("Admin", adminSchema);

export default Admin;
