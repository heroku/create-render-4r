var Immutable = require('immutable');

var defaultState = new Immutable.Map({});

module.exports = function config(state, action) {
  if (state == null) {
    state = defaultState;
  }
  if (action.type === 'SET') {
    return state.merge(action.payload);
  } else {
    return state;
  }
}
