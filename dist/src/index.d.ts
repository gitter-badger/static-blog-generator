import './a-core';
import './gulp/tasks/clean';
import './gulp/tasks/copy';
import './gulp/tasks/deploy';
import './gulp/tasks/generate';
export { clean_db, clean_posts, clean_public, clean_tmp } from './gulp/tasks/clean';
export { copyAssets } from './gulp/tasks/copy/assets';
export { copyPosts } from './gulp/tasks/copy/posts';
declare const _default: {};
export default _default;
