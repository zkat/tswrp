import React from "react";
import {Route, DefaultRoute, NotFoundRoute} from "react-router";
import Layout from "js/layout";
import HomePage from "js/pages/home";
import NotFoundPage from "js/pages/not-found";

export default (
    <Route path="/" handler={Layout}>
      <DefaultRoute name="home" handler={HomePage} />
      <NotFoundRoute name="404" handler={NotFoundPage} />
    </Route>
);
