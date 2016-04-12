module.exports = function runSagas(routes, dispatch, props, sagaMiddleware) {
  return Promise.all(
    routes
    .filter(function(route) {
      var sagasToRun;
      return route.component &&
        (sagasToRun = route.component.sagasToRun) &&
          typeof sagasToRun === 'function';
    })
    .map(function(route) {
      var sagasToRun = route.component.sagasToRun(dispatch, props);
      if (sagasToRun == null ||
            !(sagasToRun instanceof Array) ||
            sagasToRun.some( s => !(s instanceof Array) )) {
        return Promise.reject(
          new Error(`\`sagasToRun()\` must return an array of arrays, in route component ${route.component.displayName}`));
      }
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
  )
}