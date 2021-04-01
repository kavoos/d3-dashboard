import React, { FC, useEffect } from 'react'
// import * as d3 from 'd3'
import { useAsync } from '@src/hooks/use-async'
import '@styles/pages/pages.css'
import { IndeterminateProgressBar } from '@src/components/progress-bar/indeterminate-progress-bar'

const URL_COVID19BE_VACC = 'https://epistat.sciensano.be/Data/COVID19BE_VACC.csv'

const fetchAdministeredVaccines = async () => {
  const response = await fetch(URL_COVID19BE_VACC)
  return await response.text()
}

export const CovidPage: FC = () => {
  const { status, data } = useAsync<string>(fetchAdministeredVaccines, true)

  useEffect(() => {
    console.log('status:', status)
    console.log('data: ', data)
  }, [status])

  return (
    <div className="page">
      <div className="page-title">COVID-19 (Belgium)</div>
      {status === 'pending' && <IndeterminateProgressBar />}
    </div>
  )
}