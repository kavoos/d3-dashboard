import React, { FC, useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import { useAsync } from '@src/hooks/use-async'
import '@styles/pages/pages.css'
import { IndeterminateProgressBar } from '@src/components/progress-bar/indeterminate-progress-bar'
import { DataDonutChart, DonutChart } from '@src/components/charts/donut-chart'
import { colors } from '@src/utils/colors'

const URL_COVID19BE_VACC = 'https://epistat.sciensano.be/Data/COVID19BE_VACC.csv'

type Gender = 'F' | 'M' | 'NA'
type Dose = 'A' | 'B'

const fetchAdministeredVaccines = async () => {
  const response = await fetch(URL_COVID19BE_VACC)
  return await response.text()
}

export const CovidPage: FC = () => {
  const { status, data } = useAsync<string>(fetchAdministeredVaccines, true)

  const [vaccineACountPerGender, setVaccineACountPerGender] = useState<DataDonutChart[] | null>(null)
  const [vaccineBCountPerGender, setVaccineBCountPerGender] = useState<DataDonutChart[] | null>(null)

  const displayGender = (g: Gender) => {
    switch (g) {
      case 'F':
        return 'Female'
      case 'M':
        return 'Male'
      default:
        return 'Other'
    }
  }

  const getVaccineCountPerGender = (d: d3.DSVRowArray<string>, dose: Dose) => {
    const genders: Gender[] = ['F', 'M', 'NA']

    const vaccineCountPerGender: DataDonutChart[] = []
    genders.forEach((g, i) => {
      const r: DataDonutChart = {
        item: g,
        count: 0,
        color: colors[i % colors.length],
        fullItem: displayGender(g)
      }

      d.forEach(i => {
        if (i['DOSE'] === dose) {
          if (i['SEX'] === g) r.count += i['COUNT'] ? +i['COUNT'] : 0
          else if (i['SEX'] !== 'F' && i['SEX'] !== 'M') r.count += i['COUNT'] ? +i['COUNT'] : 0
        }
      })

      vaccineCountPerGender.push(r)
    })
    return vaccineCountPerGender
  }

  useEffect(() => {
    if (data) {
      const parsedData = d3.csvParse(data)
      setVaccineACountPerGender(getVaccineCountPerGender(parsedData, 'A'))
      setVaccineBCountPerGender(getVaccineCountPerGender(parsedData, 'B'))
    } else {
      setVaccineACountPerGender(null)
      setVaccineBCountPerGender(null)
    }
  }, [status])

  const renderProgressBar = () => {
    if (status === 'pending') return <IndeterminateProgressBar />
    return null
  }

  const renderDonutChart = () => {
    if (status === 'success' && vaccineACountPerGender && vaccineBCountPerGender) {
      return (
        <div className="page-block">
          <div className="page-subtitle-1">Vaccinated people by gender</div>
          <div className="page-row-2-col">
            <div>
              <div className="page-subtitle-2">At least 1 dose</div>
              <DonutChart data={vaccineACountPerGender} />
            </div>
            <div>
              <div className="page-subtitle-2">Fully vaccinated</div>
              <DonutChart data={vaccineBCountPerGender} />
            </div>
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <div className="page">
      <div className="page-title">COVID-19 (Belgium)</div>
      {renderProgressBar()}
      {renderDonutChart()}
    </div>
  )
}