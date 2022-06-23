import { Admin } from "../admin/models/index.js";

console.log(
	"all permissions and user granted permissions with  granted flag true"
);

// permission granted to the specific admin user

// Permission.aggregate([
// 	{
// 		$lookup: {
// 			from: "admins",
// 			localField: "_id",
// 			foreignField: "permissions",
// 			as: "detail",
// 			pipeline: [
// 				{ $match: { email: "test@gmail.com" } },
// 				{
// 					$addFields: {
// 						granted: true,
// 					}
// 				},
// 				{
// 					$project: { granted: 1, _id: 0 }
// 				}
// 			]
// 		},
// 	},
// 	{
// 		$set: {
// 			granted: {
// 				$cond: [
// 					{
// 						$eq: [
// 							"$detail",
// 							[],
// 						],
// 					},
// 					false,
// 					true,
// 				]
// 			}
// 		},
// 	},
// 	{
// 		$project: {
// 			name: 1,
// 			granted: 1
// 		}
// 	}
// ])
// 	.then(function (result) {
// 		// console.log(result);
// 		res.send({ status: true, message: result });
// 	})
// 	.catch(function (err) {
// 		console.log(err);
// 	});

console.log("permission list group by content type");

// permission list by content type

// Permission.aggregate([
// 	{ $match: { isActive: true } },
// 	{
// 		$lookup: {
// 			from: "contenttypes",
// 			localField: "contentType",
// 			foreignField: "_id",
// 			as: "contentType",
// 		},
// 	},
// 	{
// 		$group: {
// 			_id: "$contentType.identifier",
// 			permissions: {
// 				$push: "$name",
// 			},
// 		},
// 	},
// 	{
// 		$set: {
// 			contentType: {
// 				$arrayElemAt: ["$_id", 0],
// 			},
// 		},
// 	},
// 	{
// 		$project: {
// 			_id: 0,
// 			contentType: 1,
// 			permissions: 1,
// 		},
// 	},
// ])
// 	.then((permissions) => {
// 		res.send(permissions);
// 	})
// 	.catch((err) => {
// 		res.send(err);
// 	});

console.log("users granted permission list group by content type");

// Permission.aggregate([
// 	{ $match: { isActive: true } },
// 	{
// 		$lookup: {
// 			from: "admins",
// 			localField: "_id",
// 			foreignField: "permissions",
// 			as: "userDetails",
// 			pipeline: [
// 				{ $match: { email: "darshanmalaviya163@gmail.com" } },
// 				{
// 					$addFields: {
// 						granted: true,
// 					},
// 				},
// 				{
// 					$project: { granted: 1, _id: 0 },
// 				},
// 			],
// 		},
// 	},
// 	{
// 		$set: {
// 			granted: {
// 				$cond: [
// 					{
// 						$eq: ["$userDetails", []],
// 					},
// 					false,
// 					true,
// 				],
// 			},
// 		},
// 	},
// 	{
// 		$lookup: {
// 			from: "contenttypes",
// 			localField: "contentType",
// 			foreignField: "_id",
// 			as: "contentType",
// 		},
// 	},
// 	{
// 		$group: {
// 			_id: "$contentType.identifier",
// 			permissions: {
// 				$push: {
// 					id: "$_id",
// 					name: "$name",
// 					identifier: "$identifier",
// 					granted: "$granted",
// 				},
// 			},
// 		},
// 	},
// 	{
// 		$set: {
// 			contentType: {
// 				$arrayElemAt: ["$_id", 0],
// 			},
// 		},
// 	},
// 	{
// 		$project: {
// 			_id: 0,
// 			contentType: 1,
// 			permissions: 1,
// 		},
// 	},
// ])
// 	.then((permissions) => {
// 		res.send({
// 			status: true,
// 			data: permissions,
// 		});
// 	})
// 	.catch((err) => {
// 		res.send({
// 			status: false,
// 			message: err,
// 		});
// 	});
