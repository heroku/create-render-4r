import test from 'ava';
import runSagas from './run-sagas';

test("calls middleware run for each component's saga", t => {
  t.plan(2); // two routes with sagas to run

  function* exampleSaga() {
    yield put({type: 'EXAMPLE_SAGA_DID_RUN'});
  }
  const routes = [
    { 
      component: { 
        displayName: 'MockApp',
        sagasToRun: () => [[exampleSaga]]
      }
    },
    { 
      component: { 
        displayName: 'MockHome',
        sagasToRun: () => [[exampleSaga]]
      }
    },
    { 
      component: { 
        displayName: 'MockNested'
      }
    }
  ];
  const sagaMiddleware = {
    run: (saga, ...args) => {
      t.is(saga, exampleSaga);
      return {
        done: Promise.resolve()
      }
    }
  }

  return runSagas(routes, null, null, sagaMiddleware);
});

test("component's saga-to-run is passed dispatch & props", t => {
  t.plan(2);

  function* exampleSaga() {
    yield put({type: 'EXAMPLE_SAGA_DID_RUN'});
  }
  function exampleDispatch() {
    // real dispatch is from Redux store
  };
  const exampleProps = {
    name: 'Example'
  };
  const routes = [
    { 
      component: { 
        displayName: 'MockApp',
        sagasToRun: (dispatch, props) => {
          t.is(dispatch, exampleDispatch);
          t.is(props, exampleProps);
          return [[exampleSaga]];
        }
      }
    }
  ];
  const sagaMiddleware = {
    run: (saga, ...args) => {
      return {
        done: Promise.resolve()
      }
    }
  }

  return runSagas(routes, exampleDispatch, exampleProps, sagaMiddleware);
});

test("rejects for bad saga-to-run", t => {
  t.plan(1);

  function* exampleSaga() {
    yield put({type: 'EXAMPLE_SAGA_DID_RUN'});
  }
  const routes = [
    { 
      component: { 
        displayName: 'MockApp',
        sagasToRun: () => exampleSaga // bad return value, not array of arrays
      }
    }
  ];

  return runSagas(routes, null, null, null)
    .catch((error) => {
      t.ok(
        /must return an array of arrays/.exec(error.message),
        'error is "…must return an array of arrays…"'
      )
    });
});
