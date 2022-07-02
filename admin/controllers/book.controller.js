import { Book, BookData, Bookword, Media } from "../../models/index.js";
import { v4 as uuidv4 } from "uuid";
import { randomStringFromCrypto } from "../helpers/uniqueGenerator.js";
import { messagePusher } from "../middlewares/message.middleware.js";
import { redisSet, redisGet } from "../../database/redisDb.js";
import PermissionChecker from "../helpers/permissionChecker.js";

export const booksController = async (req, res) => {
	if (new PermissionChecker(req.user).hasPermission("list_books")) {
		var books = await Book.aggregate([
			{
				$addFields: {
					createdDate: {
						$dateToString: { format: "%d-%m-%Y", date: "$createdAt" },
					},
					updatedDate: {
						$dateToString: { format: "%d-%m-%Y", date: "$updatedAt" },
					},
				},
			},
		]);
		return res.render("pages/book/index", {
			pagePath: "Book",
			title: "Book",
			table: "book",
			rows: books,
		});
	} else {
		messagePusher(req, "danger", "You don't have permission to view this page");
		return res.redirect("/admin/");
	}
};

export const bookCreateGetController = async (req, res) => {
	if (new PermissionChecker(req.user).hasPermission("create_book")) {
		const csrfToken = randomStringFromCrypto(16);
		redisSet(csrfToken, "bookCreate", 60 * 5); // 5 minutes

		const medias = await Media.find({ isActive: true });

		const resParams = {
			pagePath: "Book Create",
			title: "Book Create",
			operation: "create",
			table: "book",
			csrfToken: csrfToken,
			medias: medias,
		};
		res.render("pages/book/view", resParams);
	} else {
		messagePusher(req, "danger", "You don't have permission to view this page");
		return res.redirect("/admin/");
	}
};

export const bookCreatePostController = async (req, res) => {
	if (new PermissionChecker(req.user).hasPermission("create_book")) {
		const csrfToken = req.body.csrfToken;
		const csrfTokenFromRedis = await redisGet(csrfToken);
		if (csrfTokenFromRedis === "bookCreate") {
			Book.create(req.body, (err, book) => {
				if (err) {
					return res.send({
						status: false,
						message: "Error creating book : " + err.message,
					});
				} else {
					if (book) {
						return res.send({
							status: true,
							message: "Book created successfully",
						});
					} else {
						return res.send({
							status: false,
							message: "Error creating book",
						});
					}
				}
			});
		} else {
			return res.send({
				status: false,
				message: "Page expired, please try again",
				redirect: "/admin/book/create",
			});
		}
	} else {
		return res.send({
			status: false,
			message: "You don't have permission to view this page",
			redirect: "/admin/",
		});
	}
};

export const bookUpdateGetController = async (req, res) => {
	if (new PermissionChecker(req.user).hasPermission("edit_book")) {
		const id = req.params.id;

		const csrfToken = randomStringFromCrypto(16);
		redisSet(csrfToken, "bookUpdate", 60 * 5); // 5 minutes

		const medias = await Media.find({ isActive: true });

		const book = await Book.findById(id);
		if (book) {
			const resParams = {
				pagePath: "Book Update",
				title: "Book Update",
				operation: "update",
				id: id,
				row: book,
				table: "book",
				medias: medias,
				csrfToken: csrfToken,
			};
			res.render("pages/book/view", resParams);
		} else {
			messagePusher(req, "danger", "Book not found");
			res.redirect("/admin/book");
		}
	} else {
		messagePusher(req, "danger", "You don't have permission to view this page");
		res.redirect("/admin/");
	}
};

