import { arrayFactory } from '@on2ts/ontologies-utils';
import { Resource } from 'rdf-object';
import { RdfObjectLoader } from 'rdf-object';
import { ProxiedResource, RdfObjectProxy } from 'rdf-object-proxy';
import index from './test-shapes-jsonld/index.json';
import indexInferenced from './test-shapes-inferenced-jsonld/index.json';

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

export async function getEntries(location: string, idx: { [key: string]: string }) {
  let entries: Resource[] = [];
  for (const key in idx) {
    const loader = new RdfObjectLoader({ context });
    await loader.importArray(await arrayFactory(require(`./${location}/${idx[key]}`))());
    entries.push(loader.resources[key]);
  }
  return entries
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
 const entries = getEntries('test-shapes-jsonld', index);
 export const inferencedEntries = getEntries('test-shapes-inferenced-jsonld', indexInferenced);
 
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
 