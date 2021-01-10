import shapes from '../lib';

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
