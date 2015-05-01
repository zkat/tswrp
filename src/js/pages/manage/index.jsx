import React from "react";
import ReactFireMixin from "reactfire";
import {
  Button,
  Input,
  Glyphicon,
  ListGroup,
  ListGroupItem
} from "react-bootstrap";
import Select from "react-select";
import {Map} from "immutable";
import db from "js/db";
import ConnDisplay from "js/conn-display";

export default React.createClass({
  mixins: [ReactFireMixin],
  getDefaultProps() {
    return {
      types: [
        "PC",
        "NPC",
        "Organization"
      ],
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
    this.bindAsObject(db.child("tags"), "tags");
    this.props.mapIdBus.push(null);
  },
  updateElement(element={}) {
    element = Map(element);
    let elementRef = this.props.elementRef
    let tagsRef = this.firebaseRefs.tags;
    let {twitter} = this.props.auth;
    let profile = twitter.cachedUserProfile;
    let newElement = element.merge({
      id: twitter.id,
      username: twitter.username,
      displayName: twitter.displayName,
      url: profile.url,
      image: profile.profile_image_url,
      banner: profile.profile_banner_url,
      location: profile.location,
      description: profile.description
    });
    elementRef.set(newElement.toObject(), error => {
      if (error) {
        console.error(
          `Error updating @${this.props.auth.twitter.username}: `,
          error);
      }
    });
  },
  makeConnection() {
    let ref = db.child("connections").push();
    ref.set({
      id: ref.key(),
      type: "friendship",
      from: this.props.element.id
    }, () => {
      let elref = this.props.elementRef;
      elref.child("connections").child(ref.key()).set(true);
    });
  },
  makeChangeHandler(prop, multi) {
    return (ev, selected) => {
      let val;
      if (selected && multi) {
        val = selected.map(x => x.value);
      } else if (selected) {
        val = selected[0] && selected[0].value;
      } else {
        val = ev.target.value;
      }
      val = val || "";
      this.updateElement(Map(this.props.element).set(prop, val).toObject());
    };
  },
  getTagOptions(input, cb) {
    setTimeout(() => cb(null, {
      options: input ? [{
        value: input.toLowerCase(), label: input
      }].concat(Object.keys(this.state.tags||{})) : []
    }), 0);
  },
  render() {
    let {auth, element, connections} = this.props;
    if (auth) {
      return (
        <div className="manage-page">
          <h1>Hello, @{auth.twitter.username}!</h1>
          <p>
            Edits below will be saved immediately. It may take
            time before your changes propagate to the map.
          </p>
          <p>
            If this is not the account you want to edit, please
            <a target="_blank" href="http://twitter.com/logout"> log out </a>
            of your Twitter account and click the logout button below.
          </p>
          {element ? (
            <form onSubmit={e => e.preventDefault()}>
              <h2>Attributes</h2>
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
              <div className="form-group">
                <label>Type</label>
                <Select ref="type"
                        onChange={this.makeChangeHandler("type")}
                        options={this.props.types.map(t => ({
                          value: t.toLowerCase(), label: t
                        }))}
                        value={element.type} />
              </div>
              <div className="form-group">
                <label>Faction</label>
                <Select ref="faction"
                        onChange={this.makeChangeHandler("faction")}
                        options={this.props.factions.map(faction => ({
                          value: faction.toLowerCase(),
                          label: faction
                        }))}
                        value={element.faction} />
              </div>
              <div className="form-group">
                <label>Tags</label>
                <Select ref="tags"
                        multi
                        onChange={this.makeChangeHandler("tags", true)}
                        asyncOptions={this.getTagOptions}
                        value={element.tags || []} />
              </div>
              <h2>Connections <Button bsStyle="primary"
                      onClick={() => this.makeConnection()}>
                <Glyphicon glyph="plus" />
              </Button>
            </h2>
              <ListGroup>
                {(Object.keys(element.connections||{})).map(c => (
                  <ListGroupItem key={c}>
                    <ConnDisplay connId={c} />
                  </ListGroupItem>
                ))}
              </ListGroup>
            </form>
          ) : (
            <div>
              <p>
                You have not created an element associated with this Twitter
                account yet. Once created, you will be able to edit it.
              </p>
              <Button onClick={() => this.updateElement()}>
                Create Character
              </Button>
            </div>
          )}
        </div>
      );
    } else {
      return (
        <div className="manage-page">
          <p>
            Please connect to your Twitter account by logging in with
            the link above to edit your character.
          </p>
        </div>
      );
    }
  }
});
