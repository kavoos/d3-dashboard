import React, { FC, useEffect, useRef } from 'react'
import * as d3 from 'd3'
import { useAsync } from '@src/hooks/use-async'
import '@styles/pages/pages.css'
import { IndeterminateProgressBar } from '@src/components/progress-bar/indeterminate-progress-bar'

const URL_COVID19BE_VACC = 'https://epistat.sciensano.be/Data/COVID19BE_VACC.csv'

type Gender = 'F' | 'M' | 'NA'
type Dose = 'A' | 'B'

interface VaccinePerGender {
  gender: Gender
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

  const getVaccineCountPerGender = (d: d3.DSVRowArray<string>, dose: Dose) => {
    const genders: Gender[] = ['F', 'M', 'NA']
    const colors = [
      '#ef9a9a',
      '#F48FB1',
      '#CE93D8',
      '#B39DDB',
      '#9FA8DA',
      '#90CAF9',
      '#81D4FA',
      '#80DEEA',
      '#80CBC4',
      '#A5D6A7',
      '#C5E1A5',
      '#E6EE9C',
      '#FFF59D',
      '#FFE082',
      '#FFCC80',
      '#FFAB91',
      '#BCAAA4',
      '#EEEEEE',
      '#B0BEC5'
    ]
    const vaccineCountPerGender: VaccinePerGender[] = []
    genders.forEach((g, i) => {
      const r: VaccinePerGender = {
        gender: g,
        count: 0,
        color: colors[Math.ceil(colors.length / genders.length) * i]
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

  const numberWithCommas = (n: number) => {
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

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

  const getStringPercentage = (n: number) => {
    return `(${n.toFixed(2)}%)`
  }

  useEffect(() => {
    if (data) {
      const parsedData = d3.csvParse(data)
      const vaccineCountPerGender = getVaccineCountPerGender(parsedData, 'A')
      const total = vaccineCountPerGender.reduce((prev, current) => prev + current.count, 0)

      let selectedGender: VaccinePerGender | null = null

      const WIDTH = 600
      const HEIGHT = 300
      const MARGIN_X = 24
      const MARGIN_Y = 32
      const RADIUS = Math.min(WIDTH, HEIGHT) / 2 - Math.min(MARGIN_X, MARGIN_Y)
      const LEGEND_GAP = 20

      const CHART_TITLE = 'Total'

      const context = d3
        .select(svgContext.current)
        .attr('width', WIDTH)
        .attr('height', HEIGHT)

      const g = context
        .append('g')
        .attr('transform', `translate(${RADIUS + MARGIN_X}, ${RADIUS + MARGIN_Y})`)

      const pathAnimation = (path: any, emphasize: boolean) => {
        if (emphasize) {
          path.transition().attr(
            'd',
            d3
              .arc<d3.PieArcDatum<VaccinePerGender>>()
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
                .arc<d3.PieArcDatum<VaccinePerGender>>()
                .innerRadius(RADIUS * 0.6)
                .outerRadius(RADIUS)
            )
        }
      }

      const updateDonut = () => {
        const pie = d3
          .pie<VaccinePerGender>()
          .sort(null)
          .value(d => d.count)

        const arc = d3
          .arc<d3.PieArcDatum<VaccinePerGender>>()
          .innerRadius(RADIUS * 0.6)
          .outerRadius((_, i, j) => (d3.select(j[i]).classed('clicked') ? RADIUS * 1.1 : RADIUS))

        const arcs = g
          .selectAll('path')
          .data(pie(vaccineCountPerGender))
          .enter()
          .append('path')
          .attr('class', d => d.data.gender)
          .attr('d', arc)
          .attr('fill', d => d.data.color)
          .attr('stroke', '#36393A')
          .style('stroke-width', '1px')
          .style('cursor', 'pointer')
          .on('mouseover', event => {
            const target = event.target || event.srcElement
            const path = d3.select(target)
            if (!path.classed('clicked')) pathAnimation(path, true)
          })
          .on('mouseout', event => {
            const target = event.target || event.srcElement
            const path = d3.select(target)
            if (!path.classed('clicked')) pathAnimation(path, false)
          })
          .on('click', (event, d) => {
            const target = event.target || event.srcElement
            const path = d3.select(target)
            const clicked = path.classed('clicked')
            pathAnimation(path, !clicked)

            if (!clicked) {
              const oldPath = d3.select('.clicked')
              if (oldPath.node()) {
                pathAnimation(oldPath, false)
                oldPath.classed('clicked', false)
              }
            }

            path.classed('clicked', !clicked)


            if (selectedGender?.gender === d.data.gender) {
              selectedGender = null
            } else {
              selectedGender = d.data
            }

            d3
              .select('.chart-title')
              .text(selectedGender ? displayGender(selectedGender.gender) : CHART_TITLE)
              .transition()
              .attr('y', selectedGender ? -16 : -8)

            d3
              .select('.chart-subtitle-1')
              .text(numberWithCommas(selectedGender ? selectedGender.count : total))
              .transition()
              .attr('y', selectedGender ? 8 : 16)

            let percentage = ''
            if (selectedGender) percentage = getStringPercentage(selectedGender.count / total * 100)

            d3
              .select('.chart-subtitle-2')
              .text(percentage)
              .transition()
              .attr('y', selectedGender ? 28 : 36)

            updateDonut()
          })

        arcs.exit().remove()
      }

      g
        .append('circle')
        .attr('r', RADIUS * 0.55)
        .attr('fill', '#36393A')
        .style('cursor', 'pointer')
        .on('click', () => {
          const oldPath = d3.select('.clicked')
          if (oldPath.node()) {
            pathAnimation(oldPath, false)
            oldPath.classed('clicked', false)
          }

          d3
            .select('.chart-title')
            .text(CHART_TITLE)
            .transition()
            .attr('y', -8)

          d3
            .select('.chart-subtitle-1')
            .text(numberWithCommas(total))
            .transition()
            .attr('y', 16)

          d3
            .select('.chart-subtitle-2')
            .text('')
            .transition()
            .attr('y', 36)

          selectedGender = null

          updateDonut()
        })

      g
        .append('text')
        .attr('class', 'chart-title')
        .attr('pointer-events', 'none')
        .attr('y', -8)
        .attr('text-anchor', 'middle')
        .style('font-weight', '300')
        .attr('font-size', '14px')
        .attr('fill', '#F9DCE1')
        .text(CHART_TITLE)

      g
        .append('text')
        .attr('class', 'chart-subtitle-1')
        .attr('pointer-events', 'none')
        .attr('y', 16)
        .attr('text-anchor', 'middle')
        .style('font-weight', '300')
        .attr('font-size', '16px')
        .attr('fill', '#F9DCE1')
        .text(numberWithCommas(total))

      g
        .append('text')
        .attr('class', 'chart-subtitle-2')
        .attr('pointer-events', 'none')
        .attr('y', 36)
        .attr('text-anchor', 'middle')
        .style('font-weight', '300')
        .attr('font-size', '12px')
        .attr('fill', '#F9DCE1')
        .text('')

      updateDonut()

      const legend = g
        .append('g')
        .attr('class', 'legend')
        .selectAll('g')
        .data(vaccineCountPerGender)
        .enter()
        .append('g')
        .attr('transform', (_, i) => `translate(${RADIUS + MARGIN_X * 2}, ${-RADIUS + MARGIN_Y / 2 + i * LEGEND_GAP})`)
        .style('cursor', 'pointer')
        .on('mouseover', (_, d) => {
          const path = d3.select(`.${d.gender}`)
          if (!path.classed('clicked')) pathAnimation(path, true)
        })
        .on('mouseout', (_, d) => {
          const path = d3.select(`.${d.gender}`)
          if (!path.classed('clicked')) pathAnimation(path, false)
        })
        .on('click', (_, d) => {
          const path = d3.select(`.${d.gender}`)
          const clicked = path.classed('clicked')
          pathAnimation(path, !clicked)

          if (!clicked) {
            const oldPath = d3.select('.clicked')
            if (oldPath.node()) {
              pathAnimation(oldPath, false)
              oldPath.classed('clicked', false)
            }
          }

          path.classed('clicked', !clicked)

          if (selectedGender?.gender === d.gender) {
            selectedGender = null
          } else {
            selectedGender = d
          }

          d3
            .select('.chart-title')
            .text(selectedGender ? displayGender(selectedGender.gender) : CHART_TITLE)
            .transition()
            .attr('y', selectedGender ? -16 : -8)

          d3
            .select('.chart-subtitle-1')
            .text(numberWithCommas(selectedGender ? selectedGender.count : total))
            .transition()
            .attr('y', selectedGender ? 8 : 16)

          let percentage = ''
          if (selectedGender) percentage = getStringPercentage(selectedGender.count / total * 100)

          d3
            .select('.chart-subtitle-2')
            .text(percentage)
            .transition()
            .attr('y', selectedGender ? 28 : 36)

          updateDonut()
        })

      legend
        .append('circle')
        .attr('r', 8)
        .attr('rx', 18)
        .attr('fill', d => d.color)

      legend
        .append('text')
        .attr('x', 16)
        .attr('y', 0.75)
        .attr('text-anchor', 'start')
        .attr('alignment-baseline', 'middle')
        .attr('font-size', '12px')
        .attr('fill', '#F9DCE1')
        .text(d => displayGender(d.gender))
    }
  }, [status])

  return (
    <div className="page">
      <div className="page-title">COVID-19 (Belgium)</div>
      {status === 'pending' && <IndeterminateProgressBar />}
      {status === 'success' &&
        <div className="page-block" style={{ width: 450 }}>
          <div className="page-subtitle-1">Vaccinated people by gender</div>
          <div className="page-subtitle-2">At least 1 dose</div>
          <svg ref={svgContext} className='vaccine-a-count-per-gender' />
        </div>
      }
    </div>
  )
}