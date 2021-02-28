# shacl-test-as-object
Returns list of SHACL constraints from test suite as resources

[![GitHub license](https://img.shields.io/github/license/jeswr/shacl-test-as-object.svg)](https://github.com/jeswr/shacl-test-as-object/blob/master/LICENSE)
[![npm version](https://img.shields.io/npm/v/shacl-test-as-object.svg)](https://www.npmjs.com/package/shacl-test-as-object)
[![build](https://img.shields.io/github/workflow/status/jeswr/shacl-test-as-object/Node.js%20CI)](https://github.com/jeswr/shacl-test-as-object/tree/main/)
[![Dependabot](https://badgen.net/badge/Dependabot/enabled/green?icon=dependabot)](https://dependabot.com/)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

## Usage

```ts
import NodeShapesPromise, { NodeShapesMapPromise } from 'shacl-test-as-object';

(async () => {
  const NodeShapes = await NodeShapesPromise;
  const NodeShapesMap = await NodeShapesMapPromise;
  for (const shape of NodeShapes) {
    /* Run test operation on shape here */
  }
  
  const shape = NodeShapesMap['http://datashapes.org/sh/tests/core/complex/personexample.test#PersonShape']
  /* Run test operation on specific shape */
})();

```

Each of the resolved shapes conforms to the [rdf-object.js](https://github.com/rubensworks/rdf-object.js) `Resource` API.

```ts
import { ProxiedNodeShapes, ProxiedNodeShapesMapPromise } from 'shacl-test-as-object';

(async () => {
  const NodeShapes = await ProxiedNodeShapes;
  const NodeShapesMap = await ProxiedNodeShapesMapPromise;
  for (const shape of NodeShapes) {
    /* Run test operation on shape here */
  }
  
  const shape = NodeShapesMap['http://datashapes.org/sh/tests/core/complex/personexample.test#PersonShape']
  /* Run test operation on specific shape */
})();

```

Each of the resolved shapes conforms to the [rdf-object-proxy](https://github.com/jeswr/rdf-object-proxy) `ProxiedResource` API.

For further examples refer the [test suite](https://github.com/jeswr/shacl-test-as-object/blob/main/__tests__/main-tests.ts) for this library.

`getNodeShapes` and `getProxiedNodeShapes` can be used if one wishes to manually supply the path to the manifest file. See the [get test suite](https://github.com/jeswr/shacl-test-as-object/blob/main/__tests__/get-tests.ts) for usage.

## Inferenced Shapes

Inferenced versions of these objects are also exposed. Inferencing is performed using [sparql-inferenced](https://github.com/jeswr/sparql-inferenced) over the SHACL ontology, and these [specific shacl inferences](https://github.com/on2ts/construct-inferences-shacl).

The inferenced shapes can be accessed similarly to the other objects

```ts
import { InferencedProxiedNodeShapes, InferencedProxiedNodeShapesMapPromise } from 'shacl-test-as-object';

(async () => {
  const NodeShapes = await InferencedProxiedNodeShapes;
  const NodeShapesMap = await InferencedProxiedNodeShapesMapPromise;
  for (const shape of NodeShapes) {
    /* Run test operation on shape here */
  }
  
  const shape = NodeShapesMap['http://datashapes.org/sh/tests/core/complex/personexample.test#PersonShape']
  /* Run test operation on specific shape */
})();

```

## License
©2021–present
[Jesse Wright](https://github.com/jeswr),
[MIT License](https://github.com/jeswr/shacl-test-as-object/blob/master/LICENSE).

