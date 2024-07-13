/*
    Importing libs
*/

import { io } from "socket.io-client";

import readline from "readline";

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
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    rl.on("SIGINT", () => {
        console.log("\n[INFO]: Quiting...");
        process.exit(1);
    });
    rl.on("line", (input) => {
        if(input) {
            socket.emit("broadcast", { "sender": roomUserName, "action": "broadcast", "msg": input });
        };
    });
};