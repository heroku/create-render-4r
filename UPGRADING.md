Upgrading
=========

v1.x -> v2.x
------------

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
