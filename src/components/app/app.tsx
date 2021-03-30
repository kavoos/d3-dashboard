import React, { FC } from 'react'
import { Sidebar } from '../sidebar/sidebar'
import { AppRouter } from '@src/pages/app-router'
import { BrowserRouter } from 'react-router-dom'

import '@styles/components/app.css'

export const App: FC = (): React.ReactElement => (
  <BrowserRouter>
    <div className="app">
      <Sidebar />
      <AppRouter />
    </div>
  </BrowserRouter>
)