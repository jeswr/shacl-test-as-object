/* eslint-disable no-empty */
import fs from 'fs';
import path from 'path';
import { JsonLdSerializer } from 'jsonld-streaming-serializer';
import dataFactory from '@rdfjs/data-model';
import md5 from 'md5';
import entries from '../packages/shacl-test-as-object/lib';

const base = path.join(__dirname, '..', 'packages', 'shacl-test-as-object-browser', 'lib', 'test-shapes-jsonld');

try {
  fs.rmSync(base, { recursive: true });
} catch (e) {}

fs.mkdirSync(base);

const index: Record<string, string> = {};

entries.then((resources) => {
  resources.forEach((resource) => {
    const justName = `${/[a-z0-9]+$/i.exec(resource.value)?.[0] ?? ''}-${md5(resource.value)}.json`;
    const name = path.join(base, justName);
    index[resource.value] = justName;
    const writeStream = fs.createWriteStream(name);
    const mySerializer = new JsonLdSerializer({ space: '  ', context: {} });
    mySerializer.on('data', (data) => { writeStream.write(data); });
    mySerializer.on('end', () => {
      writeStream.end();
      writeStream.close();
    });
    mySerializer.on('error', () => { console.log('error'); });
    resource.toQuads([], dataFactory).forEach((q) => mySerializer.write(q));
    mySerializer.end();
    writeStream.on('close', () => {
      // try {
      //   // eslint-disable-next-line import/no-dynamic-require, global-require
      //   require(name);
      // } catch (e) {
      //   console.log(`error emitting${name}`);
      //   try {
      //     fs.rmSync(name);
      //   } catch (err) {}
      // }
    });
  });
}).then(() => {
  fs.writeFileSync(path.join(base, 'index.json'), JSON.stringify(index, null, 2));
});
