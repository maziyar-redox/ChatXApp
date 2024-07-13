#!/usr/bin/env node

/*
    Importing libs
*/

import { Command } from "commander";

import Client from "./client";
import Server from "./server";
import Encrypt from "./utils/encryptMessage";

/*
    Inizializing command
*/

const program = new Command();

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
        };
        /* Client function */
        Client({
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
    .action(async (str, options) => {
        console.log(Encrypt("hi", "awefawefawef", "awefawefawef"));
        /* Server({
            auth: options.auth,
            roomName: str,
            userName: options.userName
        }); */
    });

program.parse();