import React, { FC } from 'react'

import '@styles/components/progress-bar.css'

export const IndeterminateProgressBar: FC = () => {
  return (
    <div className="slider">
      <div className="line" />
      <div className="subline inc" />
      <div className="subline dec" />
    </div>
  )
}