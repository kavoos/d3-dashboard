import React, { FC, useEffect } from 'react'
import { Sidebar } from '../sidebar/sidebar'
import { AppRouter } from '@src/pages/app-router'
import { BrowserRouter } from 'react-router-dom'

import '@styles/components/app.css'
import { useWindowSize } from '@src/hooks/use-window-size'

export const App: FC = () => {
  const size = useWindowSize()

  useEffect(() => {
    console.log(`w: ${size.width}px, h: ${size.height}px`)
  }, [size])

  return (
    <BrowserRouter>
      <div className='app'>
        <Sidebar />
        <AppRouter />
      </div>
    </BrowserRouter>
  )
}