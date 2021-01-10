import shapes, { ProxiedNodeShapes } from '../lib';

describe('It loads the node shapes', () => {
  it('Should have a first entry that is a NodeShape', async () => {
    const [shape] = await shapes;
    expect(shape.property['rdf:type'].value).toEqual('http://www.w3.org/ns/shacl#NodeShape');
  });
  it('Should have every entry as a NodeShape', async () => {
    for (const shape of await shapes) {
      expect(shape.property['rdf:type'].value).toEqual('http://www.w3.org/ns/shacl#NodeShape');
    }
  });
  it('Should have at least 95 NodeShapes (based on quick estimate)', async () => {
    expect((await shapes).length).toBeGreaterThanOrEqual(95);
  });
});

describe('It loads the proxied node shapes', () => {
  it('Should have a first entry that is a NodeShape', async () => {
    const [shape] = await ProxiedNodeShapes;
    expect(shape['rdf:type'].value).toEqual('http://www.w3.org/ns/shacl#NodeShape');
  });
  it('Should have every entry as a NodeShape', async () => {
    for (const shape of await ProxiedNodeShapes) {
      expect(shape['rdf:type'].value).toEqual('http://www.w3.org/ns/shacl#NodeShape');
    }
  });
  it('Should have at same number of shapes and proxied shapes', async () => {
    expect((await shapes).length).toBeGreaterThanOrEqual((await ProxiedNodeShapes).length);
  });
});
