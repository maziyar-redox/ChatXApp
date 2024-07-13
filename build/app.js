#!/usr/bin/env node
"use strict";
/*
    Importing libs
*/
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const client_1 = __importDefault(require("./client"));
const encryptMessage_1 = __importDefault(require("./utils/encryptMessage"));
/*
    Inizializing command
*/
const program = new commander_1.Command();
/*
    Program name
*/
program.name("app.exe")
    .description("A simple and safe encrypted chat client for emergency moments")
    .version("1.0.0");
/*
    Client command
*/
program.command("client")
    .description("Register as a client")
    .argument("<room>", "Set room url to join")
    .requiredOption("-k, --p8-key <key>", "Set priv8 key for entering room")
    .requiredOption("-s, --sign-key <sign>", "Set priv8 key for entering room")
    .requiredOption("-u, --user-name <name>", "Set user name for room")
    .action((str, options) => {
    /*
        Parsing and validating url format
    */
    const url = URL.canParse(str);
    if (!url) {
        console.log("Passed wrong url, quiting...");
        process.exit(1);
    }
    ;
    /* Client function */
    (0, client_1.default)({
        roomAddress: str,
        roomSecret: options.p8Key,
        roomUserName: options.userName,
        roomSign: options.signKey
    });
});
/*
    Server Command
*/
program.command("server")
    .description("Register as a server")
    .argument("<room>", "Set room name for creating")
    .requiredOption('-a, --auth <key>', 'Set priv8 key for ngrok')
    .requiredOption("-u, --user-name <name>", "Set user name for room")
    .action((str, options) => __awaiter(void 0, void 0, void 0, function* () {
    console.log((0, encryptMessage_1.default)("hi", "awefawefawef", "awefawefawef"));
    /* Server({
        auth: options.auth,
        roomName: str,
        userName: options.userName
    }); */
}));
program.parse();
