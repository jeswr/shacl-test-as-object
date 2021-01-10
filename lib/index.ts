import * as fs from 'fs';
import { Parser } from 'n3';
import { RdfObjectLoader, Resource } from 'rdf-object';
import { ProxiedResource, RdfObjectProxy } from 'rdf-object-proxy';

// The JSON-LD context for resolving properties
const context = {
  '@context': {
    '@vocab': 'http://www.w3.org/ns/shacl#',
    rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
    sh$property: 'property',
    mf: 'http://www.w3.org/2001/sw/DataAccess/tests/test-manifest#',
    include: 'mf:include',
    entries: 'mf:entries',
  },
};

// Extracts the quads from a manifest or source file
function manifestPathToQuads(baseIRI: string) {
  let manifestPath = baseIRI.replace(/^file:\/\//, '');
  if (!manifestPath.endsWith('.ttl')) {
    manifestPath += 'manifest.ttl';
  }
  const turtle = fs.readFileSync(manifestPath).toString();
  const quads = new Parser({ baseIRI }).parse(turtle);
  return quads;
}

// Gets each manifest entry
async function getEntries(base: string): Promise<Resource[]> {
  const loader = new RdfObjectLoader({ context });
  const quads = manifestPathToQuads(base);
  await loader.importArray(quads);
  let manifests = [loader.resources[base]];
  let entries: Resource[] = [];
  while (manifests.length > 0) {
    const tempManifestsString = [];
    for (const manifest of manifests) {
      for (const entry of manifest.properties.entries) {
        entries = [...entries, ...(entry.list ?? [])];
      }
      for (const include of manifest.properties.include) {
        const includeString = `${include}`.replace('manifest.ttl', '');
        tempManifestsString.push(includeString);
      }
    }
    const tempManifests = [];
    for (const manifest of tempManifestsString) {
      // eslint-disable-next-line no-await-in-loop
      await loader.importArray(manifestPathToQuads(`${manifest}`));
      tempManifests.push(loader.resources[manifest]);
    }
    manifests = tempManifests;
  }
  // return entries;
  const shapes: Resource[] = [];
  for (const resource in loader.resources) {
    // console.log(loader.resources[resource])
    if (loader.resources[resource].property['http://www.w3.org/1999/02/22-rdf-syntax-ns#type']?.value === 'http://www.w3.org/ns/shacl#NodeShape') {
      shapes.push(loader.resources[resource]);
    }
  }
  return shapes;
}

/**
 * All NodeShapes in the SHACL test suite
 */
const entries = getEntries(`file://${__dirname}/test-shapes/`);
export default entries;

async function getProxiedEntries(input: Promise<Resource[]>): Promise<ProxiedResource<string>[]> {
  return (await input).map((entry) => RdfObjectProxy(entry));
}

export const ProxiedNodeShapes = getProxiedEntries(entries);
