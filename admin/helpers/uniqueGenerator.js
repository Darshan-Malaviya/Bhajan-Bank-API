import { randomBytes } from "crypto";

export const randomStringFromCrypto = (length) => {
	return randomBytes(length).toString("hex");
};

export const randomStringFromDate = () => {
	return Date.now().toString(36) + Math.random().toString(36).substr(2);
};