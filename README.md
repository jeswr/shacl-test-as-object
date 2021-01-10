# shacl-test-as-object
Returns list of SHACL constraints from test suite as resources

## Usage

```ts
import NodeShapesPromise from 'shacl-test-as-object';

(async () => {
  const NodeShapes = await NodeShapesPromise;
  for (const shape of NodeShapes) {
    /* Run test operation on shape here */
  }
})();

```

Each of the resolved shapes conforms to the [rdf-object.js](https://github.com/rubensworks/rdf-object.js) `Resource` API.

```ts
import { ProxiedNodeShapes } from 'shacl-test-as-object';

(async () => {
  const NodeShapes = await ProxiedNodeShapes;
  for (const shape of NodeShapes) {
    /* Run test operation on shape here */
  }
})();

```

Each of the resolved shapes conforms to the [rdf-object-proxy](https://github.com/jeswr/rdf-object-proxy) `ProxiedResource` API.

For further examples refer the the [test suite](https://github.com/jeswr/shacl-test-as-object/blob/main/__tests__/main-tests.ts) for this library.
