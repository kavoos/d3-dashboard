import React, { FC } from 'react'

import SettingIcon from '@images/cog.svg'
import { Button } from './button'

import '@styles/components/button.css'

interface Props {
  expanded: boolean,
  onClick(): void
}

export const SettingsButton: FC<Props> = (props: Props) => {
  const { expanded, onClick } = props
  return (
    <Button
      className="button"
      expanded={expanded}
      onClick={onClick}
      title="Settings"
      icon={
        <SettingIcon
          className="button-icon"
        />
      }
    />
  )
}