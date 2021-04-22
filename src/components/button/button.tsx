import React, { FC, ReactNode } from 'react'

import '@styles/components/button.css'

interface Props {
  expanded?: boolean,
  className?: string,
  icon?: ReactNode,
  title?: string,
  onClick(): void
}

export const Button: FC<Props> = (props: Props) => {
  const { expanded, className, icon, title, onClick } = props

  return (
    <button
      className={className}
      onClick={onClick}
    >
      {icon}
      <div className={`button-title ${expanded ? 'w-36' : 'w-0'}`}>{title}</div>
    </button>
  )
}