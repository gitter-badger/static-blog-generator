import { existsSync, writeFileSync } from 'fs';
import gulp from 'gulp';
import { join } from 'upath';
import { localServer } from './gulp/server';
import {
  clean_db,
  clean_posts,
  clean_public,
  clean_tmp
} from './gulp/tasks/clean';
import { copyPosts } from './gulp/tasks/copy';
import { copyAssets } from './gulp/tasks/copy/assets';
import { gulpInlineStyle } from './gulp/tasks/copy/remove-inline-style';
import './gulp/tasks/deploy';
import './gulp/tasks/generate';
import scheduler from './node/scheduler';

// generate empty config if not exists
[
  join(__dirname, 'types/_config_project.json'),
  join(__dirname, 'types/_config_theme.json'),
  join(__dirname, 'types/_config_hashes.json')
].forEach((path) => {
  if (!existsSync(path)) {
    writeFileSync(path, '{}');
  }
});

// declare require types
declare function require<T>(name: string): T;

// register scheduler
new scheduler();

/**
 * @see {@link https://stackoverflow.com/a/67394338/6404439}
 */
process.on('uncaughtException', function (err) {
  console.error('uncaughtException:\n' + err.stack + '\n');
});

// DEVELOPMENT TASKS
require(join(__dirname, 'gulp/tasks/dump'));

// COPY TASKS
gulp.task('copy:assets', () => copyAssets());
gulp.task('copy:posts', () => copyPosts());
gulp.task('copy:remove-inline-style', () => gulpInlineStyle());
gulp.task('copy', gulp.series('copy:assets', 'copy:posts'));
gulp.task('copy:blogger', gulp.series('copy', 'copy:remove-inline-style'));

// LOCAL SERVER
gulp.task('server', localServer);
gulp.task('serve', gulp.series('server'));

// CLEAN TASKS
gulp.task('clean:public', clean_public);
gulp.task('clean:posts', clean_posts);
gulp.task('clean:db', clean_db);
gulp.task('clean:tmp', clean_tmp);
gulp.task(
  'clean',
  gulp.parallel('clean:db', 'clean:tmp', 'clean:posts', 'clean:public')
);

// DEFAULT TASK
gulp.task('default', gulp.series('copy', 'generate'));

const properties = {
  copyPosts,
  copyAssets,
  gulpInlineStyle,
  clean_db,
  clean_posts,
  clean_public,
  clean_tmp
};

export {
  clean_db,
  clean_posts,
  clean_public,
  clean_tmp
} from './gulp/tasks/clean';
export { copyPosts } from './gulp/tasks/copy';
export { copyAssets } from './gulp/tasks/copy/assets';

export default properties;
