import React, { Component }   from 'react';
import { Route, IndexRoute, Redirect } from 'react-router';
import { createStore, combineReducers } from 'redux';
import Radium, { Style }      from 'radium';
import DocumentMeta           from 'react-document-meta';

import { reducers }           from '../..';



class AppComponent extends Component {
  render() {
    const metaData = {
      title: 'Minimal App'
    };
    const styles = {
      width: '100%',
      height: '100%'
    }
    const globalStyles = {
      html: {
        backgroundColor: 'black',
        color: 'white'
      }
    }

    return React.createElement('div', {
      id: "app-view",
      style: styles.base
    },[
      React.createElement(DocumentMeta, Object.assign({ key: '1' }, metaData)),
      React.createElement(Style, { key: '2', rules: globalStyles }),
      this.props.children
    ])
  }

}
const App = Radium(AppComponent);


class HomeComponent extends Component {

  // static fetchData(dispatch, props) {
  //   return dispatch(CounterActions.get());
  // }

  render() {
    return React.createElement('div', { id: "home-view" });
  }
}
const Home = Radium(HomeComponent);



export var routes = React.createElement(Route, {
  path: "/",
  component: App
},[
  React.createElement(IndexRoute, { key: '1', component: Home }),
  React.createElement(Redirect, { key: '2', from: "old-home", to: "/" })
]);

export function loadStore(initialState) {
  return createStore(combineReducers(reducers), initialState);
}

export function layoutHtml(html, state, meta) {
  return `
    <!doctype html>
    <html>
      <head>
        ${meta}
      </head>
      <body>
        <div id="react-app">${html}</div>
        <script>
          window.__INITIAL_STATE__ = ${state};
        </script>
        <script src="/bundle.js"></script>
      </body>
    </html>
  `
}
