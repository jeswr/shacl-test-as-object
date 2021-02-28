import * as fs from 'fs';
import { Parser, Quad, Store } from 'n3';
import inferencer from 'sparql-inferenced';
import { owl2rl } from 'hylar-core';
import constructs from 'construct-inferences-shacl';
import { RdfObjectLoader, Resource } from 'rdf-object';
import { ProxiedResource, RdfObjectProxy } from 'rdf-object-proxy';
import { array } from '@on2ts/ontologies-sh';
import path from 'path';

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
  try {
    const turtle = fs.readFileSync(manifestPath).toString();
    const quads = new Parser({ baseIRI }).parse(turtle);
    return quads;
  } catch (e) {
    return [];
  }
}

async function inferenceConstraint(quads: Quad[]) {
  const implicit = new Store();
  const explicit = new Store();
  await inferencer(
    [...(await array()), ...quads],
    [],
    explicit,
    implicit,
    owl2rl,
    constructs,
  );
  return [
    ...implicit.getQuads(null, null, null, null),
    ...explicit.getQuads(null, null, null, null),
  ];
}

// Gets each manifest entry
async function getEntries(base: string, inference = false): Promise<Resource[]> {
  const loader = new RdfObjectLoader({ context });
  let quads = manifestPathToQuads(base);
  if (inference) {
    quads = await inferenceConstraint(quads);
  }
  await loader.importArray(quads);
  let manifests = [loader.resources[base]];
  let entries: Resource[] = [];
  while (manifests.length > 0) {
    const tempManifestsString = [];
    for (const manifest of manifests) {
      if (manifest) {
        for (const entry of manifest.properties.entries) {
          entries = [...entries, ...(entry.list ?? [])];
        }
        for (const include of manifest.properties.include) {
          const includeString = `${include}`.replace('manifest.ttl', '');
          tempManifestsString.push(includeString);
        }
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
 * Coverts an array of shapes to a map of shapes
 */
export function toMap<
  T extends Resource | ProxiedResource<string>
>(arr: T[]): Record<string, T> {
  const record: Record<string, T> = {};
  for (const elem of arr) {
    record[elem.term.value] = elem;
  }
  return record;
}

/**
 * All NodeShapes in the SHACL (https://www.w3.org/ns/shacl#) test suite
 */
const entries = getEntries(`file://${path.join(__dirname, '..')}/test-shapes/`);
export const inferencedEntries = getEntries(`file://${path.join(__dirname, '..')}/test-shapes/`, true);

export default entries;
export const NodeShapesMapPromise = (async () => toMap(await entries))();
export const InferencedNodeShapesMapPromise = (async () => toMap(await inferencedEntries))();

async function getProxiedEntries(input: Promise<Resource[]>): Promise<ProxiedResource<string>[]> {
  return (await input).map((entry) => RdfObjectProxy(entry));
}

export const ProxiedNodeShapes = getProxiedEntries(entries);
export const ProxiedNodeShapesMapPromise = (async () => toMap(await ProxiedNodeShapes))();

export const InferencedProxiedNodeShapes = getProxiedEntries(inferencedEntries);
export const InferencedProxiedNodeShapesMapPromise = (
  async () => toMap(await InferencedProxiedNodeShapes)
)();

export const getNodeShapes = getEntries;
export const getProxiedNodeShapes = getProxiedEntries;
