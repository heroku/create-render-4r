var Immutable             = require('immutable');
var React                 = require('react');
var ReactRouter           = require('react-router');
var RoutingContext        = ReactRouter.RoutingContext;
var match                 = ReactRouter.match;
var History               = require('history');
var createMemoryHistory   = History.createMemoryHistory;
var useQueries            = History.useQueries;
var ReactDomServer        = require('react-dom/server');
var renderToString        = ReactDomServer.renderToString;
var ReactRedux            = require('react-redux');
var Provider              = ReactRedux.Provider;
var DocumentMeta          = require('react-document-meta').default;
var RadiumWrapper         = require('./lib/radium-wrapper');
var sourceRequestActions  = require('./lib/actions/source-request');
var sourceRequestReducers = require('./lib/reducers/source-request');
var runSagas              = require('./lib/run-sagas');

function createRender4r(params) {
  if (typeof params !== 'object') {
    throw new Error('createRender4r requires a params object');
  }

  var routes = params.routes;
  var loadStore = params.loadStore;
  var layoutHtml = params.layoutHtml;
  var decorateResponse = params.decorateResponse;

  if (routes == null || typeof routes !== 'object') {
    throw new Error('createRender4r requires a `routes` object');
  }
  if (typeof loadStore !== 'function') {
    throw new Error('createRender4r requires a `loadStore` function');
  }
  if (typeof layoutHtml !== 'function') {
    throw new Error('createRender4r requires a `layoutHtml` function');
  }
  
  var universalRender = function(req, res, next) {
    var headers                   = req.headers || {};
    var history                   = useQueries(createMemoryHistory)();
    var location                  = history.createLocation(req.url);
    var store                     = loadStore({
      // Capture protocol & hostname in Redux state
      sourceRequest: new Immutable.Map({
        protocol: headers['x-forwarded-proto'] || req.protocol,
        host: headers.host
      })
    });
    var sagaMiddleware            = store.sagaMiddleware;
    var hasSagaMiddleware         = sagaMiddleware != null;
    var userAgent                 = headers['user-agent'];

    if (hasSagaMiddleware && typeof sagaMiddleware.run !== 'function') {
      throw new Error('createRender4r requires `sagaMiddleware` to provide `run()`');
    }

    match({
      routes: routes,
      location: location
    }, function(error, redirectLocation, renderProps) {
      if (redirectLocation) {
        res.redirect(301, redirectLocation.pathname + redirectLocation.search);
      } else if (error) {
        next(error);
      } else if (renderProps == null) {
        res.status(404);
        res.send('Not found');
      } else {
        // Await fetchData methods in the current route.
        Promise.all(
          renderProps
            .routes
            .filter(function(route) {
              var fetchData;
              return route.component && 
                (fetchData = route.component.fetchData) && 
                  typeof fetchData === 'function';
            })
            .map(function(route) {
              // Call each fetchData function
              // …returning a Promise from the thunk.
              return route.component.fetchData(store.dispatch, renderProps);
            })
          .concat(
            hasSagaMiddleware
              ? runSagas(renderProps.routes, store.dispatch, renderProps, sagaMiddleware)
              : []
          )
        )
        .then(function() {

          // Response variations based on app state.
          // Intentionally mutates the response!
          if (typeof decorateResponse === 'function') {
            decorateResponse(res, store.getState());
          }

          // Render the app.
          var componentHTML = renderToString(
            React.createElement(Provider, { store: store }, 
              React.createElement(RadiumWrapper, { radiumConfig: { userAgent: userAgent }},
                React.createElement(RoutingContext, renderProps)
              ) 
            )
          );

          // Freshen state after render.
          var cleanInitialState = serializeState(store.getState());
          var documentMeta = DocumentMeta.renderAsHTML();
          var HTML = layoutHtml(componentHTML, cleanInitialState, documentMeta);
          res.send(HTML);
        })
        .catch(function(error) {
          next(error);
        });
      }
    })
  };

  return universalRender;
}

// Prevent XSS vulnerability from JSON-embedded <script></script>
function serializeState(v) {
  return JSON.stringify(v).replace(/</g, '\\u003c');
}

module.exports = createRender4r;
module.exports.actions = {
  sourceRequest: sourceRequestActions
},
module.exports.reducers = {
  sourceRequest: sourceRequestReducers
};
