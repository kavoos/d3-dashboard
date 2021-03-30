import React, { FC } from 'react'

import ChevronDoubleRightIcon from '@images/chevron-double-right.svg'
import { Button } from './button'

import '@styles/components/button.css'

interface Props {
  expanded: boolean
  onClick(): void
}

export const ExpandButton: FC<Props> = (props: Props) => {
  const { expanded, onClick } = props
  return (
    <Button
      className="button"
      onClick={onClick}
      icon={
        <ChevronDoubleRightIcon
          className={`button-icon expanded-icon ${expanded ? 'rotate-180' : 'rotate-0 '}`}
        />
      }
    />
  )
}