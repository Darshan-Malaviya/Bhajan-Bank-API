export const messageMiddleware = (req, res, next) => {
	var messages = [];
	messages = req.app.locals.mesContext;
	if (messages == undefined) {
		next();
	} else {
		for (let index = 0; index < messages.length; index++) {
			const element = messages[index];
			if (element.count > 0) {
				messages.splice(index, 1);
			} else {
				messages[index].count++;
			}
		}
		req.app.locals.messages = messages;
		next();
	}
};

export const messagePusher = (req, type, mesBody) => {
	var messages = [];
	var oldMessages = req.app.locals.mesContext;
	messages.push({
		count: 0,
		type: type,
		message: mesBody,
	});
	if (oldMessages != undefined) {
		oldMessages.forEach((element) => {
			messages.push(element);
		});
	}
	req.app.locals.mesContext = messages;
};
