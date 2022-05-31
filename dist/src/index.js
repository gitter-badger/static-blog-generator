"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dumpEnv = exports.copyAssets = exports.copyPosts = exports.clean_tmp = exports.clean_public = exports.clean_posts = exports.clean_db = void 0;
var fs_1 = require("fs");
var gulp_1 = __importDefault(require("gulp"));
var upath_1 = require("upath");
var server_1 = require("./gulp/server");
var clean_1 = require("./gulp/tasks/clean");
var copy_1 = require("./gulp/tasks/copy");
var assets_1 = require("./gulp/tasks/copy/assets");
var remove_inline_style_1 = require("./gulp/tasks/copy/remove-inline-style");
require("./gulp/tasks/deploy");
require("./gulp/tasks/generate");
var scheduler_1 = __importDefault(require("./node/scheduler"));
// generate empty config if not exists
[
    (0, upath_1.join)(__dirname, 'types/_config_project.json'),
    (0, upath_1.join)(__dirname, 'types/_config_theme.json'),
    (0, upath_1.join)(__dirname, 'types/_config_hashes.json')
].forEach(function (path) {
    if (!(0, fs_1.existsSync)(path)) {
        (0, fs_1.writeFileSync)(path, '{}');
    }
});
// register scheduler
new scheduler_1.default();
/**
 * @see {@link https://stackoverflow.com/a/67394338/6404439}
 */
