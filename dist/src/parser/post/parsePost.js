"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parsePost = exports.buildPost = void 0;
var deepmerge_ts_1 = require("deepmerge-ts");
var upath_1 = require("upath");
var src_1 = require("../../../packages/hexo-post-parser/src");
var utils_1 = require("../../gulp/utils");
var cache_1 = require("../../node/cache");
var cache_post_1 = require("../../node/cache-post");
var md5_file_1 = require("../../node/md5-file");
var _config_1 = __importStar(require("../../types/_config"));
var modifyPost_1 = __importDefault(require("./modifyPost"));
// file:../../../packages/hexo-post-parser/src
var parseCache = (0, cache_1.pcache)('parsePost');
var cachePost = new cache_post_1.CachePost();
var __g = (typeof window != 'undefined' ? window : global) /* node */;
/**
 * Parse Markdown Post
 * @see {@link moduleParsePost}
 * @param path file path to read
 * @param content content to parse, skip reading `path` parameter when settled
 * @param options override {@link moduleParsePost} options
 * @returns
 */
var parsePost = function (path, content, options) {
    if (options === void 0) { options = {}; }
    return __awaiter(void 0, void 0, void 0, function () {
        var cacheKey, useCache, get, parse, isPathPost, isTypePost;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cacheKey = (0, md5_file_1.md5)(path);
                    if (typeof path == 'string' && !/\n/.test(path)) {
                        cacheKey = (0, upath_1.toUnix)(path).replace((0, _config_1.cwd)(), '');
                        if (cacheKey.endsWith('/'))
                            cacheKey += 'index';
                    }
                    useCache = _config_1.default.generator.cache;
                    if ('cache' in options) {
                        // overriden cache when `cache` exist in options
                        useCache = options.cache;
                    }
                    // @todo return from cache
                    if (useCache && typeof cacheKey == 'string' && cacheKey.length > 0) {
                        get = parseCache.getSync(cacheKey);
                        if (get)
                            return [2 /*return*/, get];
                    }
                    return [4 /*yield*/, (0, src_1.parsePost)(content || path, (0, deepmerge_ts_1.deepmerge)({
                            shortcodes: {
                                youtube: true,
                                css: true,
                                include: true,
                                link: true,
                                now: true,
                                script: true,
                                text: true,
                                codeblock: true
                            },
                            cache: _config_1.default.generator.cache,
                            config: _config_1.default,
                            formatDate: true,
                            fix: true,
                            sourceFile: path
                        }, options))];
                case 1:
                    parse = _a.sent();
                    if (!parse)
                        return [2 /*return*/, null];
                    /*if (!validateParsed(parse)) {
                      console.log(color.redBright('[fail]'), 'at 1st parse');
                      return null;
                    }*/
                    parse.fileTree = {
                        source: (0, utils_1.replacePath)((0, upath_1.toUnix)(path.toString()), '/source/_posts/', '/src-posts/'),
                        public: (0, utils_1.replacePath)((0, upath_1.toUnix)(path.toString()), '/src-posts/', '/source/_posts/')
                    };
                    parse = (0, modifyPost_1.default)(parse);
                    isPathPost = path.includes(_config_1.default.source_dir + '/_posts');
                    isTypePost = parse.metadata.type === 'post';
                    //const cachedPosts = cachePost.getAll();
                    // @todo indexing post
                    if (isTypePost && isPathPost) {
                        cachePost.set(path, parse);
                    }
                    // @todo caching this parsePost
                    try {
                        parseCache.putSync(cacheKey, parse);
                    }
                    catch (error) {
                        if (error instanceof Error) {
                            //console.log(error.message);
                            console.log('cannot add cache key', cacheKey);
                        }
                    }
                    return [2 /*return*/, parse];
            }
        });
    });
};
exports.parsePost = parsePost;
var src_2 = require("../../../packages/hexo-post-parser/src");
Object.defineProperty(exports, "buildPost", { enumerable: true, get: function () { return src_2.buildPost; } });
exports.default = parsePost;
__g.parsePost = parsePost;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2VQb3N0LmpzIiwic291cmNlUm9vdCI6Ii4vc3JjLyIsInNvdXJjZXMiOlsic3JjL3BhcnNlci9wb3N0L3BhcnNlUG9zdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDZDQUF5QztBQUN6QywrQkFBK0I7QUFDL0IsOERBQStGO0FBQy9GLDBDQUErQztBQUMvQywwQ0FBMEM7QUFDMUMsb0RBQWtEO0FBQ2xELGdEQUEwQztBQUMxQyw2REFBa0Q7QUFDbEQsNERBQXNDO0FBR3RDLDhDQUE4QztBQUU5QyxJQUFNLFVBQVUsR0FBRyxJQUFBLGNBQU0sRUFBQyxXQUFXLENBQUMsQ0FBQztBQUN2QyxJQUFNLFNBQVMsR0FBRyxJQUFJLHNCQUFTLEVBQUUsQ0FBQztBQUNsQyxJQUFNLEdBQUcsR0FBRyxDQUFDLE9BQU8sTUFBTSxJQUFJLFdBQVcsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxVQUFpQixDQUFDO0FBRS9FOzs7Ozs7O0dBT0c7QUFDSCxJQUFNLFNBQVMsR0FBRyxVQUNoQixJQUFZLEVBQ1osT0FBZ0IsRUFDaEIsT0FBZ0U7SUFBaEUsd0JBQUEsRUFBQSxZQUFnRTs7Ozs7O29CQUU1RCxRQUFRLEdBQUcsSUFBQSxjQUFHLEVBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ3pCLElBQUksT0FBTyxJQUFJLElBQUksUUFBUSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRTt3QkFDL0MsUUFBUSxHQUFHLElBQUEsY0FBTSxFQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFBLGFBQUcsR0FBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO3dCQUMzQyxJQUFJLFFBQVEsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDOzRCQUFFLFFBQVEsSUFBSSxPQUFPLENBQUM7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