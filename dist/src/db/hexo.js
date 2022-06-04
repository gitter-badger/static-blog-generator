"use strict";
// hexo database manager
Object.defineProperty(exports, "__esModule", { value: true });
exports.HexoDB = void 0;
var fs_1 = require("fs");
var upath_1 = require("upath");
var filemanager_1 = require("../node/filemanager");
var JSON_1 = require("../node/JSON");
var permalink_1 = require("../parser/permalink");
var parsePost_1 = require("../parser/post/parsePost");
var excerpt_1 = require("../renderer/ejs/helper/excerpt");
var thumbnail_1 = require("../renderer/ejs/helper/thumbnail");
var dbpath = (0, upath_1.join)(process.cwd(), 'db.json');
var parse = (0, JSON_1.json_decode)((0, fs_1.existsSync)(dbpath) ? (0, filemanager_1.read)(dbpath).toString() : '{}');
if (!parse.models)
    parse.models = {
        Post: [],
        Tag: [],
        PostTag: [],
        PostCategory: [],
        Asset: [],
        Page: [],
        Cache: [],
        Category: [],
        PostAsset: [],
        Data: []
    };
var HexoDB = /** @class */ (function () {
    function HexoDB() {
    }
    HexoDB.prototype.addPost = function (obj) {
        var perm = (0, permalink_1.parsePermalink)(obj);
        var post = {
            title: obj.metadata.title,
            date: String(obj.metadata.date || new Date()),
            _content: obj.body || obj.content || '',
            source: '',
            raw: (0, parsePost_1.buildPost)(obj),
            //__permalink: perm,
            slug: (0, upath_1.basename)(perm).replace(/.(md|html)$/, ''),
            published: 'draft' in obj.metadata ? (obj.metadata.draft ? 1 : 0) : 1,
            updated: String(obj.metadata.updated || obj.metadata.date || new Date()),
            comments: 'comments' in obj.metadata ? (obj.metadata.comments ? 1 : 0) : 1,
            layout: obj.metadata.type || '',
            photos: [],
            link: '',
            _id: '',
            content: obj.body || obj.content || '',
            site: undefined,
            cover: (0, thumbnail_1.thumbnail)(obj.metadata),
            excerpt: (0, excerpt_1.excerpt)(obj.metadata),
            more: ''
        };
        if (!parse.models.Post.find(function (epost) {
            return epost.title === post.title;
        })) {
            parse.models.Post.push(post);
        }
    };
    HexoDB.prototype.get = function () {
        return parse;
    };
    HexoDB.prototype.save = function () {
        (0, filemanager_1.write)(dbpath, (0, JSON_1.json_encode)(parse, 2));
    };
    /**
     * dump
     */
    HexoDB.prototype.simplify = function () {
        return parse.models.Post.map(function (post) {
            post._content = '';
            post.content = '';
            post.raw = '';
        });
    };
    return HexoDB;
}());
exports.HexoDB = HexoDB;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGV4by5qcyIsInNvdXJjZVJvb3QiOiIuL3NyYy8iLCJzb3VyY2VzIjpbInNyYy9kYi9oZXhvLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSx3QkFBd0I7OztBQUV4Qix5QkFBZ0M7QUFDaEMsK0JBQXVDO0FBQ3ZDLG1EQUFrRDtBQUNsRCxxQ0FBd0Q7QUFDeEQsaURBQXFEO0FBQ3JELHNEQUE4RDtBQUM5RCwwREFBeUQ7QUFDekQsOERBQTZEO0FBRzdELElBQU0sTUFBTSxHQUFHLElBQUEsWUFBSSxFQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsRUFBRSxTQUFTLENBQUMsQ0FBQztBQUM5QyxJQUFNLEtBQUssR0FBRyxJQUFBLGtCQUFXLEVBQ3ZCLElBQUEsZUFBVSxFQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFBLGtCQUFJLEVBQUMsTUFBTSxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FDcEQsQ0FBQztBQUNGLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTTtJQUNmLEtBQUssQ0FBQyxNQUFNLEdBQUc7UUFDYixJQUFJLEVBQUUsRUFBRTtRQUNSLEdBQUcsRUFBRSxFQUFFO1FBQ1AsT0FBTyxFQUFFLEVBQUU7UUFDWCxZQUFZLEVBQUUsRUFBRTtRQUNoQixLQUFLLEVBQUUsRUFBRTtRQUNULElBQUksRUFBRSxFQUFFO1FBQ1IsS0FBSyxFQUFFLEVBQUU7UUFDVCxRQUFRLEVBQUUsRUFBRTtRQUNaLFNBQVMsRUFBRSxFQUFFO1FBQ2IsSUFBSSxFQUFFLEVBQUU7S0FDVCxDQUFDO0FBRUo7SUFBQTtJQWlEQSxDQUFDO0lBaERDLHdCQUFPLEdBQVAsVUFBUSxHQUFZO1FBQ2xCLElBQU0sSUFBSSxHQUFHLElBQUEsMEJBQWMsRUFBQyxHQUFHLENBQUMsQ0FBQztRQUNqQyxJQUFNLElBQUksR0FBa0I7WUFDMUIsS0FBSyxFQUFFLEdBQUcsQ0FBQyxRQUFRLENBQUMsS0FBSztZQUN6QixJQUFJLEVBQUUsTUFBTSxD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