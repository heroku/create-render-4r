import test from 'ava';
import createRender4r, { actions, reducers } from '..';

import {
  routes,
  layoutHtml,
  createLoadStoreWithMockSagas,
  exampleSaga } from './apps/with-sagas';

function buildContext(t, cb) {
  if (typeof cb !== 'function') {
    throw new Error('buildContext() requires `cb` argument, a callback');
  }

  const c = t.context;

  // Mock up Express handler params
  c.request = {
    protocol: 'http',
    headers: {
      host: 'example.com',
      'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/601.4.4 (KHTML, like Gecko) Version/9.0.3 Safari/601.4.4'
    }
  };
  c.response = {
    statusCode: 200,
    headers: {},
    send: body => {
      c.response.body = body;
      cb();
    },
    status: statusCode => {
      c.response.statusCode = statusCode;
    }
  };
  c.next = (error) => {
    if (error != null) {
      c.response.statusCode = 500;
      cb(error);
    } else {
      cb();
    }
  };
  return c;
}


test.cb('waits for saga to run', t => {
  t.plan(1);

  const loadStore = createLoadStoreWithMockSagas({
    // Mock Saga `middleware.run()`
    run: (saga, ...args) => {
      t.is(saga, exampleSaga);
      return {
        done: Promise.resolve()
      }
    }
  });

  // Generate the render function, an Express.js request handler
  const render4r = createRender4r({
    routes,
    loadStore,
    layoutHtml
  });

  function afterRequest(error) {
    if (error != null) {
      t.end(error);
    } else {
      t.end();
    }
  }
  const c = buildContext(t, afterRequest);
  // Perform the render
  render4r(c.request, c.response, c.next);
});
