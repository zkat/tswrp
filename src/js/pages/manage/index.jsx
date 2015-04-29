import React from "react";
import ReactFireMixin from "reactfire";
import {Button, Input} from "react-bootstrap";
import {Map} from "immutable";
import db from "js/db";

export default React.createClass({
  mixins: [ReactFireMixin],
  getDefaultProps() {
    return {
      factions: [
        "",
        "Illuminati",
        "Templar",
        "Dragon",
        "Council of Venice",
        "The Brotherhood of Phoenecian Sailors",
        "Orochi Group",
        "Filth",
        "Fae",
        "Neutral",
        "Other"
      ]
    };
  },
  getInitialState() {
    return { error: null, element: null };
  },
  componentWillMount() {
    this.props.mapIdBus.push(null);
    this.installElementBinding(this.props);
  },
  componentWillReceiveProps(props) {
    this.installElementBinding(props);
  },
  auth() {
    db.authWithOAuthPopup("twitter", (error=null) => {
      this.setState({error});
    });
  },
  installElementBinding(props) {
    if (this.firebaseRefs.element) { this.unbind("element"); }
    if (props.auth) {
      let ref = db.child("elements").child(props.auth.twitter.id);
      this.bindAsObject(ref, "element");
    } else {
      this.setState({element: null});
    }
  },
  updateElement() {
    let element = this.state.element || {};
    let elementRef = this.firebaseRefs.element;
    let {twitter} = this.props.auth;
    if (!elementRef) { return; }
    ["firstName", "lastName", "nickname", "faction"].forEach(field => {
      let ref = this.refs[field];
      if (ref) {
        element[field] = ref.getValue() || "";
      }
    });
    element.id = twitter.id;
    element.username = twitter.username;
    element.displayName = twitter.displayName;
    let profile = twitter.cachedUserProfile;
    element.url = profile.url;
    element.image = profile.profile_image_url;
    element.bgImage = profile.profile_background_image_url;
    element.location = profile.location;
    element.description = profile.description;
    elementRef.set(element, error => {
      if (error) {
        this.setState({
          alert: {
            type: "danger",
            msg: "There was an error updating this element"
          }
        });
        console.error(
          `Error updating @${this.props.auth.twitter.username}: `,
          error);
      } else {
        this.setState({alert: {type: "success", msg: "Saved!"}});
      }
    });
  },
  makeChangeHandler(prop) {
    return ev => {
      let val = ev.target.value;
      this.setState({
        element: Map(this.state.element).set(prop, val).toObject()
      });
      this.updateElement();
    };
  },
  render() {
    let {auth} = this.props;
    let {element, alert} = this.state;
    if (auth) {
      return (
        <div className="manage-page">
          <h1>Hello, @{auth.twitter.username}!</h1>
          <p>
            Edits below will be immediately saved on edit.
          </p>
          {element ? (
            <form onSubmit={e => e.preventDefault()}>
              <Input type="text"
                     label="First"
                     ref="firstName"
                     onChange={this.makeChangeHandler("firstName")}
                     value={element.firstName} />
              <Input type="text"
                     label='"Callsign"'
                     ref="nickname"
                     onChange={this.makeChangeHandler("nickname")}
                     value={element.nickname} />
              <Input type="text"
                     label="Last"
                     ref="lastName"
                     onChange={this.makeChangeHandler("lastName")}
                     value={element.lastName} />
              <Input type='select'
                     label='Faction'
                     ref="faction"
                     onChange={this.makeChangeHandler("faction")}
                     value={element.faction}>
                {this.props.factions.map(faction => {
                  return <option value={faction}>{faction}</option>;
                })}
              </Input>
            </form>
          ) : (
            <div>
              <p>
                You have not created an element associated with this Twitter
                account yet. Once created, you will be able to edit it.
              </p>
              <Button onClick={this.updateElement}>
                Create new Element
              </Button>
            </div>
          )}
          <Button bsStyle="danger" onClick={() => db.unauth()}>
            Log Out
          </Button>
        </div>
      );
    } else {
      return (
        <div className="manage-page">
          <p>Please connect to your Twitter account to edit your character.</p>
          <Button bsStyle="primary" onClick={() => this.auth()}>Log In</Button>
        </div>
      );
    }
  }
});
