import React, { FC } from 'react'

import SupportIcon from '@images/support.svg'
import { Button } from './button'

import '@styles/components/button.css'

interface Props {
  expanded: boolean,
  onClick(): void
}

export const SupportButton: FC<Props> = (props: Props) => {
  const { expanded, onClick } = props
  return (
    <Button
      className="button"
      expanded={expanded}
      onClick={onClick}
      title="Support"
      icon={
        <SupportIcon
          className="button-icon"
        />
      }
    />
  )
}