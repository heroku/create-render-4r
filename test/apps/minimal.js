import React, { Component }   from 'react';
import { Route, IndexRoute }  from 'react-router';
import { createStore as reduxCreateStore, combineReducers }                  from 'redux';
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

    return (
      <div
        id="app-view"
        style={styles.base}>

        <DocumentMeta {...metaData}/>
        <Style rules={globalStyles} />

        {this.props.children}
      </div>
    );
  }

}
const App = Radium(AppComponent);


class HomeComponent extends Component {

  // static fetchData(dispatch, props) {
  //   return dispatch(CounterActions.get());
  // }

  render() {
    return <div id="home-view" />;
  }
}
const Home = Radium(HomeComponent);



export var routes = (
  <Route path="/" component={App}>
    <IndexRoute component={Home}/>
  </Route>
);

export function createStore(initialState) {
  return reduxCreateStore(combineReducers(reducers), initialState);
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