process.on('uncaughtException', function (err) {
    console.error('uncaughtException:\n' + err.stack + '\n');
});
// DEVELOPMENT TASKS
require((0, upath_1.join)(__dirname, 'gulp/tasks/dump'));
// COPY TASKS
gulp_1.default.task('copy:assets', function () { return (0, assets_1.copyAssets)(); });
gulp_1.default.task('copy:posts', function () { return (0, copy_1.copyPosts)(); });
gulp_1.default.task('copy:remove-inline-style', function () { return (0, remove_inline_style_1.gulpInlineStyle)(); });
gulp_1.default.task('copy', gulp_1.default.series('copy:assets', 'copy:posts'));
gulp_1.default.task('copy:blogger', gulp_1.default.series('copy', 'copy:remove-inline-style'));
// LOCAL SERVER
gulp_1.default.task('server', server_1.localServer);
gulp_1.default.task('serve', gulp_1.default.series('server'));
// CLEAN TASKS
gulp_1.default.task('clean:public', clean_1.clean_public);
gulp_1.default.task('clean:posts', clean_1.clean_posts);
gulp_1.default.task('clean:db', clean_1.clean_db);
gulp_1.default.task('clean:tmp', clean_1.clean_tmp);
gulp_1.default.task('clean', gulp_1.default.parallel('clean:db', 'clean:tmp', 'clean:posts', 'clean:public'));
// DEFAULT TASK
gulp_1.default.task('default', gulp_1.default.series('copy', 'generate'));
var properties = {
    copyPosts: copy_1.copyPosts,
    copyAssets: assets_1.copyAssets,
    gulpInlineStyle: remove_inline_style_1.gulpInlineStyle,
    clean_db: clean_1.clean_db,
    clean_posts: clean_1.clean_posts,
    clean_public: clean_1.clean_public,
    clean_tmp: clean_1.clean_tmp
};
var clean_2 = require("./gulp/tasks/clean");
Object.defineProperty(exports, "clean_db", { enumerable: true, get: function () { return clean_2.clean_db; } });
Object.defineProperty(exports, "clean_posts", { enumerable: true, get: function () { return clean_2.clean_posts; } });
Object.defineProperty(exports, "clean_public", { enumerable: true, get: function () { return clean_2.clean_public; } });
Object.defineProperty(exports, "clean_tmp", { enumerable: true, get: function () { return clean_2.clean_tmp; } });
var copy_2 = require("./gulp/tasks/copy");
Object.defineProperty(exports, "copyPosts", { enumerable: true, get: function () { return copy_2.copyPosts; } });
var assets_2 = require("./gulp/tasks/copy/assets");
Object.defineProperty(exports, "copyAssets", { enumerable: true, get: function () { return assets_2.copyAssets; } });
var dump_1 = require("./gulp/tasks/dump");
Object.defineProperty(exports, "dumpEnv", { enumerable: true, get: function () { return dump_1.dumpEnv; } });
exports.default = properties;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiLi9zcmMvIiwic291cmNlcyI6WyJzcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEseUJBQStDO0FBQy9DLDhDQUF3QjtBQUN4QiwrQkFBNkI7QUFDN0Isd0NBQTRDO0FBQzVDLDRDQUs0QjtBQUM1QiwwQ0FBOEM7QUFDOUMsbURBQXNEO0FBQ3RELDZFQUF3RTtBQUN4RSwrQkFBNkI7QUFDN0IsaUNBQStCO0FBQy9CLCtEQUF5QztBQUV6QyxzQ0FBc0M7QUFDdEM7SUFDRSxJQUFBLFlBQUksRUFBQyxTQUFTLEVBQUUsNEJBQTRCLENBQUM7SUFDN0MsSUFBQSxZQUFJLEVBQUMsU0FBUyxFQUFFLDBCQUEwQixDQUFDO0lBQzNDLElBQUEsWUFBSSxFQUFDLFNBQVMsRUFBRSwyQkFBMkIsQ0FBQztDQUM3QyxDQUFDLE9BQU8sQ0FBQyxVQUFDLElBQUk7SUFDYixJQUFJLENBQUMsSUFBQSxlQUFVLEVBQUMsSUFBSSxDQUFDLEVBQUU7UUFDckIsSUFBQSxrQkFBYSxFQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztLQUMzQjtBQUNILENBQUMsQ0FBQyxDQUFDO0FBS0gscUJBQXFCO0FBQ3JCLElBQUksbUJBQVMsRUFBRSxDQUFDO0FBRWhCOztHQUVHO0FBQ0gsT0FBTyxDQUFDLEVBQUUsQ0FBQyxtQkFBbUIsRUFBRSxVQUFVLEdBQUc7SUFDM0MsT0FBTyxDQUFDLEtBQUssQ0FBQyxzQkFBc0IsR0FBRyxHQUFHLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxDQUFDO0FBQzNELENBQUMsQ0FBQyxDQUFDO0FBRUgsb0JBQW9CO0FBQ3BCLE9BQU8sQ0FBQyxJQUFBLFlBQUksRUFBQyxTQUFTLEVBQUUsaUJBQWlCLENBQUMsQ0FBQyxDQUFDO0FBRTVDLGFBQWE7QUFDYixjQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxjQUFNLE9BQUEsSUFBQSxtQkFBVSxHQUFFLEVBQVosQ0FBWSxDQUFDLENBQUM7QUFDN0MsY0FBSSxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsY0FBTSxPQUFBLElBQUEsZ0JBQVMsR0FBRSxFQUFYLENBQVcsQ0FBQyxDQUFDO0FBQzNDLGNBQUksQ0FBQyxJQUFJLENBQUMsMEJBQTBCLEVBQUUsY0FBTSxPQUFBLElBQUEscUNBQWUsR0FBRSxFQUFqQixDQUFpQixDQUFDLENBQUM7QUFDL0QsY0FBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsY0FBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLEVBQUUsWUFBWSxDQUFDLENBQUMsQ0FBQztBQUM1RCxjQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRSxjQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSwwQkFBMEIsQ0FBQyxDQUFDLENBQUM7QUFFM0UsZUFBZTtBQUNmLGNBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLG9CQUFXLENBQUMsQ0FBQztBQUNqQyxjQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxjQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7QUFFMUMsY0FBYztBQUNkLGNBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFLG9CQUFZLENBQUMsQ0FBQztBQUN4QyxjQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxtQkFBVyxDQUFDLENBQUM7QUFDdEMsY0FBSSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsZ0JBQVEsQ0FBQyxDQUFDO0FBQ2hDLGNBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLGlCQUFTLENBQUMsQ0FBQztBQUNsQyxjQUFJLENBQUMsSUFBSSxDQUNQLE9BQU8sRUFDUCxjQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsRUFBRSxXQUFXLEVBQUUsYUFBYSxFQUFFLGNBQWMsQ0FBQyxDQUN0RSxDQUFDO0FBRUYsZUFBZTtBQUNmLGNBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLGNBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLFVBQVUsQ0FBQyxDQUFDLENBQUM7QUFFdEQsSUFBTSxVQUFVLEdBQUc7SUFDakIsU0FBUyxrQkFBQTtJQUNULFVBQVUscUJBQUE7SUFDVixlQUFlLHVDQUFBO0lBQ2YsUUFBUSxrQkFBQTtJQUNSLFdBQVcscUJBQUE7SUFDWCxZQUFZLHNCQUFBO0lBQ1osU0FBUyxtQkFBQTtDQUNWLENBQUM7QUFFRiw0Q0FLNEI7QUFKMUIsaUdBQUEsUUFBUSxPQUFBO0FBQ1Isb0dBQUEsV0FBVyxPQUFBO0FBQ1gscUdBQUEsWUFBWSxPQUFBO0FBQ1osa0dBQUEsU0FBUyxPQUFBO0FBRVgsMENBQThDO0FBQXJDLGlHQUFBLFNBQVMsT0FBQTtBQUNsQixtREFBc0Q7QUFBN0Msb0dBQUEsVUFBVSxPQUFBO0FBQ25CLDBDQUE0QztBQUFuQywrRkFBQSxPQUFPLE9BQUE7QUFDaEIsa0JBQWUsVUFBVSxDQUFDIn0=