export const bookUpdatePostController = async (req, res, next) => {
	if (new PermissionChecker(req.user).hasPermission("edit_book")) {
		const id = req.params.id;
		const csrfValue = await redisGet(req.body.csrfToken);
		if (csrfValue === "bookUpdate") {
			Book.findByIdAndUpdate(id, req.body, (err, doc) => {
				if (err) {
					if (err.name === "CastError") {
						return res.send({
							status: false,
							message: "Invalid id",
						});
					} else {
						return res.send({
							status: false,
							message: "Error updating book : " + err.message,
						});
					}
				} else {
					if (doc) {
						return res.send({
							status: true,
							message: "Book updated successfully",
							id: doc._id,
						});
					} else {
						return res.send({
							status: false,
							message: "Error updating book",
						});
					}
				}
			});
		} else {
			return res.send({
				status: false,
				message: "Page expired, please try again",
				redirect: "/admin/book/update/" + id,
			});
		}
	} else {
		return res.send({
			status: false,
			message: "You don't have permission to update this book",
			redirect: "/admin/",
		});
	}
};

export const bookDeleteController = async (req, res) => {
	if (new PermissionChecker(req.user).hasPermission("delete_book")) {
		const id = req.params.id;
		Book.findByIdAndDelete(id, (err, book) => {
			if (err) {
				return res.send({
					status: false,
					message: "Error deleting book : " + err.message,
				});
			} else {
				if (book) {
					return res.send({
						status: true,
						message: "Book deleted successfully",
						id: book._id,
					});
				} else {
					return res.send({
						status: false,
						message: "Error deleting book",
					});
				}
			}
		});
	} else {
		return res.send({
			status: false,
			message: "You don't have permission to delete this book",
			redirect: "/admin/",
		});
	}
};

export const bookStatusController = async (req, res) => {
	if (new PermissionChecker(req.user).hasPermission("edit_book")) {
		const id = req.params.id;
		const isActive = req.body.isActive === "true" ? true : false;
		Book.findByIdAndUpdate(id, { isActive: isActive }, (err, book) => {
			if (err) {
				return res.send({
					status: false,
					message: "Error updating book : " + err.message,
				});
			} else {
				if (book) {
					return res.send({
						status: true,
						message: "Book status updated successfully",
						id: book._id,
					});
				} else {
					return res.send({
						status: false,
						message: "Error updating book",
					});
				}
			}
		});
	} else {
		return res.send({
			status: false,
			message: "You don't have permission to update this book",
			redirect: "/admin/",
		});
	}
};

export const bookDataController = async (req, res) => {
	if (new PermissionChecker(req.user).hasPermission("list_bookDatas")) {
		const data = await BookData.find({}).populate("book");
		return res.render("pages/book/dataList", {
			pagePath: "Book Data",
			title: "Book Data",
			table: "bookdata",
			rows: data,
		});
	} else {
		messagePusher(req, "danger", "You don't have permission to view this page");
		res.redirect("/admin/");
	}
};

export const bookDataDeleteController = async (req, res) => {
	if (new PermissionChecker(req.user).hasPermission("delete_bookData")) {
		const id = req.params.id;
		BookData.findByIdAndDelete(id, (err, data) => {
			if (err) {
				return res.send({
					status: false,
					message: "Error deleting book data : " + err.message,
				});
			} else {
				if (data) {
					return res.send({
						status: true,
						message: "Book data deleted successfully",
						id: data._id,
					});
				} else {
					return res.send({
						status: false,
						message: "Error deleting book data",
					});
				}
			}
		});
	} else {
		return res.send({
			status: false,
			message: "You don't have permission to delete this book data",
			redirect: "/admin/",
		});
	}
};

export const bookDataCreateGetController = async (req, res) => {
	if (new PermissionChecker(req.user).hasPermission("create_bookData")) {
		const books = await Book.find({ isActive: true });

		const csrfToken = randomStringFromCrypto(16);
		redisSet(csrfToken, "bookDataCreate", 60 * 5); // 5 minutes

		return res.render("pages/book/dataView", {
			title: "Book Data Create",
			table: "bookdata",
			csrfToken: csrfToken,
			operation: "create",
			books: books,
		});
	} else {
		messagePusher(req, "danger", "You don't have permission to view this page");
		res.redirect("/admin/");
	}
};

