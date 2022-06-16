import crypto from "crypto";

crypto.randomBytes(32, (err, buf) => {
	if (err) {
		// Prints error
		console.log(err);
		return;
	}

	// Prints random bytes of generated data
	console.log("The random data is: " + buf.toString("hex"));
});
