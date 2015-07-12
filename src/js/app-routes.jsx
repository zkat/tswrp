import React from 'react'
import {Route, DefaultRoute, NotFoundRoute} from 'react-router'
import Layout from 'js/layout'

// Pages
import MapPage from 'js/pages/map'
import ManagePage from 'js/pages/manage'
import NotFoundPage from 'js/pages/not-found'

export default (
    <Route path='/' handler={Layout}>
      <DefaultRoute name='manage' handler={ManagePage} />
      <Route name='map' handler={MapPage} />
      <NotFoundRoute name='404' handler={NotFoundPage} />
    </Route>
)
