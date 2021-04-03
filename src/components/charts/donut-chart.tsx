import React, { FC, useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import { getStringPercentage, numberWithCommas } from '@src/utils/numbers'
import '@styles/pages/pages.css'

export interface DataDonutChart {
  item: string
  count: number
  color: string
  fullItem: string
}

interface Props {
  data: DataDonutChart[]
}

export const DonutChart: FC<Props> = (props: Props) => {
  const { data } = props

  const svgContext = useRef<null | SVGSVGElement>(null)

  const WIDTH = 600
  const HEIGHT = 300
  const MARGIN_X = 24
  const MARGIN_Y = 32
  const RADIUS = Math.min(WIDTH, HEIGHT) / 2 - Math.min(MARGIN_X, MARGIN_Y)
  const LEGEND_GAP = 20
  const CHART_TITLE = 'Total'

  const getTotal = (d: DataDonutChart[]) => {
    return d.reduce((prev, current) => prev + current.count, 0)
  }

  const pie = d3
    .pie<DataDonutChart>()
    .sort(null)
    .value(d => d.count)

  const arc = d3
    .arc<d3.PieArcDatum<DataDonutChart>>()
    .innerRadius(RADIUS * 0.6)
    .outerRadius((_, i, j) =>
      d3
        .select(j[i])
        .classed('clicked') ? RADIUS * 1.1 : RADIUS
    )

  const pathAnimation = (path: d3.Selection<d3.BaseType, unknown, null, undefined>, emphasize: boolean) => {
    if (emphasize) {
      path.transition().attr(
        'd',
        d3
          .arc<d3.PieArcDatum<DataDonutChart>>()
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
            .arc<d3.PieArcDatum<DataDonutChart>>()
            .innerRadius(RADIUS * 0.6)
            .outerRadius(RADIUS)
        )
    }
  }

  useEffect(() => {
    const total = getTotal(data)

    let selectedData: DataDonutChart | null = null

    const context = d3
      .select(svgContext.current)
      .attr('width', WIDTH)
      .attr('height', HEIGHT)

    const g = context
      .append('g')
      .attr('transform', `translate(${RADIUS + MARGIN_X}, ${RADIUS + MARGIN_Y})`)

    const updateDonut = () => {
      const arcs = g
        .selectAll('path')
        .data(pie(data))
        .enter()
        .append('path')
        .attr('class', d => d.data.item)
        .attr('d', arc)
        .attr('fill', d => d.data.color)
        .attr('stroke', '#36393A')
        .style('stroke-width', '1px')
        .style('cursor', 'pointer')
        .on('mouseover', event => {
          const target = event.target || event.srcElement
          const path = d3
            .select(target)

          if (!path.classed('clicked')) pathAnimation(path, true)
        })
        .on('mouseout', event => {
          const target = event.target || event.srcElement
          const path = d3
            .select(target)

          if (!path.classed('clicked')) pathAnimation(path, false)
        })
        .on('click', (event, d) => {
          const target = event.target || event.srcElement
          const path = d3
            .select(target)

          const clicked = path.classed('clicked')
          pathAnimation(path, !clicked)

          if (!clicked) {
            const oldPath = d3
              .select(svgContext.current)
              .select('.clicked')
            if (oldPath.node()) {
              pathAnimation(oldPath, false)
              oldPath.classed('clicked', false)
            }
          }

          path.classed('clicked', !clicked)

          if (selectedData?.item === d.data.item) {
            selectedData = null
          } else {
            selectedData = d.data
          }

          d3
            .select(svgContext.current)
            .select('.chart-title')
            .text(selectedData ? selectedData.fullItem : CHART_TITLE)
            .transition()
            .attr('y', selectedData ? -16 : -8)

          d3
            .select(svgContext.current)
            .select('.chart-subtitle-1')
            .text(numberWithCommas(selectedData ? selectedData.count : total))
            .transition()
            .attr('y', selectedData ? 8 : 16)

          let percentage = ''
          if (selectedData) percentage = getStringPercentage(selectedData.count / total * 100)

          d3
            .select(svgContext.current)
            .select('.chart-subtitle-2')
            .text(percentage)
            .transition()
            .attr('y', selectedData ? 28 : 36)

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
        const oldPath = d3
          .select(svgContext.current)
          .select('.clicked')
        if (oldPath.node()) {
          pathAnimation(oldPath, false)
          oldPath.classed('clicked', false)
        }

        d3
          .select(svgContext.current)
          .select('.chart-title')
          .text(CHART_TITLE)
          .transition()
          .attr('y', -8)

        d3
          .select(svgContext.current)
          .select('.chart-subtitle-1')
          .text(numberWithCommas(total))
          .transition()
          .attr('y', 16)

        d3
          .select(svgContext.current)
          .select('.chart-subtitle-2')
          .text('')
          .transition()
          .attr('y', 36)

        selectedData = null
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
      .data(data)
      .enter()
      .append('g')
      .attr('transform', (_, i) => `translate(${RADIUS + MARGIN_X * 2}, ${-RADIUS + MARGIN_Y / 2 + i * LEGEND_GAP})`)
      .style('cursor', 'pointer')
      .on('mouseover', (_, d) => {
        const path = d3
          .select(svgContext.current)
          .select(`.${d.item}`)
        if (!path.classed('clicked')) pathAnimation(path, true)
      })
      .on('mouseout', (_, d) => {
        const path = d3
          .select(svgContext.current)
          .select(`.${d.item}`)
        if (!path.classed('clicked')) pathAnimation(path, false)
      })
      .on('click', (_, d) => {
        const path = d3
          .select(svgContext.current)
          .select(`.${d.item}`)
        const clicked = path.classed('clicked')
        pathAnimation(path, !clicked)

        if (!clicked) {
          const oldPath = d3
            .select(svgContext.current)
            .select('.clicked')
          if (oldPath.node()) {
            pathAnimation(oldPath, false)
            oldPath.classed('clicked', false)
          }
        }

        path.classed('clicked', !clicked)

        if (selectedData?.item === d.item) {
          selectedData = null
        } else {
          selectedData = d
        }

        d3
          .select(svgContext.current)
          .select('.chart-title')
          .text(selectedData ? selectedData.fullItem : CHART_TITLE)
          .transition()
          .attr('y', selectedData ? -16 : -8)

        d3
          .select(svgContext.current)
          .select('.chart-subtitle-1')
          .text(numberWithCommas(selectedData ? selectedData.count : total))
          .transition()
          .attr('y', selectedData ? 8 : 16)

        let percentage = ''
        if (selectedData) percentage = getStringPercentage(selectedData.count / total * 100)

        d3
          .select(svgContext.current)
          .select('.chart-subtitle-2')
          .text(percentage)
          .transition()
          .attr('y', selectedData ? 28 : 36)

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
      .text(d => d.fullItem)
  }, [])

  return (
    <svg ref={svgContext} />
  )
}