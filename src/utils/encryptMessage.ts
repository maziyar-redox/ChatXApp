import cryptojs from "crypto-js";

export default function Encrypt(text: string, secret_iv: string, secret_key: string) {
    if (secret_iv.length !== secret_key.length) {
        throw new Error("Length must be one !");
    };
    const key = cryptojs.enc.Base64.parse(secret_key);
    const iv = cryptojs.enc.Base64.parse(secret_iv);
    const cipherData = cryptojs.AES.encrypt(text, key, { iv: iv }).toString();
    return cipherData;
};