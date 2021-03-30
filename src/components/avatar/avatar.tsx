import React, { FC } from 'react'
import UserCircleIcon from '@images/user-circle.svg'

import '@styles/components/avatar.css'

interface Props {
  expanded?: boolean
}

export const Avatar: FC<Props> = (props: Props) => {
  const { expanded } = props
  return (
    <div className="avatar">
      <UserCircleIcon className={`avatar-placeholder ${expanded ? 'w-24 h-24' : 'w-14 h-14'}`} />
      <div className={`avatar-name-container ${expanded ? 'w-full' : 'w-0'}`}>
        <div className="avatar-name">Kavoos</div>
        <div className="avatar-name">Boloorchi</div>
      </div>
    </div>
  )
}