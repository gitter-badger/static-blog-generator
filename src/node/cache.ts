import chalk from 'chalk';
import { root } from '../types/_config';
import { existsSync, join, mkdirSync, readFileSync, write } from './filemanager';
import logger from './logger';
import { md5FileSync, md5FileSync as md5 } from './md5-file';
import scheduler from './scheduler';

interface Objek {
  [key: string]: any;
}
const buildFolder = join(root, 'databases');

/**
 * @summary IN FILE CACHE.
 * @description Save cache to file (not in-memory), cache will be restored on next process restart.
 */
export default class CacheFile {
  md5Cache: Objek = {};
  dbFile: string;
  private currentHash: string;
  constructor(hash = null, verbose = false) {
    this.currentHash = hash;
    logger.active = verbose;
    if (!hash) {
      const stack = new Error().stack.split('at')[2];
      hash = md5(stack);
    }
    if (!existsSync(buildFolder)) mkdirSync(buildFolder);
    this.dbFile = join(buildFolder, 'db-' + hash + '.json');
    let db = existsSync(this.dbFile) ? readFileSync(this.dbFile, 'utf-8') : {};
    if (typeof db != 'object') {
      try {
        db = JSON.parse(db.toString());
      } catch (e) {
        logger.error('cache database lost');
        logger.error(e);
      }
    }
    if (typeof db == 'object') {
      this.md5Cache = db;
    }
  }
  setCache = (key: string, value: any) => this.set(key, value);
  resolveKey(key: string) {
    if (key.length > 32) return key.substring(0, 32);
    return key;
  }
  set(key: string, value: any) {
    key = this.resolveKey(key);
    this.md5Cache[key] = value;
    // save cache on process exit
    scheduler.add('writeCacheFile-' + this.currentHash, () => {
      logger.log(chalk.magentaBright(this.currentHash), 'saved cache', this.dbFile);
      write(this.dbFile, JSON.stringify(this.md5Cache));
    });
  }
  has(key: string): boolean {
    key = this.resolveKey(key);
    return typeof this.md5Cache[key] !== undefined;
  }
  /**
   * Get cache by key
   * @param key
   * @param fallback
   * @returns
   */
  get(key: string, fallback = null) {
    key = this.resolveKey(key);
    const Get = this.md5Cache[key];
    if (Get === undefined) return fallback;
    return Get;
  }
  getCache = (key: string, fallback = null) => this.get(key, fallback);
  /**
   * Check file is changed with md5 algorithm
   * @param path0
   * @returns
   */
  isFileChanged(path0: string): boolean {
    if (typeof path0 != 'string') {
      //console.log("", typeof path0, path0);
      return true;
    }
    try {
      // get md5 hash from path0
      const pathMd5 = md5FileSync(path0);
      // get index hash
      const savedMd5 = this.md5Cache[path0 + '-hash'];
      const result = savedMd5 != pathMd5;
      if (result) {
        // set, if file hash is not found
        this.md5Cache[path0 + '-hash'] = pathMd5;
      }
      return result;
    } catch (e) {
      return true;
    }
  }
}
