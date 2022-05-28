import GulpClient from 'gulp';
import '../../src/gulp/tasks/generate-archives';
import measurement from '../../src/node/measure-timing';
const measure = new measurement();
measure.start();
GulpClient.series('generate:label')(() => console.log(measure.end()));
