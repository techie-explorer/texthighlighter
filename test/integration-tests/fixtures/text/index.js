import fs from "fs";

let b64EncodedFontStylesStr;

export const b64EncodedFontStyles = () =>
  !b64EncodedFontStylesStr
    ? (b64EncodedFontStylesStr = fs
        .readFileSync(`${__dirname}/base64-encoded-fonts-styles.txt`)
        .toString())
    : b64EncodedFontStylesStr;

let regularStylesStr;

export const regularStyles = () =>
  !regularStylesStr
    ? (regularStylesStr = fs.readFileSync(`${__dirname}/regular-styles.txt`).toString())
    : regularStylesStr;

let scriptStr;

export const script = () =>
  !scriptStr ? (scriptStr = fs.readFileSync(`${__dirname}/script.txt`).toString()) : scriptStr;
