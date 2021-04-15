import React, { FC } from 'react'
import { Route, Switch, useLocation } from 'react-router-dom'
import { CovidPage } from './covid-page'
import { HomePage } from './home-page'
import { NoMatchPage } from './no-match-page'

import '@styles/pages/pages.css'

export const AppRouter: FC = () => {
  const location = useLocation()

  return (
    <div className="page-container">
      <Switch location={location}>
        <Route path="/" exact component={HomePage} />
        <Route path="/covid-19-be" component={CovidPage} />
        <Route component={NoMatchPage} />
      </Switch>
    </div>
  )
}