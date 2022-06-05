#!/usr/bin/env node
"use strict";
// compiled location in dist/src/bin/sbg.js
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var yargs_1 = __importDefault(require("yargs"));
var gulpfile_1 = __importDefault(require("../../gulpfile"));
var indexing_1 = __importDefault(require("../gulp/tasks/generate/indexing"));
var argv = (0, yargs_1.default)(process.argv.slice(2)).argv;
var tasks = argv['_'];
(0, indexing_1.default)();
//console.log(getConfig().verbose, getConfig().generator.cache);
gulpfile_1.default.series.apply(gulpfile_1.default, __spreadArray([], __read(tasks), false))(null);
function _loop_method() {
    var taskswrapper = [];
    for (var i = 0; i < tasks.length; i++) {
        var taskname = tasks[i];
        var taskfn = gulpfile_1.default.task(taskname);
        //console.log('typeof task', taskname, typeof taskfn);
        if (typeof taskfn == "function") {
            taskswrapper.push(taskfn);
        }
    }
    var keeprunning = true;
    while (keeprunning !== false) {
        if (taskswrapper.length > 0) {
            taskswrapper[0](null);
            taskswrapper.shift();
        }
        else {
            keeprunning = false;
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2JnLmpzIiwic291cmNlUm9vdCI6Ii4vc3JjLyIsInNvdXJjZXMiOlsic3JjL2Jpbi9zYmcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSwyQ0FBMkM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUczQyxnREFBMEI7QUFDMUIsNERBQWtDO0FBQ2xDLDZFQUF1RDtBQUV2RCxJQUFNLElBQUksR0FBRyxJQUFBLGVBQUssRUFBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztBQUMvQyxJQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7QUFFeEIsSUFBQSxrQkFBUSxHQUFFLENBQUM7QUFFWCxnRUFBZ0U7QUFFaEUsa0JBQUksQ0FBQyxNQUFNLE9BQVgsa0JBQUksMkJBQVcsS0FBSyxXQUFFLElBQUksQ0FBQyxDQUFDO0FBRTVCLFNBQVMsWUFBWTtJQUNuQixJQUFNLFlBQVksR0FBMEIsRUFBRSxDQUFDO0lBQy9DLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQ3JDLElBQU0sUUFBUSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMxQixJQUFNLE1BQU0sR0FBRyxrQkFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNuQyxzREFBc0Q7UUFDdEQsSUFBSSxPQUFPLE1BQU0sSUFBSSxVQUFVLEVBQUU7WUFDL0IsWUFBWSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUMzQjtLQUNGO0lBRUQsSUFBSSxXQUFXLEdBQUcsSUFBSSxDQUFDO0lBQ3ZCLE9BQU8sV0FBVyxLQUFLLEtBQUssRUFBRTtRQUM1QixJQUFJLFlBQVksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1lBQzNCLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUN0QixZQUFZLENBQUMsS0FBSyxFQUFFLENBQUM7U0FDdEI7YUFBTTtZQUNMLFdBQVcsR0FBRyxLQUFLLENBQUM7U0FDckI7S0FDRjtBQUNILENBQUMifQ==