import Bluebird from 'bluebird';
import moment from 'moment';
import { thumbnail } from '../../ejs/helper/thumbnail';
import { parsePostReturn } from '../../markdown/transformPosts';
import CachePost from '../../node/cache-post';
import { cwd, join, write } from '../../node/filemanager';
import config, { tmp } from '../../types/_config';
import 'js-prototypes';
import { modifyPost } from './copy';
import { renderer } from './generate';
import { TaskCallback } from 'undertaker';
import gulp from 'gulp';
import { excerpt } from '../../ejs/helper/excerpt';

const posts = new CachePost();
const generated_tag_dir = join(cwd(), config.public_dir, config.tag_dir);
const generated_cat_dir = join(cwd(), config.public_dir, config.category_dir);
const homepage = new URL(config.url);
const all = Bluebird.all(posts.getAll());
/** all generated tags dir */
type ArchivePost = {
  cat_dir?: string;
  tag_dir?: string;
  title?: string;
  thumbnail?: string;
  url?: string;
  excerpt?: string;
};

interface Archives {
  [key: string]: ArchivePost[];
}

function generateArchive(done?: TaskCallback) {
  const tag_posts: Archives = {};
  const cat_posts: Archives = {};

  all
    .filter((item) => {
      if (!item) return false;
      if (!item.metadata) return false;
      return true;
    })
    .each((post: parsePostReturn) => {
      if (post.metadata.tags.length) {
        post.metadata.tags.removeEmpties().forEach((tag) => {
          // setup tag dir
          const tag_dir = join(generated_tag_dir, tag);
          const buildPost: ArchivePost = {
            tag_dir: tag_dir,
            title: post.metadata.title,
            thumbnail: thumbnail(post.metadata),
            url: post.metadata.url,
            excerpt: excerpt(post.metadata),
          };

          // initialize index tag if not exist
          if (!tag_posts[tag]) tag_posts[tag] = [];
          // push prevent duplicate object
          if (!tag_posts[tag].find(({ title }) => title === post.metadata.title)) tag_posts[tag].push(buildPost);
        });
      }
      if (post.metadata.category.length) {
        post.metadata.category.removeEmpties().forEach((cat) => {
          // setup tag dir
          const cat_dir = join(generated_cat_dir, cat);
          const buildPost: ArchivePost = {
            cat_dir: cat_dir,
            title: post.metadata.title,
            thumbnail: thumbnail(post.metadata),
            url: post.metadata.url,
            excerpt: excerpt(post.metadata),
          };

          // initialize index tag if not exist
          if (!cat_posts[cat]) cat_posts[cat] = [];
          // push prevent duplicate object
          if (!cat_posts[cat].find(({ title }) => title === post.metadata.title)) cat_posts[cat].push(buildPost);
        });
      }
    })
    .then(() => {
      console.log('total tags', Object.keys(tag_posts).length);
      for (const tagname in tag_posts) {
        if (Object.prototype.hasOwnProperty.call(tag_posts, tagname)) {
          const posts = tag_posts[tagname];
          const tagPermalink = join(generated_tag_dir, tagname, 'index.html');
          homepage.pathname = join(config.tag_dir, 'index.html');

          const opt: parsePostReturn = {
            metadata: {
              title: 'Tag: ' + tagname,
              subtitle: 'Tag: ' + tagname + ' ' + new URL(config.url).host,
              date: moment().format(),
              updated: moment().format(),
              category: [],
              tags: [],
              type: 'archive',
              url: homepage.toString(),
            },
            /** setup sitedata array as json */
            sitedata: JSON.stringifyWithCircularRefs(posts),
            body: '',
            content: '',
            fileTree: {
              source: tagPermalink,
              public: join(tmp(), tagPermalink),
            },
          };
          const mod = modifyPost(opt);
          renderer(mod).then((rendered) => {
            write(tagPermalink, rendered).then((f) => console.log('tag generated', f));
          });
        }
      }
      console.log('total categories', Object.keys(cat_posts).length);
      for (const catname in cat_posts) {
        if (Object.prototype.hasOwnProperty.call(cat_posts, catname)) {
          const posts = cat_posts[catname];
          const catPermalink = join(generated_cat_dir, catname, 'index.html');
          homepage.pathname = join(config.category_dir, 'index.html');

          const opt: parsePostReturn = {
            metadata: {
              title: 'Category: ' + catname,
              subtitle: 'Category: ' + catname + ' ' + new URL(config.url).host,
              date: moment().format(),
              updated: moment().format(),
              category: [],
              tags: [],
              type: 'archive',
              url: homepage.toString(),
            },
            /** setup sitedata array as json */
            sitedata: JSON.stringifyWithCircularRefs(posts),
            body: '',
            content: '',
            fileTree: {
              source: catPermalink,
              public: join(tmp(), catPermalink),
            },
          };
          const mod = modifyPost(opt);
          renderer(mod).then((rendered) => {
            write(catPermalink, rendered).then((f) => console.log('category generated', f));
          });
        }
      }
    })
    .finally(() => done());
}

function generateIndex(done?: TaskCallback) {
  all
    .filter((item) => {
      if (!item) return false;
      if (!item.metadata) return false;
      return true;
    })
    .then((posts) => {
      homepage.pathname = '/index.html';
      const indexPermalink = join(config.public_dir, 'index.html');
      const sitedata = posts.map((post) => {
        const buildPost = { title: post.metadata.title, thumbnail: thumbnail(post.metadata), url: post.metadata.url, excerpt: excerpt(post.metadata) };
        return buildPost;
      });
      const opt: parsePostReturn = {
        metadata: {
          title: 'Homepage',
          subtitle: excerpt(<any>config),
          date: moment().format(),
          updated: moment().format(),
          category: [],
          tags: [],
          type: 'archive',
          url: homepage.toString(),
        },
        /** setup sitedata array as json */
        sitedata: JSON.stringifyWithCircularRefs(sitedata),
        body: '',
        content: '',
        fileTree: {
          source: indexPermalink,
          public: join(tmp(), 'index.html'),
        },
      };
      const mod = modifyPost(opt);
      renderer(mod).then((rendered) => {
        write(indexPermalink, rendered).then((f) => console.log('index generated', f));
      });
    })
    .finally(() => done());
}

gulp.task('generate:index', generateIndex);
gulp.task('generate:archive', gulp.series('generate:index', generateArchive));
