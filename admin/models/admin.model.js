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
		},
		password: {
			type: String,
			required: true,
		},
		isActive: {
			type: Boolean,
			default: false,
		},
		isSuperUser: {
			type: Boolean,
			default: false,
		},
		createdAt: {
			type: Date,
			default: Date.now,
			required: true,
		},
		updatedAt: {
			type: Date,
			default: Date.now,
			required: true,
		},
	},
	{ timestamps: true }
);

const Admin = mongoose.model("Admin", adminSchema);

export default Admin;
