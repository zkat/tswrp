import React from "react";
import Router from "react-router";
import "styles/styles.less";
import AppRoutes from "js/app-routes";

Router.run(AppRoutes, Router.HistoryLocation, Handler => {
  React.render(<Handler/>, document.body);
});
