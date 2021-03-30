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
      <div className="button-icon-container">
        {icon}
      </div>
      <div className={`button-title-container ${expanded ? 'w-full' : 'w-0'}`}>
        <div className="button-title">{title}</div>
      </div>
    </button>
  )
}