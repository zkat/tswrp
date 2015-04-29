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
    let state = {
      auth: null,
      mapId: "",
      mapIdBus: new Bacon.Bus(),
      mapFocus: "",
      mapFocusBus: new Bacon.Bus()
    }
    return state;
  },
  setUser(auth) {
    this.setState({auth});
  },
  componentWillMount() {
    db.onAuth(this.setUser);
    this.plug(this.state.mapIdBus, "mapId");
    this.plug(this.state.mapFocusBus, "mapFocus");
  },
  componentWillUnmount() {
    db.offAuth(this.setUser);
  },
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
              <NavItemLink to="map">
                Map
              </NavItemLink>
              <NavItemLink to="manage">
                Manage Your Character
              </NavItemLink>
            </Nav>
          </CollapsableNav>
        </Navbar>
        {this.state.mapId &&
          <KumuEmbed className="kumu-embed"
                     embedId={this.state.mapId}
                     footer={false}
                     selection={this.state.mapSelection} />}
        <TransitionGroup transitionName="fade"
                         component="div"
                         className="transition-group container-fluid">
          <RouteHandler key={router.getCurrentPath()}
                        auth={this.state.auth}
                        mapIdBus={this.state.mapIdBus}
                        mapFocusBus={this.state.mapFocusBus} />
        </TransitionGroup>
      </div>
    );
  }
});
