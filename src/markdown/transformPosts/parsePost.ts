import yargs from 'yargs';
import CacheFile from '../../node/cache';
import { cwd, existsSync, read, statSync, write } from '../../node/filemanager';
import { DynamicObject } from '../../types';
import config, { tmp } from '../../types/_config';
import yaml from 'yaml';
import uuidv4 from '../../node/uuid';
import { toUnix } from 'upath';
import ErrorMarkdown from '../error-markdown';
const argv = yargs(process.argv.slice(2)).argv;
const nocache = argv['nocache'];
const homepage = new URL(config.url);
const parseCache = new CacheFile('parsePost');

export type parsePostReturn = DynamicObject & {
  /**
   * Article metadata
   */
  metadataString?: string;
  fileTree?: {
    /**
     * [post source] post file from `src-posts/`
     */
    source?: string;
    /**
     * [public source] post file from source_dir _config.yml
     */
    public?: string;
  };
  /**
   * _config.yml
   */
  config?: typeof config | null;
  /**
   * Article metadata
   */
  metadata?: DynamicObject & {
    /**
     * Article language code
     */
    lang?: string;
    /**
     * Article title
     */
    title: string;
    subtitle: string;
    uuid?: string;
    updated?: string;
    date: string;
    description?: string;
    tags: string[];
    category: string[];
    photos?: string[];
    cover?: string;
    thumbnail?: string;
    /**
     * archive (index, tags, categories)
     */
    type?: 'post' | 'page' | 'archive';
  };
  /**
   * Article body
   */
  body?: string;
};

/**
 * Parse Hexo markdown post (structured with yaml and universal markdown blocks)
 * * return metadata {string & object} and body
 * * return null == failed
 * * no cacheable
 * @param text file path or string markdown contents
 */
export function originalParsePost(text: string, ..._: any[]): parsePostReturn | null {
  const regexPost = /^---([\s\S]*?)---[\n\s\S]\n([\n\s\S]*)/gm;
  //const regex = /^---([\s\S]*?)---[\n\s\S]\n/gim;
  //let m: RegExpExecArray | { [Symbol.replace](string: string, replaceValue: string): string }[];
  /**
   * source file if `text` is file
   */
  const originalArg = text;
  const isFile = existsSync(text) && statSync(text).isFile();
  if (isFile) {
    text = String(read(text));
  }

  const mapper = (m: RegExpMatchArray) => {
    let meta: parsePostReturn['metadata'] = yaml.parse(m[1]);
    let body = m[2];
    if (!body) body = 'no content ' + (meta.title || '');
    //write(tmp('parsePost', 'original.log'), body).then(console.log);
    if (!meta.uuid) {
      // assign uuid
      let uid = m[0];
      if (meta.title && meta.webtitle) {
        uid = meta.title + meta.webtitle;
      } else if (meta.subtitle) {
        uid = meta.subtitle;
      } else if (meta.excerpt) {
        uid = meta.excerpt;
      } else if (meta.title) {
        uid = meta.title;
      }
      meta.uuid = uuidv4(uid);
      meta = Object.keys(meta)
        .sort()
        .reduce(
          (acc, key) => ({
            ...acc,
            [key]: meta[key],
          }),
          {}
        ) as parsePostReturn['metadata'];
    }
    // default category and tags
    if (!meta.category) meta.category = ['Uncategorized'];
    if (!meta.category.length) meta.category.push('Uncategorized');
    if (!meta.tags) meta.tags = [];

    // default date post
    if (!meta.date) meta.date = moment().format();
    if (!meta.updated) {
      if (meta.modified) {
        // fix for hexo-blogger-xml
        meta.updated = meta.modified;
      } else {
        meta.updated = meta.date;
      }
    }

    // default enable comments
    if (typeof meta.comments == 'undefined' || meta.comments == null) meta.comments = true;
    if (!meta.wordcount) meta.wordcount = null;

    // default excerpt/description
    if (meta.subtitle) {
      meta.excerpt = meta.subtitle;
      meta.description = meta.subtitle;
    }
    if (meta.description && !meta.excerpt) {
      meta.subtitle = meta.description;
      meta.excerpt = meta.description;
    }
    if (meta.excerpt && !meta.description) {
      meta.description = meta.excerpt;
      meta.subtitle = meta.excerpt;
    }

    if (isFile) {
      // setup permalink
      homepage.pathname = toUnix(originalArg).replaceArr([cwd(), 'source/_posts/', 'src-posts/', '_posts/'], '/').replace(/\/+/, '/');
      meta.permalink = homepage.pathname;
      homepage.pathname = meta.permalink;
      meta.url = homepage.toString();

      // determine post type
      meta.type = toUnix(originalArg).match(/(_posts|src-posts)\//) ? 'post' : 'page';
    }
    const result: parsePostReturn = {
      metadata: meta,
      body: body,
      content: body,
      config: config,
    };
    // put fileTree
    if (isFile) {
      result.fileTree = {
        source: toUnix(originalArg).replaceArr(['source/_posts/', '_posts/'], 'src-posts/'),
        public: toUnix(originalArg).replace('/src-posts/', '/source/_posts/'),
      };
    }
    return result;
  };

  // process parsing
  const testPost = Array.from(text.matchAll(regexPost)).map(mapper)[0];
  if (typeof testPost == 'object') return testPost;

  const regexPage = /^---([\s\S]*?)---[\n\s\S]([\n\s\S]*)/gm;
  const testPage = Array.from(text.matchAll(regexPage)).map(mapper)[0];
  return testPage;
}

/**
 * generate {@link parsePostReturn.fileTree}
 * @param source
 * @param parsed
 * @returns
 */
function generateFileTree(source: string, parsed: parsePostReturn) {
  if (existsSync(source)) {
    if (parsed)
      parsed.fileTree = {
        source: toUnix(source).replaceArr(['source/_posts/', '_posts/'], 'src-posts/'),
        public: toUnix(source).replaceArr(['src-posts/'], 'source/_posts/'),
      };
  } else {
    //console.log('cannot generate file tree', parsed.metadata.title);
  }
  return parsed;
}

/**
 * Cacheable parsePost
 * @param text file path or content markdown
 * @param hash set cache key if `text` isn't `file path`
 * @see {@link parsePostOri}
 * @returns
 */
export function cacheableParsePost(text: string, hash: string = null) {
  let result: parsePostReturn;
  const key = hash || text;
  if (parseCache.isFileChanged(key) || nocache) {
    // parse changed or no cache
    result = originalParsePost(text);
    //console.log('parse no cache', typeof result);
    parseCache.set(key, result);
  } else {
    // restore cache
    result = parseCache.get(key);
    if (typeof result == 'string') {
      try {
        result = JSON.parse(result);
      } catch (error) {
        const ef = tmp('parsePost.md');
        const em = new ErrorMarkdown({ argument: '```\n' + text + '\n```' });
        em.add('get', '```json\n' + JSON.stringify(result) + '\n```');
        write(ef, em.toString());
        throw new Error('fail parse post ' + ef);
      }
    }
  }

  return generateFileTree(text, result);
}

export const parsePost = cacheableParsePost;
