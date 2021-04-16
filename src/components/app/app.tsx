import React, { FC, useEffect, useState } from 'react'
import { Sidebar } from '../sidebar/sidebar'
import { AppRouter } from '@src/pages/app-router'
import { BrowserRouter } from 'react-router-dom'
import { useWindowSizeWithDebounce } from '@src/hooks/use-window-size'

import '@styles/components/app.css'

/**
 *  - `sm`	min-width: 640px
 *  - `md`	min-width: 768px
 *  - `lg`	min-width: 1024px
 *  - `xl`	min-width: 1280px
 *  - `2xl`	min-width: 1536px
 */
type ScreenSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl'

const getScreenSize = (width: number): ScreenSize => {
  if (width < 768) return 'sm'
  else if (width < 1024) return 'md'
  else if (width < 1280) return 'lg'
  else if (width < 1536) return 'xl'
  else return '2xl'
}

export const App: FC = () => {
  const size = useWindowSizeWithDebounce()

  const [screenSize, setScreenSize] = useState<ScreenSize>()

  useEffect(() => {
    console.log(`w: ${size.width}px, h: ${size.height}px`)
    console.log(getScreenSize(size.width || 0))
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