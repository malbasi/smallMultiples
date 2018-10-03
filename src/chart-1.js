import * as d3 from 'd3'

// Set up margin/height/width
var margin = { top: 50, left: 50, right: 150, bottom: 30 }

var height = 700 - margin.top - margin.bottom
var width = 600 - margin.left - margin.right

// Add your svg
var svg = d3
  .select('#chart-1')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', `translate(${margin.left},${margin.top})`)

// Create a time parser (see hints)
let parseTime = d3.timeParse('%B-%y')

// Create your scales
let xPositionScale = d3
  .scaleLinear()
  // .domain([0, 10])
  .range([0, width])

let yPositionScale = d3
  .scaleLinear()
  .domain([190, 330])
  .range([height, 0])

var colorScale = d3
  .scaleOrdinal()
  .range([
    '#8dd3c7',
    '#fccde5',
    '#bebada',
    '#fb8072',
    '#80b1d3',
    '#fdb462',
    '#b3de69',
    '#f80033',
    '#00576f',
    '#114444'
  ])

// Create a d3.line function that uses your scales
var line = d3
  .line()
  .x(d => xPositionScale(d.datetime))
  .y(d => yPositionScale(d.price))

// Read in your housing price data
d3.csv(require('./housing-prices.csv'))
  .then(ready)
  .catch(err => {
    console.log(err)
  })
// Write your ready function

function ready(datapoints) {
  // Convert your months to dates
  datapoints.forEach(d => {
    d.datetime = parseTime(d.month)
  })
  let dates = datapoints.map(d => +d.datetime)
  var prices = datapoints.map(d => d.price)

  xPositionScale.domain(d3.extent(dates))
  // Get a list of dates and a list of prices

  // Group your data together
  var nested = d3
    .nest()
    .key(d => d.region)
    .entries(datapoints)

  // Draw your lines
  svg
    .selectAll('.price-line')
    .data(nested)
    .enter()
    .append('path')
    .attr('class', 'price-line')
    .attr('d', d => line(d.values))
    .attr('stroke', d => colorScale(d.key))
    .attr('stroke-width', 2)
    .attr('fill', 'none')
    .lower()

  svg
    .selectAll('.end-circle')
    .data(nested)
    .enter()
    .append('circle')
    .attr('class', 'end-circle')
    .attr('r', 5)
    .attr('cx', d => xPositionScale(d.values[0].datetime))
    .attr('cy', d => yPositionScale(d.values[0].price))
    .attr('fill', d => colorScale(d.key))

  // Add your text on the right-hand side
  svg
    .selectAll('.region-text')
    .data(nested)
    .enter()
    .append('text')
    .attr('class', 'region-text')
    .text(d => d.key)
    .attr('x', d => xPositionScale(d.values[0].datetime))
    .attr('y', d => yPositionScale(d.values[0].price))
    .attr('alignment-baseline', 'middle')
    .attr('dx', 10)

  // Add your title

  svg
    .append('text')
    .text('U.S. Housing Prices Fall in Winter')
    .attr('x', width / 2)
    .attr('y', 0)
    .attr('font-size', 20)
    .attr('text-anchor', 'middle')
    .attr('dy', -20)

  // Add the shaded rectangle

  svg
    .data(nested)
    .append('rect')
    .attr('class', 'shaded-rect')
    .attr('height', height)
    .attr('width', d => xPositionScale(d.values[14].datetime))
    .attr('x', d => xPositionScale(d.values[7].datetime))
    .attr('y', 0)
    .attr('fill', 'lightgrey')
    .lower()

  // Add your axes
  var xAxis = d3.axisBottom(xPositionScale).tickFormat(d3.timeFormat('%b-%y'))
  svg
    .append('g')
    .attr('class', 'axis x-axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis)

  var yAxis = d3.axisLeft(yPositionScale)
  svg
    .append('g')
    .attr('class', 'axis y-axis')
    .call(yAxis)
}

export {
  xPositionScale,
  yPositionScale,
  colorScale,
  line,
  width,
  height,
  parseTime
}
