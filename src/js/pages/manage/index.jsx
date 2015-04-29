import React from "react";
import ReactFireMixin from "reactfire";
import {Button} from "react-bootstrap";
import db from "js/db";

export default React.createClass({
  mixins: [ReactFireMixin],
  getInitialState() {
    return { error: null };
  },
  componentDidMount() {
    this.props.mapIdBus.push(null);
  },
  auth() {
    db.authWithOAuthPopup("twitter", (error=null, authData) => {
      this.setState({error});
      if (!error) {
        let ref = db.child("users").child(authData.twitter.id);
        ref.update(authData.twitter);
      }
    });
  },
  render() {
    return (
      <div className="manage-page">
        {this.props.user ?
          (
            <div>
              <h1>Hello, @{this.props.user.username}!</h1>
              <Button onClick={() => db.unauth()}>Disconnect</Button>
            </div>
          ) :
          (<Button onClick={() => this.auth()}>Connect</Button>)}
      </div>
    );
  }
});
