import crypto from "crypto";

function randomString(length: number, char: string) {
    if (!char) {
        throw new Error("Argument 'chars' is undefined");
    };
    const charLength = char.length;
    if (charLength > 256) {
        throw new Error("Argument 'chars' should not have more than 256 characters" + ", otherwise unpredictability will be broken");
    };
    const randomBytes = crypto.randomBytes(length);
    const result = new Array(length);
    let cursor = 0;
    for (let i = 0; i < length; i++) {
        cursor += randomBytes[i];
        result[i] = char[cursor % charLength];
    };
    return result.join("");
};

export default function randomAsciiString(length: number) {
    return randomString(length, "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789");
};