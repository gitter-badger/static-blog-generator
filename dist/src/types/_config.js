"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.project_config = exports.theme_config = exports.theme_yml = exports.theme_dir = exports.tmp = exports.post_source_dir = exports.post_generated_dir = exports.post_public_dir = exports.verbose = exports.default_project_config = exports.root = exports.cwd = exports.argv = void 0;
var deepmerge_ts_1 = require("deepmerge-ts");
var fs_1 = require("fs");
var memoizee_1 = __importDefault(require("memoizee"));
var upath_1 = require("upath");
var yaml_1 = __importDefault(require("yaml"));
var yargs_1 = __importDefault(require("yargs"));
var cache_1 = require("../node/cache");
var filemanager_1 = require("../node/filemanager");
var JSON_1 = require("../node/JSON");
var _config_default_1 = __importDefault(require("./_config.default"));
var _config_theme_json_1 = __importDefault(require("./_config_theme.json"));
/**
 * Argument CLI reader
 */
exports.argv = (0, yargs_1.default)(process.argv.slice(2)).argv;
/**
 * process cwd unix style
 */
var root = (0, upath_1.toUnix)(process.cwd());
exports.root = root;
exports.cwd = (0, memoizee_1.default)(function () { return (0, upath_1.toUnix)(process.cwd()); });
var file = (0, upath_1.join)(root, '_config.yml');
if (!(0, fs_1.existsSync)(file)) {
    exports.root = root = (0, upath_1.join)(__dirname, '../..');
    file = (0, upath_1.join)(root, '_config.yml');
}
var readConfig = (0, fs_1.readFileSync)(file, 'utf-8');
/** default project config */
exports.default_project_config = (0, deepmerge_ts_1.deepmerge)(_config_default_1.default, {
    verbose: false,
    exclude: [],
    include: [],
    skip_render: [],
    ignore: [],
    adsense: {
        article_ads: []
    },
    firebase: {
        apiKey: null,
        authDomain: null,
        projectId: null,
        storageBucket: null,
        messagingSenderId: null,
        appId: null,
        measurementId: null
    },
    ngrok: {
        token: null
    },
    generator: {
        cache: true
    }
});
var project_config_merge = Object.assign(exports.default_project_config, yaml_1.default.parse(readConfig));
if (project_config_merge.adsense.enable) {
    var findads = function (path) {
        var findpath = (0, upath_1.join)((0, exports.cwd)(), path);
        if (!(0, fs_1.existsSync)(findpath)) {
            findpath = (0, upath_1.join)(root, path);
        }
        if ((0, fs_1.existsSync)(findpath))
            return String((0, filemanager_1.read)(findpath));
    };
    if (project_config_merge.adsense.article_ads.length) {
        project_config_merge.adsense.article_ads =
            project_config_merge.adsense.article_ads.map(findads);
    }
    if (project_config_merge.adsense.multiplex_ads.length) {
        project_config_merge.adsense.multiplex_ads =
            project_config_merge.adsense.multiplex_ads.map(findads);
    }
}
var config = project_config_merge;
// @todo [config] bypass nocache if --nocache argument is set by cli
if (exports.argv['nocache'])
    config.generator.cache = false;
// @todo [config] bypass verbose if --verbose argument is set by cli
if (exports.argv['verbose'])
    config.verbose = true;
/**
 * is verbose activated?
 */
exports.verbose = config.verbose;
config.url = config.url.replace(/\/+$/, '');
/**
 * Public Source Post Dir ({@link config.source_dir})
 */
exports.post_public_dir = (0, upath_1.resolve)((0, upath_1.join)(root, config.source_dir, '_posts'));
/**
 * Generated directory ({@link config.public_dir})
 */
exports.post_generated_dir = (0, upath_1.resolve)((0, upath_1.join)(root, config.public_dir));
/**
 * `src-posts/` directory
 */
exports.post_source_dir = (0, upath_1.resolve)((0, upath_1.join)(root, 'src-posts'));
var pc = (0, cache_1.pcache)('tmp');
/**
 * path to temp folder
 * * cacheable
 * @param path file path inside temp folder
 * @returns
 */
