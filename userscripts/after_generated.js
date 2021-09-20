const fs = require("fs");
const path = require("path");
const _ = require("lodash");

if (typeof "".replaceAll != "function") {
  String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, "g"), replacement);
  };
}

// process docs/assets/js/quiz.js
let quizjs = path.join(__dirname, "/../docs/assets/js/quiz.js");
let read = fs.readFileSync(quizjs).toString();
let regex = /\#uniqid\(\)/gm;
let uuid = _.uniqueId();
read = read.replaceAll(regex, uuid);
fs.writeFileSync(quizjs, read);
