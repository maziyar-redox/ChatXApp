/* Lib imports */
import { Server as host } from "socket.io";

import moment from "moment";
import jwt from "jsonwebtoken";
import readline from "readline";
import ngrok from "ngrok";

import "dotenv/config";

import getNowTime from "../utils/nowTime";
import randomAsciiString from "../utils/randomAscii";

const HOST_URL = process.env.HOST_URL as string;
const HOST_PORT = parseInt(process.env.HOST_PORT as string);

/*
    Server Interface
*/
interface ServerType {
    auth: string;
    roomName: string;
    userName: string;
};

export default async function Server({
    auth,
    roomName,
    userName
}: ServerType) {
    /* Creating new instance of server from socket.io */
    const io = new host(HOST_PORT);
    /* Loggin the secret */
    console.clear();
    console.log("=================SECRET=================");
    /*
        In here we called a function that we created for getting random string
        for doubling encryption and managing authorization, the main reason for that
        is we want to make our trafic fully encrypted manualy cuz we MUST use a middleware
        server for transporting our requests, and cuz of that we want to make sure our trafic is
        safe and for some reason we dont want to that middleware server intercept our trafic
    */
    const url = await ngrok.connect({
        authtoken: auth,
        addr: HOST_PORT
    });
    const getKey = randomAsciiString(20);
    const signKey = jwt.sign({
        "serverHost": `${HOST_URL}:${HOST_PORT}`,
    }, getKey);
    console.log(`[${getNowTime()}]` + "Secret Key: "+ signKey);
    console.log(`[${getNowTime()}]` + "Secret Sign Key: " + getKey);
    console.log(`[${getNowTime()}]` + "Server Url: " + url);
    console.log("=================SECRET=================");
    console.log(`[${getNowTime()}]` + "[INFO]: Server is listening on port: %d", HOST_PORT);
    /*
        We use root namespace by default
        connect event
    */
    io.of("/").on("connect", (socket) => {
        console.log(`[${getNowTime()}]` + "[INFO]: Attempting to connect");
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
                };
                if (data.roomSign !== getKey) {
                    socket.disconnect();
                    return;
                };
                if (!data.roomSecret) {
                    socket.disconnect();
                    return;
                };
                if (data.action !== "join") {
                    socket.disconnect();
                    return;
                };
                const verifyKey = jwt.verify(data.roomSecret, getKey);
                if (!verifyKey) {
                    socket.disconnect();
                    return;
                };
                console.log(`[${getNowTime()}]` + "[INFO]: Connected, number of clients: " + io.of("/").server.engine.clientsCount);
                socket.emit("join", { "sender": data.sender, "action": data.action, "message": "Welcome" + " " + data.sender });
                return;
            } catch (err) {
                if (err) {
                    socket.disconnect();
                    return;
                };
            };
        });
        /* Disconnect event */
        socket.on("disconnect", (reason) => {
            console.log(`\n[${getNowTime()}]` + "[INFO]: Client disconnected, reason: %s", reason);
            return;
        });
        /* Main part of server communication */
        socket.on("broadcast", (data) => {
            console.log(`\n[${getNowTime()}]` + `[${data.sender}]: ` + data.msg);
            return;
        });
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        rl.setPrompt("YOU >>> ");
        rl.prompt();
        rl.on("SIGINT", async () => {
            console.log(`\n[${getNowTime()}]` + "[INFO]: Quiting...");
            socket.disconnect();
            await ngrok.disconnect();
            process.exit(1);
        });
        rl.on("line", (input: any) => {
            if(input) {
                socket.emit("broadcast", { "sender": userName, "action": "broadcast", "msg": input });
            };
            rl.prompt();
        });
    });
};