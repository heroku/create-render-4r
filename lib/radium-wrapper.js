var React  = require('react');
var Radium = require('radium');

/*
Work-around to setup Radium's context at a high-level for server rendering.

    <RadiumWrapper radiumConfig={{ userAgent: req.headers["user-agent"] }}>
      …
    </RadiumWrapper>

Really, just a hook to inject `radiumConfig` into Radium.
*/
var RadiumWrapper = React.createClass({
  render: function() {
    return this.props.children;
  }
});

module.exports = Radium(RadiumWrapper);
