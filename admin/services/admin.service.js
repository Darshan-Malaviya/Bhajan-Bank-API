import mongoose from "mongoose";
import { Admin, Permission } from "../models/index.js";

export const getUserPermissionsByContentTypeGroup = async (userId) => {
	return await Permission.aggregate([
		{ $match: { isActive: true } },
		{
			$lookup: {
				from: "admins",
				localField: "_id",
				foreignField: "permissions",
				as: "userDetails",
				pipeline: [
					{
						$match: {
							_id: new mongoose.Types.ObjectId(userId),
						},
					},
					{
						$addFields: {
							granted: true,
						},
					},
					{
						$project: { granted: 1, _id: 0 },
					},
				],
			},
		},
		{
			$set: {
				granted: {
					$cond: [
						{
							$eq: ["$userDetails", []],
						},
						false,
						true,
					],
				},
			},
		},
		{
			$lookup: {
				from: "contenttypes",
				localField: "contentType",
				foreignField: "_id",
				as: "contentType",
			},
		},
		{
			$group: {
				_id: "$contentType.name",
				permissions: {
					$push: {
						id: "$_id",
						name: "$name",
						identifier: "$identifier",
						granted: "$granted",
					},
				},
			},
		},
		{
			$set: {
				contentType: {
					$arrayElemAt: ["$_id", 0],
				},
			},
		},
		{
			$project: {
				_id: 0,
				contentType: 1,
				permissions: 1,
			},
		},
		{
			$sort: {
				contentType: 1,
			},
		},
	]);
};

export const getUsersPermissions = async (userId) => {
	const permissions = await Admin.aggregate([
		{ $match: { _id: new mongoose.Types.ObjectId(userId) } },
		{
			$lookup: {
				from: "permissions",
				localField: "permissions",
				foreignField: "_id",
				as: "permissions",
			},
		},
		{
			$group: {
				_id: "$permissions.identifier",
			},
		},
	]);
	return permissions[0]._id;
};
