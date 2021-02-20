# shacl-test-as-object
Returns list of SHACL constraints from test suite as resources

## Usage

```ts
import NodeShapesPromise from '@jeswr/shacl-test-as-object';

(async () => {
  const NodeShapes = await NodeShapesPromise;
  for (const shape of NodeShapes) {
    /* Run test operation on shape here */
  }
})();

```

Each of the resolved shapes conforms to the [rdf-object.js](https://github.com/rubensworks/rdf-object.js) `Resource` API.

```ts
import { ProxiedNodeShapes } from '@jeswr/shacl-test-as-object';

(async () => {
  const NodeShapes = await ProxiedNodeShapes;
  for (const shape of NodeShapes) {
    /* Run test operation on shape here */
  }
})();

```

Each of the resolved shapes conforms to the [rdf-object-proxy](https://github.com/jeswr/rdf-object-proxy) `ProxiedResource` API.

For further examples refer the [test suite](https://github.com/jeswr/shacl-test-as-object/blob/main/__tests__/main-tests.ts) for this library.

`getNodeShapes` and `getProxiedNodeShapes` can be used if one wishes to manually supply the path to the manifest file. See the [get test suite](https://github.com/jeswr/shacl-test-as-object/blob/main/__tests__/get-tests.ts) for usage.
