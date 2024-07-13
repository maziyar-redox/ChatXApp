"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = randomAsciiString;
const crypto_1 = __importDefault(require("crypto"));
function randomString(length, char) {
    if (!char) {
        throw new Error("Argument 'chars' is undefined");
    }
    ;
    const charLength = char.length;
    if (charLength > 256) {
        throw new Error("Argument 'chars' should not have more than 256 characters" + ", otherwise unpredictability will be broken");
    }
    ;
    const randomBytes = crypto_1.default.randomBytes(length);
    const result = new Array(length);
    let cursor = 0;
    for (let i = 0; i < length; i++) {
        cursor += randomBytes[i];
        result[i] = char[cursor % charLength];
    }
    ;
    return result.join("");
}
;
function randomAsciiString(length) {
    return randomString(length, "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789");
}
;
