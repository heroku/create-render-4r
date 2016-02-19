import test from 'ava';
import createRender4r, { actions, reducers } from '..';

import { routes, createStore, layoutHtml } from './apps/minimal';

test.cb.beforeEach( t => {
  const c = t.context;
  // Generate the render function, an Express.js request handler
  c.render4r = createRender4r({
    routes,
    createStore,
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
    status: 200,
    end: body => {
      c.response.body = body;
      t.end();
    }
  };
  c.next = (error) => {
    console.error(error);
  };
  // Perform the render
  return c.render4r(c.request, c.response, c.next);
})

test('Defaults to status 200', t => {
  const c = t.context;
  t.is(c.response.status, 200);
});

test('Sends response body', t => {
  const c = t.context;
  t.ok(c.response.body.indexOf('<html>') >= 0, 'contains an <html> tag');
});

test('Includes title element', t => {
  const c = t.context;
  t.ok(
    c.response.body.indexOf('<title>Minimal App</title>') >= 0,
    'contains <title>Minimal App</title>');
});

test('Includes components in "/" route', t => {
  const c = t.context;
  t.ok(
    c.response.body.indexOf('id="app-view"') >= 0,
    'contains the App component');
  t.ok(
    c.response.body.indexOf('id="home-view"') >= 0,
    'contains the Home component');
});

test('Includes initial state JSON data', t => {
  const c = t.context;
  t.ok(
    c.response.body.indexOf('__INITIAL_STATE__ = {') >= 0,
    'sets a JSON object');
});

test('Includes source request protocol & host in initial state', t => {
  const c = t.context;
  t.ok(
    c.response.body.indexOf('"sourceRequest":{') >= 0,
    'contains "sourceRequest" property');
  t.ok(
    c.response.body.indexOf('"protocol":"http"') >= 0,
    'contains "protocol" property');
  t.ok(
    c.response.body.indexOf('"host":"example.com"') >= 0,
    'contains "host" property');
});

test('Includes inline CSS', t => {
  const c = t.context;
  t.ok(
    c.response.body.indexOf('<style') >= 0,
    'contains a <style> element');
  t.ok(
    c.response.body.indexOf('background-color: black;') >= 0,
    'contains background-color rule');
  t.ok(
    c.response.body.indexOf('color: white;') >= 0,
    'contains color rule');
});
