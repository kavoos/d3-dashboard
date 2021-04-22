import React, { FC } from 'react'
import { Sidebar } from '../sidebar/sidebar'
import { AppRouter } from '@src/pages/app-router'
import { BrowserRouter } from 'react-router-dom'
import { useMedia } from '@src/hooks/use-media'
import { ScreenSize } from '@src/@types/screen'

import '@styles/components/app.css'

const mediaBreakPoints = [
  '(min-width: 1280px)',
  '(min-width: 1024px)',
  '(min-width: 768px)',
  '(min-width: 640px)'
]

const screenSizes: ScreenSize[] = ['2xl', 'xl', 'lg', 'md']

// TODO:
// sm => top/bottom - single column
// md => top/bottom - single column
// lg => sidebar - shortened - single column
// xl => sidebar - shortened - double columns
// 2xl => sidebar - expanded - double columns

export const App: FC = () => {
  const screenSize = useMedia<ScreenSize>(mediaBreakPoints, screenSizes, 'sm')

  const isLargeScreen = (s: ScreenSize) => {
    switch (s) {
      case 'lg':
      case 'xl':
      case '2xl':
        return true
      default:
        return false;
    }
  }

  return (
    <BrowserRouter>
      <div className='app'>
        {isLargeScreen(screenSize) && <Sidebar />}
        <AppRouter />
      </div>
    </BrowserRouter>
  )
}
