"use strict";
/*
    Importing libs
*/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Client;
const socket_io_client_1 = require("socket.io-client");
const readline_1 = __importDefault(require("readline"));
;
function Client({ roomAddress, roomSecret, roomUserName, roomSign }) {
    /*
        Getting room address
    */
    const socket = (0, socket_io_client_1.io)(roomAddress, {
        timeout: 2000
    });
    console.clear();
    console.log("[INFO]: Connecting to the server...");
    /*
        Connect event
    */
    socket.on("connect", () => {
        socket.emit("join", { "sender": roomUserName, "action": "join", "roomSecret": roomSecret, "roomSign": roomSign });
    });
    /* Broadcast event */
    socket.on("broadcast", (data) => {
        console.log(`[${data.sender}]: ` + data.msg);
    });
    /*
        Disconnect event
    */
    socket.on("disconnect", () => {
        console.log("\n[INFO]: Host disconnected for unknown reason");
        process.exit(1);
    });
    /*
        Join event
    */
    socket.on("join", (data) => {
        console.log("[HOST]: " + data.message);
    });
    const rl = readline_1.default.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    rl.on("SIGINT", () => {
        console.log("\n[INFO]: Quiting...");
        process.exit(1);
    });
    rl.on("line", (input) => {
        if (input) {
            socket.emit("broadcast", { "sender": roomUserName, "action": "broadcast", "msg": input });
        }
        ;
    });
}
;
