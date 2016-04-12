module.exports = function runSagas(routes, dispatch, props, sagaMiddleware) {
  return routes
    .filter(function(route) {
      var sagasToRun;
      return route.component &&
        (sagasToRun = route.component.sagasToRun) &&
          typeof sagasToRun === 'function';
    })
    .map(function(route) {
      var sagasToRun = route.component.sagasToRun(dispatch, props);
      return Promise.all(
        sagasToRun.map(function(args) {
          // Run each Saga
          // http://yelouafi.github.io/redux-saga/docs/api/index.html#middlewarerunsaga-args
          // …returning the Task descriptor's Promise
          // http://yelouafi.github.io/redux-saga/docs/api/index.html#task-descriptor
          return sagaMiddleware.run.apply(null, args).done;
        })
      )
    })
}