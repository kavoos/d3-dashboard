import React, { FC } from 'react'

import CoronaVirusIcon from '@images/coronavirus.svg'
import { Button } from './button'

import '@styles/components/button.css'

interface Props {
  expanded: boolean,
  onClick(): void
}

export const CovidPageButton: FC<Props> = (props: Props) => {
  const { expanded, onClick } = props
  return (
    <Button
      className="button"
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