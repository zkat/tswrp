import React from "react";
import ReactFireMixin from "reactfire";
import {Button, Input} from "react-bootstrap";
import Select from "react-select";
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
    this.bindAsObject(db.child("tags"), "tags");
    this.props.mapIdBus.push(null);
  },
  updateElement(element={}) {
    element = Map(element);
    let elementRef = this.props.elementRef
    let tagsRef = this.firebaseRefs.tags;
    let {twitter} = this.props.auth;
    let profile = twitter.cachedUserProfile;
    let newElement = element.mergeWith({
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
    let {auth, element} = this.props;
    if (auth) {
      return (
        <div className="manage-page">
          <h1>Hello, @{auth.twitter.username}!</h1>
          <p>
            Edits below will be immediately.
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
              <div className="form-group">
                <label>Faction</label>
                <Select ref="faction"
                        onChange={this.makeChangeHandler("faction")}
                        options={this.props.factions.map(faction => ({
                          value: faction, label: faction
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
            </form>
          ) : (
            <div>
              <p>
                You have not created an element associated with this Twitter
                account yet. Once created, you will be able to edit it.
              </p>
              <p>
                If this is not the account you want to edit, please
                <a target="_blank" href="http://twitter.com/logout"> log out </a>
                of your Twitter account and click the logout button below.
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