var tmp = function () {
    var path = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        path[_i] = arguments[_i];
    }
    var key = String(path);
    var get = pc.getSync(key);
    if (get)
        return get;
    var result = (0, upath_1.join)(root, 'tmp', path.filter(function (s) { return s; }).join('/'));
    pc.putSync(key, result);
    return result;
};
exports.tmp = tmp;
if (!(0, fs_1.existsSync)((0, exports.tmp)()))
    (0, fs_1.mkdirSync)((0, exports.tmp)());
/** THEME CONFIGS */
/** theme directory */
exports.theme_dir = (0, upath_1.toUnix)((0, upath_1.resolve)((0, upath_1.join)(root, 'themes', config.theme)));
/** _config.yml object from theme directory */
exports.theme_yml = (0, upath_1.join)(exports.theme_dir, '_config.yml');
/** merged theme config object */
exports.theme_config = Object.assign(_config_theme_json_1.default, (0, fs_1.existsSync)(exports.theme_yml) ? yaml_1.default.parse((0, fs_1.readFileSync)(exports.theme_yml, 'utf-8')) : {});
/** WRITE AUTO GENERATED CONFIGS */
(0, filemanager_1.write)((0, upath_1.join)(__dirname, '_config_project.json'), (0, JSON_1.json_encode)(config));
(0, filemanager_1.write)((0, upath_1.join)(__dirname, '_config_theme.json'), (0, JSON_1.json_encode)(exports.theme_config));
/** SETUP PRIVATE CONFIGS */
var file_private_config = (0, upath_1.join)(root, '_config.private.yml');
if ((0, fs_1.existsSync)(file_private_config)) {
    var privateConfig = yaml_1.default.parse((0, fs_1.readFileSync)(file_private_config, 'utf-8'));
    if (Object.hasOwnProperty.call(privateConfig, 'firebase')) {
        config.firebase = privateConfig.firebase;
    }
}
config.root = root;
config.tmp = exports.tmp;
/** EXPORT PRIVATE AND PUBLIC CONFIGS */
exports.default = config;
exports.project_config = config;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiX2NvbmZpZy5qcyIsInNvdXJjZVJvb3QiOiIuL3NyYy8iLCJzb3VyY2VzIjpbInNyYy90eXBlcy9fY29uZmlnLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLDZDQUF5QztBQUV6Qyx5QkFBeUQ7QUFDekQsc0RBQWdDO0FBRWhDLCtCQUE4QztBQUM5Qyw4Q0FBd0I7QUFDeEIsZ0RBQTBCO0FBQzFCLHVDQUF1QztBQUN2QyxtREFBa0Q7QUFDbEQscUNBQTJDO0FBQzNDLHNFQUErQztBQUUvQyw0RUFBcUQ7QUFFckQ7O0dBRUc7QUFDVSxRQUFBLElBQUksR0FBRyxJQUFBLGVBQUssRUFBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztBQUV0RDs7R0FFRztBQUNILElBQUksSUFBSSxHQUFHLElBQUEsY0FBTSxFQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO0FBT3hCLG9CQUFJO0FBTkEsUUFBQSxHQUFHLEdBQUcsSUFBQSxrQkFBUSxFQUFDLGNBQU0sT0FBQSxJQUFBLGNBQU0sRUFBQyxPQUFPLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBckIsQ0FBcUIsQ0FBQyxDQUFDO0FBQ3pELElBQUksSUFBSSxHQUFHLElBQUEsWUFBSSxFQUFDLElBQUksRUFBRSxhQUFhLENBQUMsQ0FBQztBQUNyQyxJQUFJLENBQUMsSUFBQSxlQUFVLEVBQUMsSUFBSSxDQUFDLEVBQUU7SUFDckIsZUFBQSxJQUFJLEdBQUcsSUFBQSxZQUFJLEVBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ2hDLElBQUksR0FBRyxJQUFBLFlBQUksRUFBQyxJQUFJLEVBQUUsYUFBYSxDQUFDLENBQUM7Q0FDbEM7QUFFRCxJQUFNLFVBQVUsR0FBRyxJQUFBLGlCQUFZLEVBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQy9DLDZCQUE2QjtBQUNoQixRQUFBLHNCQUFzQixHQUFHLElBQUEsd0JB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