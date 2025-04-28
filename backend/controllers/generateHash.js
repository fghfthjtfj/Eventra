import crypto from "crypto";

const secretKey = "sHZWHqQT3C0QwHscZEUxWqdgvmTmDwST";
const id = "123456";
const timestamp = "1704056400";

const concatenatedString = `${secretKey}&${id}&${timestamp}`;
const hash = crypto.createHash("sha1").update(concatenatedString).digest("hex");

console.log("Generated Hash:", hash);
