import React, { FC, useEffect, useState } from 'react'
import { Avatar } from '../avatar/avatar'
import { ExpandButton } from '../button/expand-button'
import { CovidPageButton } from '../button/covid-page-button'
import { Spacer } from '../spacer/spacer'

import { useHistory, useLocation } from "react-router-dom"
import { ScreenSize } from '@src/@types/screen'
import { useMedia } from '@src/hooks/use-media'

import '@styles/components/sidebar.css'

const mediaBreakPoints = [
  '(min-width: 1280px)'
]

const screenSizes: ScreenSize[] = ['2xl']

export const Sidebar: FC = () => {
  const screenSize = useMedia<ScreenSize>(mediaBreakPoints, screenSizes, 'lg')
  const [expanded, setExpanded] = useState(screenSize === '2xl')

  const history = useHistory()
  const location = useLocation()

  const navigate = (to: string) => {
    if (to !== location.pathname) history.push(to)
  }

  useEffect(() => {
    setExpanded(screenSize === '2xl')
  }, [screenSize])

  return (
    <div
      className={`sidebar ${expanded ? 'w-56' : 'w-18'}`}
    >
      <Avatar expanded={expanded} />
      <CovidPageButton
        expanded={expanded}
        onClick={() => navigate('/covid-19-be')}
      />
      {/* <Spacer />
      <ExpandButton
        expanded={expanded}
        onClick={() => setExpanded(!expanded)}
      /> */}
    </div>
  )
}