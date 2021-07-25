import path from 'path';
import { getNodeShapes, getProxiedNodeShapes } from '../lib';

jest.useFakeTimers();

describe('It loads the node shapes', () => {
  it('Should have a first entry that is a NodeShape', async () => {
    const [shape] = await getNodeShapes(`file://${path.join(__dirname)}/test-shapes/`);
    expect(shape.property['rdf:type'].value).toEqual('http://www.w3.org/ns/shacl#NodeShape');
    expect(`${shape.property['rdf:type']}`).toEqual('http://www.w3.org/ns/shacl#NodeShape');
  });
  it('Should have every entry as a NodeShape', async () => {
    const shapes = getNodeShapes(`file://${path.join(__dirname)}/test-shapes/`);
    for (const shape of await shapes) {
      expect(shape.property['rdf:type'].value).toEqual('http://www.w3.org/ns/shacl#NodeShape');
      expect(`${shape.property['rdf:type']}`).toEqual('http://www.w3.org/ns/shacl#NodeShape');
    }
  });
  it('Should have at least 95 NodeShapes (based on quick estimate)', async () => {
    const shapes = getNodeShapes(`file://${path.join(__dirname)}/test-shapes/`);
    expect((await shapes).length).toBeGreaterThanOrEqual(95);
  });
});

describe('It loads the proxied node shapes', () => {
  it('Should have a first entry that is a NodeShape', async () => {
    const [shape] = await getProxiedNodeShapes(getNodeShapes(`file://${path.join(__dirname)}/test-shapes/`));
    expect(shape['rdf:type'].value).toEqual('http://www.w3.org/ns/shacl#NodeShape');
    expect(`${shape['rdf:type']}`).toEqual('http://www.w3.org/ns/shacl#NodeShape');
  });
  it('Should have every entry as a NodeShape', async () => {
    const ProxiedNodeShapes = getProxiedNodeShapes(getNodeShapes(`file://${path.join(__dirname)}/test-shapes/`));
    for (const shape of await ProxiedNodeShapes) {
      expect(shape['rdf:type'].value).toEqual('http://www.w3.org/ns/shacl#NodeShape');
      expect(`${shape['rdf:type']}`).toEqual('http://www.w3.org/ns/shacl#NodeShape');
    }
  });
  it('Should have at same number of shapes and proxied shapes', async () => {
    const shapes = getNodeShapes(`file://${path.join(__dirname)}/test-shapes/`);
    const ProxiedNodeShapes = getProxiedNodeShapes(getNodeShapes(`file://${path.join(__dirname)}/test-shapes/`));
    expect((await shapes).length).toBeGreaterThanOrEqual((await ProxiedNodeShapes).length);
  });
});
