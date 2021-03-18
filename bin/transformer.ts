/* eslint-disable no-empty */
import fs from 'fs';
import path from 'path';
import { JsonLdSerializer } from 'jsonld-streaming-serializer';
import { quad } from '@rdfjs/data-model';
import entries from '../lib';
import { Quad } from 'n3';

const base = path.join(__dirname, '..', 'test-shapes-jsonld');

try {
  fs.rmSync(base, { recursive: true });
} catch (e) {}

fs.mkdirSync(base);

entries.then((resources) => {
  resources.forEach(async (resource) => {
    try {
      const writeStream = fs.createWriteStream(
        path.join(base, `${/[a-z]+$/i.exec(resource.value)?.[0] ?? ''}.jsonld`),
      );
      const mySerializer = new JsonLdSerializer({ space: '  ' });
      mySerializer.on('data', (data) => { writeStream.write(data); });
      mySerializer.on('end', () => { writeStream.end(); });
      mySerializer.on('error', () => {
        console.log('error');
      });
      const quads = resource.toQuads().map(
        // TODO [FUTURE]: Remove type casting
        (b) => quad(b.subject as any, b.predicate as any, b.object as any),
        // TODO [FUTURE]: REMOVE ANY
      ).filter((q: any) => q.graph.termType !== undefined);
      // console.log(quads);
      mySerializer.write(quads);
      mySerializer.end();
    } catch (e) {
      console.log('error');
    }
  });
});
