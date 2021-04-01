import React, { FC, useEffect, useRef } from 'react'
import * as d3 from 'd3'
import { useAsync } from '@src/hooks/use-async'
import '@styles/pages/pages.css'
import { IndeterminateProgressBar } from '@src/components/progress-bar/indeterminate-progress-bar'

const URL_COVID19BE_VACC = 'https://epistat.sciensano.be/Data/COVID19BE_VACC.csv'

type Sex = 'F' | 'M' | 'NA'
type Dose = 'A' | 'B'

interface VaccinePerSex {
  sex: Sex
  count: number
  color: string
}

const fetchAdministeredVaccines = async () => {
  const response = await fetch(URL_COVID19BE_VACC)
  return await response.text()
}

export const CovidPage: FC = () => {
  const { status, data } = useAsync<string>(fetchAdministeredVaccines, true)

  const svgContext = useRef<null | SVGSVGElement>(null)

  const getVaccineCountPerSex = (d: d3.DSVRowArray<string>, dose: Dose) => {
    const sexGroups: Sex[] = ['F', 'M', 'NA']
    const colors = ['#B0DDC2', '#DBC1E1', '#F8C296']
    const vaccineCountPerSex: VaccinePerSex[] = []
    sexGroups.forEach((s, i) => {
      const r: VaccinePerSex = {
        sex: s,
        count: 0,
        color: colors[i]
      }

      d.forEach(i => {
        if (i['DOSE'] === dose) {
          if (i['SEX'] === s) r.count += +i['COUNT']!
          else if (i['SEX'] !== 'F' && i['SEX'] !== 'M') r.count += +i['COUNT']!
        }
      })

      vaccineCountPerSex.push(r)
    })
    return vaccineCountPerSex
  }

  useEffect(() => {
    console.log('status:', status)
    if (data) {
      const parsedData = d3.csvParse(data)
      const vaccineCountPerSex = getVaccineCountPerSex(parsedData, 'A')

      console.log('vaccineCountPerSex:', vaccineCountPerSex)

      const WIDTH = 300
      const HEIGHT = 300
      const MARGIN = 24
      const RADIUS = Math.min(WIDTH, HEIGHT) / 2 - MARGIN

      const context = d3
        .select(svgContext.current)
        .attr('width', WIDTH)
        .attr('height', HEIGHT)

      const g = context
        .append('g')
        .attr('transform', `translate(${WIDTH / 2}, ${HEIGHT / 2})`)

      const pathAnimation = (path: any, emphasize: boolean) => {
        if (emphasize) {
          path.transition().attr(
            'd',
            d3
              .arc<d3.PieArcDatum<VaccinePerSex>>()
              .innerRadius(RADIUS * 0.6)
              .outerRadius(RADIUS * 1.1)
          )
        } else {
          path
            .transition()
            .duration(300)
            .attr(
              'd',
              d3
                .arc<d3.PieArcDatum<VaccinePerSex>>()
                .innerRadius(RADIUS * 0.6)
                .outerRadius(RADIUS)
            )
        }
      }

      const updateDonut = () => {
        const pie = d3
          .pie<VaccinePerSex>()
          .sort(null)
          .value(d => d.count)

        const arc = d3
          .arc<d3.PieArcDatum<VaccinePerSex>>()
          .innerRadius(RADIUS * 0.6)
          .outerRadius((_, i, j) => (d3.select(j[i]).classed('clicked') ? RADIUS * 1.1 : RADIUS))

        const arcs = g
          .selectAll('path')
          .data(pie(vaccineCountPerSex))
          .enter()
          .append('path')
          .attr('d', arc)
          .attr('fill', d => d.data.color)
          .attr('stroke', '#36393A')
          .style('stroke-width', '1px')
          .style('cursor', 'pointer')

        arcs.exit().remove()
      }

      g
        .append('circle')
        .attr('r', RADIUS * 0.55)
        .attr('fill', '#36393A')
        .style('cursor', 'pointer')

      updateDonut()
    }
  }, [status])

  return (
    <div className="page">
      <div className="page-title">COVID-19 (Belgium)</div>
      {status === 'pending' && <IndeterminateProgressBar />}
      {status === 'success' && <svg ref={svgContext} className='upload-counts' />}
    </div>
  )
}