export const bookDataCreatePostController = async (req, res) => {
	if (new PermissionChecker(req.user).hasPermission("create_bookData")) {
		const redisValue = await redisGet(req.body.csrfToken);
		if (redisValue === "bookDataCreate") {
			BookData.create(req.body, (err, data) => {
				if (err) {
					return res.send({
						status: false,
						message: "Error creating book data : " + err.message,
					});
				} else {
					if (data) {
						return res.send({
							status: true,
							message: "Book data created successfully",
							id: data._id,
						});
					} else {
						return res.send({
							status: false,
							message: "Error creating book data",
						});
					}
				}
			});
		} else {
			return res.send({
				status: false,
				message: "form expired, please try again",
				redirect: "/admin/bookdata/create",
			});
		}
	} else {
		return res.send({
			status: false,
			message: "You don't have permission to create book data",
		});
	}
};

export const bookDataUpdateGetController = async (req, res) => {
	if (new PermissionChecker(req.user).hasPermission("edit_bookData")) {
		const id = req.params.id;
		const data = await BookData.findById(id).populate("book");

		const csrfToken = randomStringFromCrypto(16);
		redisSet(csrfToken, "bookDataUpdate", 60 * 5); // 5 minutes

		if (data) {
			const books = await Book.find({ isActive: true });
			return res.render("pages/book/dataView", {
				title: "Book Data Update",
				table: "bookdata",
				csrfToken: csrfToken,
				operation: "update",
				data: data,
				id: data._id,
				books: books,
			});
		} else {
			messagePusher(req, "danger", "Book data not found");
			res.redirect("/admin/book/data");
		}
	} else {
		messagePusher(req, "danger", "You don't have permission to view this page");
		res.redirect("/admin/");
	}
};

export const bookDataUpdatePostController = async (req, res) => {
	if (new PermissionChecker(req.user).hasPermission("edit_bookData")) {
		const id = req.params.id;
		const csrfValue = await redisGet(req.body.csrfToken);
		if (csrfValue === "bookDataUpdate") {
			BookData.findByIdAndUpdate(id, req.body, (err, data) => {
				if (err) {
					return res.send({
						status: false,
						message: "Error updating book data : " + err.message,
					});
				} else {
					if (data) {
						return res.send({
							status: true,
							message: "Book data updated successfully",
							id: data._id,
						});
					} else {
						return res.send({
							status: false,
							message: "Error updating book data",
						});
					}
				}
			});
		} else {
			return res.send({
				status: false,
				message: "form expired, please refresh and try again",
				redirect: "/admin/bookdata/update/" + id,
			});
		}
	} else {
		return res.send({
			status: false,
			message: "You don't have permission to update this book data",
			redirect: "/admin/",
		});
	}
};

export const bookDataStatusController = async (req, res) => {
	if (new PermissionChecker(req.user).hasPermission("edit_bookData")) {
		const id = req.params.id;
		const isActive = req.body.isActive === "true" ? true : false;
		BookData.findByIdAndUpdate(id, { isActive: isActive }, (err, data) => {
			if (err) {
				return res.send({
					status: false,
					message: "Error updating book data : " + err.message,
				});
			} else {
				if (data) {
					return res.send({
						status: true,
						message: "Book data updated successfully",
						id: data._id,
					});
				} else {
					return res.send({
						status: false,
						message: "Error updating book data",
					});
				}
			}
		});
	} else {
		return res.send({
			status: false,
			message: "You don't have permission to update this book data",
			redirect: "/admin/",
		});
	}
};

export const bookWordController = async (req, res) => {
	if (new PermissionChecker(req.user).hasPermission("list_bookWords")) {
		const words = await Bookword.find({}).populate("book");
		const books = await Book.find({ isActive: true });
		return res.render("pages/book/keywordList", {
			pagePath: "Book Keywords",
			title: "Book Keywords",
			table: "bookkeyword",
			rows: words,
			books: books,
		});
	} else {
		messagePusher(req, "danger", "You don't have permission to view this page");
		res.redirect("/admin/");
	}
};

