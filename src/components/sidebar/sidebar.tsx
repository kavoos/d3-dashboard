import React, { FC, useState } from 'react'
import { Avatar } from '../avatar/avatar'
import { ExpandButton } from '../button/expand-button'
import { SettingsButton } from '../button/settings-button'
import { SupportButton } from '../button/support-button'
import { CovidPageButton } from '../button/covid-page-button'
import { FinancePageButton } from '../button/finance-page-button'
import { Spacer } from '../spacer/spacer'

import { useHistory, useLocation } from "react-router-dom"

import '@styles/components/sidebar.css'

export const Sidebar: FC = () => {
  const [expanded, setExpanded] = useState(false)

  const history = useHistory()
  const location = useLocation()

  const navigate = (to: string) => {
    if (to !== location.pathname) history.push(to)
  }

  return (
    <div
      className={`sidebar ${expanded ? 'w-56' : 'w-18 '}`}
    >
      <Avatar expanded={expanded} />
      <CovidPageButton
        expanded={expanded}
        onClick={() => navigate('/health')}
      />
      {/* <FinancePageButton
        expanded={expanded}
        onClick={() => navigate('/finance')}
      /> */}
      <Spacer />
      {/* <SupportButton
        expanded={expanded}
        onClick={() => navigate('/support')}
      />
      <SettingsButton
        expanded={expanded}
        onClick={() => navigate('/settings')}
      /> */}
      <ExpandButton
        expanded={expanded}
        onClick={() => setExpanded(!expanded)}
      />
    </div>
  )
}