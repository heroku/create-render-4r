import test from 'ava';
import createRender4r, { actions, reducers } from '..';

import { routes, loadStore, layoutHtml } from './apps/minimal';

function buildContext(t, cb) {
  if (typeof cb !== 'function') {
    throw new Error('buildContext() requires `cb` argument, a callback');
  }

  const c = t.context;
  // Generate the render function, an Express.js request handler
  c.render4r = createRender4r({
    routes,
    loadStore,
    layoutHtml
  });
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
    redirect: (statusCode, location) => {
      c.response.headers.location = location;
      c.response.statusCode = statusCode;
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


test.cb('Defaults to status code 200', t => {
  function afterRequest(error) {
    if (error != null) {
      t.end(error);
    } else {
      t.is(c.response.statusCode, 200);
      t.end();
    }
  }
  const c = buildContext(t, afterRequest);
  // Perform the render
  c.render4r(c.request, c.response, c.next);
});

test.cb('Redirects with status code 301', t => {
  function afterRequest(error) {
    if (error != null) {
      t.end(error);
    } else {
      t.is(c.response.statusCode, 301);
      t.is(c.response.headers.location, '/');
      t.end();
    }
  }
  const c = buildContext(t, afterRequest);
  // Perform the render
  c.request.url = '/old-home';
  c.render4r(c.request, c.response, c.next);
});

test.cb('Not found with status code 404', t => {
  function afterRequest(error) {
    if (error != null) {
      t.end(error);
    } else {
      t.is(c.response.statusCode, 404);
      t.end();
    }
  }
  const c = buildContext(t, afterRequest);
  // Perform the render
  c.request.url = '/non-existent-path';
  c.render4r(c.request, c.response, c.next);
});

test.cb('Sends response body', t => {
  function afterRequest(error) {
    if (error != null) {
      t.end(error);
    } else {
      t.ok(c.response.body.indexOf('<html>') >= 0, 'contains an <html> tag');
      t.end();
    }
  }
  const c = buildContext(t, afterRequest);
  // Perform the render
  c.render4r(c.request, c.response, c.next);
});

test.cb('Includes title element', t => {
  function afterRequest(error) {
    if (error != null) {
      t.end(error);
    } else {
      t.ok(
        c.response.body.indexOf('<title>Minimal App</title>') >= 0,
       'contains <title>Minimal App</title>');
      t.end();
    }
  }
  const c = buildContext(t, afterRequest);
  // Perform the render
  c.render4r(c.request, c.response, c.next);
});

test.cb('Includes components in "/" route', t => {
  function afterRequest(error) {
    if (error != null) {
      t.end(error);
    } else {
      t.ok(
        c.response.body.indexOf('id="app-view"') >= 0,
      'contains the App component');
      t.ok(
        c.response.body.indexOf('id="home-view"') >= 0,
        'contains the Home component');
      t.end();
    }
  }
  const c = buildContext(t, afterRequest);
  // Perform the render
  c.render4r(c.request, c.response, c.next);
});

test.cb('Includes initial state JSON data', t => {
  function afterRequest(error) {
    if (error != null) {
      t.end(error);
    } else {
      t.ok(
        c.response.body.indexOf('__INITIAL_STATE__ = {') >= 0,
       'sets a JSON object');
      t.end();
    }
  }
  const c = buildContext(t, afterRequest);
  // Perform the render
  c.render4r(c.request, c.response, c.next);
});

test.cb('Includes source request protocol & host in initial state', t => {
  function afterRequest(error) {
    if (error != null) {
      t.end(error);
    } else {
      t.ok(
        c.response.body.indexOf('"sourceRequest":{') >= 0,
        'contains "sourceRequest" property');
      t.ok(
        c.response.body.indexOf('"protocol":"http"') >= 0,
        'contains "protocol" property');
      t.ok(
        c.response.body.indexOf('"host":"example.com"') >= 0,
        'contains "host" property');
      t.end();
    }
  }
  const c = buildContext(t, afterRequest);
  // Perform the render
  c.render4r(c.request, c.response, c.next);
});

test.cb('Includes inline CSS', t => {
  function afterRequest(error) {
    if (error != null) {
      t.end(error);
    } else {
      t.ok(
        c.response.body.indexOf('<style') >= 0,
        'contains a <style> element');
      t.ok(
        c.response.body.indexOf('background-color: black;') >= 0,
        'contains background-color rule');
      t.ok(
        c.response.body.indexOf('color: white;') >= 0,
        'contains color rule');
      t.end();
    }
  }
  const c = buildContext(t, afterRequest);
  // Perform the render
  c.render4r(c.request, c.response, c.next);
});
