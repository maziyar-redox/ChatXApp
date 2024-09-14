/*
    Importing libs
*/

import { io } from "socket.io-client";

import readline from "readline";

import getNowTime from "../utils/nowTime";
/* Client interface */

interface ClientType {
    roomSign: string;
    roomSecret: string;
    roomUserName: string;
    roomAddress: string;
};

export default function Client({
    roomAddress,
    roomSecret,
    roomUserName,
    roomSign
}: ClientType) {
    /*
        Getting room address
    */
    const socket = io(roomAddress, {
        timeout: 5000,
        reconnectionAttempts: 2
    });
    console.clear();
    console.log(`[${getNowTime()}]` + "[INFO]: Connecting to the server...");
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    rl.pause();
    rl.setPrompt("YOU >>> ");
    rl.prompt();
    rl.on("SIGINT", () => {
        console.log(`\n[${getNowTime()}]` + "[INFO]: Quiting...");
        process.exit(1);
    });
    rl.on("line", (input) => {
        if(input) {
            socket.emit("broadcast", { "sender": roomUserName, "action": "broadcast", "msg": input });
        };
        rl.prompt();
    });
    /*
        Connect_error event
    */
    socket.on("connect_error", () => {
        console.log(`\n[${getNowTime()}]` + "[INFO]: Couldn't connect to host...");
        process.exit(1);
    });
    /*
        Connect event
    */
    socket.on("connect", () => {
        socket.emit("join", { "sender": roomUserName, "action": "join", "roomSecret": roomSecret, "roomSign": roomSign });
        rl.resume();
        return;
    });
    /* Broadcast event */
    socket.on("broadcast", (data) => {
        console.log(`\n[${getNowTime()}]` + `[${data.sender}]: ` + data.msg);
        rl.prompt();
        return;
    });
    /*
        Disconnect event
    */
    socket.on("disconnect", () => {
        console.log(`\n[${getNowTime()}]` + "[INFO]: Host disconnected for unknown reason");
        process.exit(1);
    });
    /*
        Join event
    */
    socket.on("join", (data) => {
        console.log(`[${getNowTime()}]` + "[HOST]: " + data.message);
        return;
    });
};