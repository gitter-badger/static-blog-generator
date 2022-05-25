import { write } from '../../node/filemanager';
import { tmp } from '../../types/_config';
import generateTags from './generate-tags';

(async () => {
  const test1 = await generateTags('Blogging', 4);
  if (test1) write(tmp('tags/Blogging-4.html'), test1);
})();
