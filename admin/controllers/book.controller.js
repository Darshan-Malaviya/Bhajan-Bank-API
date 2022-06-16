import { Book } from "../../models/index.js";
import { randomBytes } from "crypto";
import { v4 as uuidv4 } from "uuid";

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
	res.render("pages/book", {
		pagePath: "Book",
		title: "Book",
		books: books,
	});
};

export const bookViewController = async (req, res) => {
	const operation = req.params.operation;
	const id = req.params.id;
	var resParams = {};
	if (operation == "view") {
		resParams = {
			pagePath: "Book / View",
			title: "Book View",
			operation: "view",
			id: id,
		};
	} else if (operation == "create") {
		req.session.csrf = uuidv4();
		resParams = {
			pagePath: "Book Create",
			title: "Book Create",
			operation: "create",
			csrfToken: req.session.csrf,
		};
	} else if (operation == "update") {
		req.session.csrf = uuidv4();
		var book = await Book.findById(id).lean();
		console.log(book);
		resParams = {
			pagePath: "Book Update",
			title: "Book Update",
			operation: "update",
			id: id,
			book: book,
			csrfToken: req.session.csrf,
		};
	}
	res.render("pages/bookView", resParams);
};

export const bookDeleteController = (req, res) => {
	const id = req.params.id;
	Book.findByIdAndDelete(id, (err, book) => {
		if (err) {
			messages = [
				{
					type: "danger",
					message: "Error deleting book",
				},
			];
			res.redirect("/admin/book");
		} else {
			messages = [
				{
					type: "success",
					message: "Book deleted successfully\n" + book.title,
				},
			];
			res.redirect("/admin/book");
		}
	});
};
