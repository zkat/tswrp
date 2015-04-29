import React from "react";
import {RaisedButton} from "material-ui";

export default React.createClass({
  contextTypes: {
    router: React.PropTypes.func
  },
  render() {
    return (
        <div>
            <h1>Hello World</h1>
            <p>
              This app lets you manage relationships
            </p>
        </div>
    );
  }
});
