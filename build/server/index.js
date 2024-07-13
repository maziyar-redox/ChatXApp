"use strict";
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
exports.default = Server;
/* Lib imports */
const socket_io_1 = require("socket.io");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const readline_1 = __importDefault(require("readline"));
const ngrok_1 = __importDefault(require("ngrok"));
const randomAscii_1 = __importDefault(require("../utils/randomAscii"));
;
function Server(_a) {
    return __awaiter(this, arguments, void 0, function* ({ auth, roomName, userName }) {
        /* Creating new instance of server from socket.io */
        const port = 3000;
        const io = new socket_io_1.Server(port);
        /* Loggin the secret */
        console.clear();
        console.log("=================SECRET=================");
        /*
            In here we called a function that we created for getting random string
            for doubling encryption and manging authorization, the main reason for that
            is we want to make our trafic fully encrypted manualy cuz we MUST use a middleware
            server for transporting our requests, and cuz of that we want to make sure our trafic is
            safe and for some reason we dont want to that middleware server intercept our trafic
        */
        const url = yield ngrok_1.default.connect({
            authtoken: auth,
            addr: port
        });
        const getKey = (0, randomAscii_1.default)(20);
        const signKey = jsonwebtoken_1.default.sign({
            "serverHost": "http://localhost:3000",
        }, getKey);
        console.log("Secret Key: " + signKey);
        console.log("Secret Sign Key: " + getKey);
        console.log("Server Url: " + url);
        console.log("=================SECRET=================");
        console.log("[INFO]: Server is listening on port: %d", port);
        /*
            We use root namespace by default
            connect event
        */
        io.of("/").on("connect", (socket) => {
            console.log("[INFO]: Attempting to connect");
            /*
                join event for authorizing user
            */
            socket.on("join", (data) => {
                /*
                    Checking secrets and if there is any
                    error we disconnect user
                */
                try {
                    if (!data.roomSign) {
                        socket.disconnect();
                        return;
                    }
                    ;
                    if (data.roomSign !== getKey) {
                        socket.disconnect();
                        return;
                    }
                    ;
                    if (!data.roomSecret) {
                        socket.disconnect();
                        return;
                    }
                    ;
                    if (data.action !== "join") {
                        socket.disconnect();
                        return;
                    }
                    ;
                    const verifyKey = jsonwebtoken_1.default.verify(data.roomSecret, getKey);
                    if (!verifyKey) {
                        socket.disconnect();
                        return;
                    }
                    ;
                    console.log("[INFO]: Connected, number of clients: " + io.of("/").server.engine.clientsCount);
                    socket.emit("join", { "sender": data.sender, "action": data.action, "message": "Welcome" + " " + data.sender });
                }
                catch (err) {
                    if (err) {
                        socket.disconnect();
                        return;
                    }
                    ;
                }
                ;
            });
            /* Disconnect event */
            socket.on("disconnect", (reason) => {
                console.log("[INFO]: Client disconnected, reason: %s", reason);
                return;
            });
            /* Main part of server communication */
            socket.on("broadcast", (data) => {
                console.log(`[${data.sender}]: ` + data.msg);
            });
            const rl = readline_1.default.createInterface({
                input: process.stdin,
                output: process.stdout
            });
            rl.on("SIGINT", () => __awaiter(this, void 0, void 0, function* () {
                console.log("\n[INFO]: Quiting...");
                socket.disconnect();
                yield ngrok_1.default.disconnect();
                process.exit(1);
            }));
            rl.on("line", (input) => {
                if (input) {
                    socket.emit("broadcast", { "sender": userName, "action": "broadcast", "msg": input });
                }
                ;
            });
        });
    });
}
;
