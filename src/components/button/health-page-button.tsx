import React, { FC } from 'react'

import HeartIcon from '@images/heart.svg'
import { Button } from './button'

import '@styles/components/button.css'

interface Props {
  expanded: boolean,
  onClick(): void
}

export const HealthPageButton: FC<Props> = (props: Props) => {
  const { expanded, onClick } = props
  return (
    <Button
      className="button"
      expanded={expanded}
      onClick={onClick}
      title="Health"
      icon={
        <HeartIcon
          className="button-icon"
        />
      }
    />
  )
}