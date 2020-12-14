#!/usr/bin/env node

const fs = require("fs");
const {program} = require("commander");
const encryptor = require("simple-encryptor");
const utils = require("./utils");

const MIN_PASSWORD_LENGTH = 16;
const REGEX = /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)?$/;

program
  .version("1.0.0")
  .option("-d, --deprecated", "use deprecated mechanism for crypto")
  .option("-p, --password <password>", "password for encrypt/decrypt")
  .parse(process.argv);

const [filepath] = program.args;

if (!fs.existsSync(filepath)) {
  return console.error("Hm... Can't find item by this filepath");
}

const content = fs.readFileSync(filepath, "utf8");
const methodName = REGEX.test(content) ? "decrypt" : "encrypt";

let result;

if (program.deprecated) {
  result = utils[methodName](content, program.password);
} else {
  if (program.password.length < MIN_PASSWORD_LENGTH) {
    program.password += Array(MIN_PASSWORD_LENGTH - program.password.length)
      .fill("0")
      .join("");
  }

  result = encryptor(program.password)[methodName](content);
}

if (result === null) {
  return console.error(`Ooops! Can't ${methodName} your file, maybe it's incorrect password?`);
}

fs.writeFileSync(filepath, result);