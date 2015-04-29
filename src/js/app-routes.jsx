import React from "react";
import {Route, DefaultRoute, NotFoundRoute} from "react-router";
import Layout from "js/layout";
import HomePage from "js/pages/home";
import LovePage from "js/pages/love";
import ManagePage from "js/pages/manage";
import NotFoundPage from "js/pages/not-found";

export default (
    <Route path="/" handler={Layout}>
      <DefaultRoute name="home" handler={HomePage} />
      <Route name="love" handler={LovePage} />
      <Route name="manage" handler={ManagePage} />
      <NotFoundRoute name="404" handler={NotFoundPage} />
    </Route>
);
