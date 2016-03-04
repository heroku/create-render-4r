Upgrading
=========

v2.x -> v3.x
------------

### Move React+ to `peerDependencies`

Avoids bugs with singleton modules like `react-document-meta`.

#### v2.x

Only the dependency on this module was required.

`package.json`
```javascript
{
  "dependencies": {
    "create-render-4r": "^2.0.0",
  }
}
```

#### v3.x

Universal/React dependencies must be specified, so that they are installed in production.

`package.json`
```javascript
{
  "dependencies": {
    "create-render-4r": "^3.0.0",
    "radium": "^0.15.3",
    "react": "^0.14.6",
    "react-document-meta": "^2.0.0",
    "react-dom": "^0.14.6",
    "react-redux": "^4.0.6",
    "react-router": "^1.0.0",
    "redux": "^3.0.6"
  }
}
```

### `createStore` renamed to `loadStore`

#### v1.x

```javascript
var createStore = require('./my-create-store');

var render4r = createRender4r({
  createStore:  createStore,
  // …
});
```

#### v2.x

```javascript
var loadStore = require('./my-load-store');

var render4r = createRender4r({
  loadStore:    loadStore,
  // …
});
```


v1
--
Initial Release
