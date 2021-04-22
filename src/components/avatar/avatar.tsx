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
      <UserCircleIcon className='avatar-placeholder' />
      <div className={`avatar-name-container ${expanded ? 'w-36' : 'w-0'}`}>
        <div className="avatar-name">Kavoos Boloorchi</div>
        <div className="avatar-title">Front-end developer</div>
      </div>
    </div>
  )
}