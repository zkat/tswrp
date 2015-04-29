import React from "react";
import TransitionGroup from "react/lib/ReactCSSTransitionGroup";
import ReactFireMixin from "reactfire";
import {RouteHandler} from "react-router";
import {
  CollapsableNav,
  DropdownMenu,
  MenuItem,
  Modal,
  ModalTrigger,
  Nav,
  Navbar
} from "react-bootstrap";
import {NavItemLink} from "react-router-bootstrap";
import db from "js/db";
import KumuEmbed from "js/kumu-embed";
import Bacon from "baconjs";
import {BaconMixin} from "react-bacon";
import "./styles.less";

export default React.createClass({
  mixins: [BaconMixin, ReactFireMixin],
  contextTypes: {
    router: React.PropTypes.func
  },
  getInitialState() {
    return {
      user: null,
      mapSelection: "",
      mapFocus: "",
      showMap: true
    };
  },
  setUser(authData) {
    if (this.firebaseRefs.user) { this.unbind("user"); }
    if (authData) {
      this.bindAsObject(db.child("users").child(authData.uid), "user");
    } else {
      this.setState({user: null});
    }
  },
  componentWillMount() { db.onAuth(this.setUser); },
  componentWillUnmount() { db.offAuth(this.setUser); },
  render() {
    let router = this.context.router;
    let handle = route => {
      return e => {
        e.preventDefault();
        router.transitionTo(route);
      };
    };
    let routes = router.getCurrentRoutes();
    return (
      <div className="tswrp-layout">
        <Navbar fluid brand="TSWRP Relationship Map" toggleNavKey={0}>
          <CollapsableNav right eventKey={0}>
            <Nav navbar right>
              <NavItemLink to="home">
                Map
              </NavItemLink>
            </Nav>
          </CollapsableNav>
        </Navbar>
        {this.state.showMap &&
          <KumuEmbed className="kumu-embed"
                     embedId="9272766b04dcc1a8c8e62f8dbdb90804"
                     mapName="tswrp"
                     footer={false}
                     selection={this.state.mapSelection} />}
        <TransitionGroup transitionName="fade"
                         component="div"
                         className="transition-group container-fluid">
          <RouteHandler key={router.getCurrentPath()}
                        user={this.state.user}
                        mapFocusProp={this.stateProperty("mapFocus")}
                        mapSelectionProp={this.stateProperty("mapSelection")}
                        showMapProp={this.stateProperty("showMap")}/>
        </TransitionGroup>
      </div>
    );
  }
});
