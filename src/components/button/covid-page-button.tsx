import React, { FC } from 'react'

import CoronaVirusIcon from '@images/coronavirus.svg'
import { Button } from './button'

import '@styles/components/button.css'
import { useLocation } from 'react-router-dom'

interface Props {
  expanded: boolean,
  onClick(): void
}

export const CovidPageButton: FC<Props> = (props: Props) => {
  const { expanded, onClick } = props

  const location = useLocation()

  return (
    <Button
      className={`button${location.pathname === '/covid-19-be' ? ' bg-primary' : ''}`}
      expanded={expanded}
      onClick={onClick}
      title="COVID-19 (Belgium)"
      icon={
        <CoronaVirusIcon
          className="button-icon"
        />
      }
    />
  )
}