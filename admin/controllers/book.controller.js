import { Book } from "../../models/index.js";
import { v4 as uuidv4 } from "uuid";
import { randomStringFromCrypto } from "../helpers/uniqueGenerator.js";
import { messagePusher } from "../middlewares/message.middleware.js";
import { redisSet, redisGet } from "../../database/redisDb.js";
import { idValidator } from "../helpers/validation.js";

export const booksController = async (req, res) => {
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
	res.render("pages/book/index", {
		pagePath: "Book",
		title: "Book",
		rows: books,
	});
};

export const bookViewController = async (req, res) => {
	const id = req.params.id;

	var book = await Book.findById(id);
	if (book) {
		const resParams = {
			pagePath: "Book / View",
			title: "Book View",
			operation: "view",
			book: book,
			id: id,
		};
		res.render("pages/book/view", resParams);
	} else {
		messagePusher(req, "danger", "Book not found");
		return res.redirect("/admin/book");
	}
};

export const bookCreateGetController = async (req, res) => {
	const csrfToken = randomStringFromCrypto(16);
	redisSet(csrfToken, "csrfToken", 60 * 5); // 5 minutes

	const resParams = {
		pagePath: "Book Create",
		title: "Book Create",
		operation: "create",
		csrfToken: csrfToken,
	};
	res.render("pages/book/view", resParams);
};

export const bookCreatePostController = async (req, res) => {
	const csrfToken = req.body.csrfToken;
	if (csrfToken) {
		const csrfValue = await redisGet(csrfToken);
		if (csrfValue) {
			const book = Book({
				title: req.body.title,
				author: req.body.author,
				publisher: req.body.publisher,
				description: req.body.description,
				image: "",
				url: "",
				isActive: req.body.isActive == 'on' ? true : false,
			});
			try {
				await book.save();
			} catch (error) {
				messagePusher(req, "danger", "Book not created " + error);
				res.redirect("/admin/book");
			}
			messagePusher(
				req,
				"success",
				`"${book.title}" Book created successfully`
			);
		} else {
			messagePusher(req, "danger", "Invalid csrf token");
		}
	} else {
		messagePusher(req, "danger", "CSRF Token not found");
	}
	res.redirect("/admin/book");
};

export const bookUpdateGetController = async (req, res) => {
	const id = req.params.id;

	const csrfToken = randomStringFromCrypto(16);
	redisSet(csrfToken, "csrfToken", 60 * 5); // 5 minutes

	const book = await Book.findById(id);
	if (book) {
		const resParams = {
			pagePath: "Book Update",
			title: "Book Update",
			operation: "update",
			id: id,
			book: book,
			csrfToken: csrfToken,
		};
		res.render("pages/book/view", resParams);
	}
	else {
		messagePusher(req, "danger", "Book not found");
		res.redirect("/admin/book");
	}
};

export const bookUpdatePostController = async (req, res, next) => {
	const id = req.params.id;
	const csrfToken = req.body.csrfToken;
	if (csrfToken) {
		const csrfValue = await redisGet(csrfToken);
		if (csrfValue) {
			Book.findByIdAndUpdate(id, {
				title: req.body.title,
				author: req.body.author,
				publisher: req.body.publisher,
				description: req.body.description,
				isActive: req.body.isActive == 'on' ? true : false,
			}, (err, doc) => {
				if (err) {
					if (err.name === 'CastError') {
						messagePusher(req, "danger", "Invalid Book id");
					} else {
						messagePusher(req, "danger", "Book not updated " + err);
					}
				} else {
					messagePusher(req, "success", `"${doc.title}" Book updated successfully`);
				}
			});
		} else {
			messagePusher(req, "danger", "Invalid CSRF token");
		}
	} else {
		messagePusher(req, "danger", "CSRF token not found");
	}
	return res.redirect("/admin/book");
};

export const bookDeleteController = (req, res) => {
	const id = req.params.id;
	Book.findByIdAndDelete(id, (err, book) => {
		if (err) {
			messagePusher(req, "danger", "Book not deleted");
		} else {
			if (book) {
				messagePusher(
					req,
					"success",
					book.title + " Book deleted successfully"
				);
			} else {
				messagePusher(req, "danger", "Book not found");
			}
		}
		res.redirect("/admin/book");
	});
};
