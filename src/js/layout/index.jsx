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
  Navbar,
  NavItem
} from "react-bootstrap";
import db from "js/db";
import "./styles.less";

export default React.createClass({
  mixins: [ReactFireMixin],
  contextTypes: {
    router: React.PropTypes.func
  },
  getInitialState() {
    return {user: null};
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
    let title = routes[routes.length-1].name;
    title = title[0].toUpperCase() + title.slice(1).toLowerCase();
    return (
      <div className="tswrp-layout">
        <Navbar fluid brand={title} toggleNavKey={0}>
          <CollapsableNav right eventKey={0}>
            <Nav navbar right>
              <NavItem href={router.makeHref("home")}
                       onClick={handle("home")}>
                Home
              </NavItem>
            </Nav>
          </CollapsableNav>
        </Navbar>
        <TransitionGroup transitionName="fade"
                         component="div"
                         className="transition-group container-fluid">
          <RouteHandler key={router.getCurrentPath()}/>
        </TransitionGroup>
      </div>
    );
  }
});
