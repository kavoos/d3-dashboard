import React, { FC } from 'react'
import { Route, Switch, useLocation } from 'react-router-dom'
import { FinancePage } from './finance-page'
import { CovidPage } from './covid-page'
import { HomePage } from './home-page'
import { NoMatchPage } from './no-match-page'
import { SettingsPage } from './settings-page'
import { SupportPage } from './support-page'
import { TransitionGroup, CSSTransition } from 'react-transition-group'

import '@styles/pages/pages.css'

export const AppRouter: FC = () => {
  const location = useLocation()

  return (
    <div className="page-container">
      <TransitionGroup>
        <CSSTransition
          key={location.key}
          timeout={300}
          classNames="page"
          unmountOnExit
        >
          <Switch location={location}>
            <Route path="/" exact component={HomePage} />
            <Route path="/covid-19-be" component={CovidPage} />
            <Route path="/finance" component={FinancePage} />
            <Route path="/settings" component={SettingsPage} />
            <Route path="/support" component={SupportPage} />
            <Route component={NoMatchPage} />
          </Switch>
        </CSSTransition>
      </TransitionGroup>
    </div>
  )
}