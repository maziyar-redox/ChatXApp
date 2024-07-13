"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Encrypt;
const crypto_js_1 = __importDefault(require("crypto-js"));
function Encrypt(text, secret_iv, secret_key) {
    if (secret_iv.length !== secret_key.length) {
        throw new Error("Length must be one !");
    }
    ;
    const key = crypto_js_1.default.enc.Base64.parse(secret_key);
    const iv = crypto_js_1.default.enc.Base64.parse(secret_iv);
    const cipherData = crypto_js_1.default.AES.encrypt(text, key, { iv: iv }).toString();
    return cipherData;
}
;
