"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var gulp_1 = __importDefault(require("gulp"));
var _config_1 = __importDefault(require("../../../types/_config"));
require("./firebase");
var firebase_1 = require("./firebase");
var git_1 = require("./git");
gulp_1.default.task('deploy-git', git_1.deployerGit);
gulp_1.default.task('deploy-firebase', firebase_1.deployFirebase);
if ('deploy' in _config_1.default &&
    typeof _config_1.default.deploy == 'object' &&
    'type' in _config_1.default.deploy) {
    gulp_1.default.task('deploy', gulp_1.default.series('deploy-' + _config_1.default['deploy']['type']));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiLi9zcmMvIiwic291cmNlcyI6WyJzcmMvZ3VscC90YXNrcy9kZXBsb3kvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSw4Q0FBd0I7QUFDeEIsbUVBQTRDO0FBQzVDLHNCQUFvQjtBQUNwQix1Q0FBNEM7QUFDNUMsNkJBQW9DO0FBRXBDLGNBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLGlCQUFXLENBQUMsQ0FBQztBQUNyQyxjQUFJLENBQUMsSUFBSSxDQUFDLGlCQUFpQixFQUFFLHlCQUFjLENBQUMsQ0FBQztBQUU3QyxJQUNFLFFBQVEsSUFBSSxpQkFBTTtJQUNsQixPQUFPLGlCQUFNLENBQUMsTUFBTSxJQUFJLFFBQVE7SUFDaEMsTUFBTSxJQUFJLGlCQUFNLENBQUMsTUFBTSxFQUN2QjtJQUNBLGNBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLGNBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxHQUFHLGlCQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO0NBQ3hFIn0=