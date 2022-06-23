import { Permission } from "../models/index.js";

export const getPermissions = async () => {
	const permissions = await Permission.aggregate([
		{
			$lookup: {
				from: "contenttypes",
				localField: "contentType",
				foreignField: "_id",
				as: "contentType",
				pipeline: [
					{
						$match: {
							isActive: true,
						},
					},
				],
			},
		},
		{
			$set: {
				contentType: {
					$cond: {
						if: { $isArray: "$contentType" },
						then: { $arrayElemAt: ["$contentType", 0] },
						else: null,
					},
				},
			},
		},
		{
			$match: {
				contentType: { $ne: null },
			},
		},
	]);
	return permissions;
};
