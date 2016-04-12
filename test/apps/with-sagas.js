import Immutable              from 'immutable';
import React, { Component }   from 'react';
import { Route, IndexRoute, Redirect } from 'react-router';
import { createStore, combineReducers } from 'redux';
import createSagaMiddleware   from 'redux-saga';
import { put }                from 'redux-saga/effects';
import Radium, { Style }      from 'radium';

import { reducers }           from '../..';

import {
  App,
  layoutHtml
} from './minimal';

export { App, layoutHtml };

class HomeComponent extends Component {

  static sagasToRun(dispatch, props) {
    return [
      [exampleSaga, { name: 'Example' }]
    ];
  }

  render() {
    return React.createElement('div', { id: "home-view" });
  }
}
export const Home = Radium(HomeComponent);

export const routes = React.createElement(Route, {
  path: "/",
  component: App
},[
  React.createElement(IndexRoute, { key: '1', component: Home })
]);

export function* exampleSaga(getState) {
  yield put({type: 'EXAMPLE_SAGA_DID_RUN'});
}

export function exampleReducer() {

}

export function createLoadStoreWithMockSagas(mockSagaMiddleware) {
  return function loadStore(initialState) {
    const store = createStore(combineReducers(reducers), initialState);
    store.sagaMiddleware = mockSagaMiddleware;
    return store;
  }
}