export const bookWordAddController = async (req, res) => {
	if (new PermissionChecker(req.user).hasPermission("create_bookWord")) {
		var data = {
			word: req.body.word,
			uniqueId: uuidv4(),
			book: req.body.book,
			meaning: req.body.meaning,
			style: {
				bold: req.body.bold,
				underline: req.body.underline,
				color: req.body.color,
				align: req.body.alignment,
			},
			isActive: true,
		};
		Bookword.create(data, (err, data) => {
			if (err) {
				return res.send({
					status: false,
					message: "Error creating book word : " + err.message,
				});
			} else {
				if (data) {
					return res.send({
						status: true,
						message: "Book word created successfully",
						id: data._id,
						uuid: data.uniqueId,
					});
				} else {
					return res.send({
						status: false,
						message: "Error creating book word",
					});
				}
			}
		});
	} else {
		return res.send({
			status: false,
			message: "You don't have permission to add this book word",
			redirect: "/admin/",
		});
	}
};

export const bookWordGetController = async (req, res) => {
	if (new PermissionChecker(req.user).hasPermission("view_bookWord")) {
		const id = req.params.id;
		const data = await Bookword.findById(id).populate("book");
		if (data) {
			return res.send({
				status: true,
				data: data,
			});
		} else {
			return res.send({
				status: false,
				message: "Book word not found",
			});
		}
	} else {
		return res.send({
			status: false,
			message: "You don't have permission to view this page",
			redirect: "/admin/",
		});
	}
};

export const bookWordUpdateController = async (req, res) => {
	if (new PermissionChecker(req.user).hasPermission("edit_bookWord")) {
		const id = req.params.id;
		var data = {
			word: req.body.word,
			book: req.body.book,
			meaning: req.body.meaning,
			style: {
				bold: req.body.bold,
				underline: req.body.underline,
				color: req.body.color,
				align: req.body.alignment,
			},
		};
		Bookword.findByIdAndUpdate(id, data, (err, data) => {
			if (err) {
				return res.send({
					status: false,
					message: "Error updating book word : " + err.message,
				});
			} else {
				if (data) {
					return res.send({
						status: true,
						message: "Book word updated successfully",
						id: data._id,
					});
				} else {
					return res.send({
						status: false,
						message: "Error updating book word",
					});
				}
			}
		});
	} else {
		return res.send({
			status: false,
			message: "You don't have permission to update this book word",
			redirect: "/admin/",
		});
	}
};

export const bookWordStatusController = async (req, res) => {
	if (new PermissionChecker(req.user).hasPermission("edit_bookWord")) {
		const id = req.params.id;
		const isActive = req.body.isActive === "true" ? true : false;
		Bookword.findByIdAndUpdate(id, { isActive: isActive }, (err, data) => {
			if (err) {
				return res.send({
					status: false,
					message: "Error updating book word status : " + err.message,
				});
			} else {
				if (data) {
					return res.send({
						status: true,
						message: "Book word status updated successfully",
						id: data._id,
					});
				} else {
					return res.send({
						status: false,
						message: "Error updating book word status",
					});
				}
			}
		});
	} else {
		return res.send({
			status: false,
			message: "You don't have permission to update this book word",
			redirect: "/admin/",
		});
	}
};

export const bookWordDeleteController = async (req, res) => {
	if (new PermissionChecker(req.user).hasPermission("delete_bookWord")) {
		const id = req.params.id;
		Bookword.findByIdAndRemove(id, (err, data) => {
			if (err) {
				return res.send({
					status: false,
					message: "Error deleting book word : " + err.message,
				});
			} else {
				if (data) {
					return res.send({
						status: true,
						message: "Book word deleted successfully",
						id: data._id,
					});
				} else {
					return res.send({
						status: false,
						message: "Error deleting book word",
					});
				}
			}
		});
	} else {
		return res.send({
			status: false,
			message: "You don't have permission to delete this book word",
			redirect: "/admin/",
		});
	}
};
