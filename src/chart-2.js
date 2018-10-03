import * as d3 from 'd3'

// Set up margin/height/width
var margin = { top: 30, left: 30, right: 20, bottom: 20 }

var height = 130 - margin.top - margin.bottom
var width = 110 - margin.left - margin.right
// I'll give you the container
var container = d3.select('#chart-2')

// Create your scales

let xPositionScale = d3
  .scaleLinear()
  .domain([10, 50])
  .range([0, width])

let yPositionScale = d3
  .scaleLinear()
  .domain([0, 0.3])
  .range([height, 0])

// Create a d3.line function that uses your scales

var area = d3
  .area()
  .x(d => xPositionScale(d.Age))
  .y0(height)

// Read in your data

d3.csv(require('./fertility.csv'))
  .then(ready)
  .catch(err => {
    console.log(err)
  })

// Build your ready function that draws lines, axes, etc
function ready(datapoints) {
  var nested = d3
    .nest()
    .key(d => d.Year)
    .entries(datapoints)

  container
    .selectAll('.usvjap')
    .data(nested)
    .enter()
    .append('svg')
    .attr('class', 'usvjap')
    .attr('height', height + margin.top + margin.bottom)
    .attr('width', width + margin.left + margin.right)
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`)
    .each(function(d) {
      var svg = d3.select(this)

      // Jap area
      area.y1(d => yPositionScale(d.ASFR_jp))
      svg
        .append('path')
        .datum(d.values)
        .attr('d', area)
        .attr('fill', 'red')
        .attr('opacity', 0.5)

      // US area
      area.y1(d => yPositionScale(d.ASFR_us))
      svg
        .append('path')
        .datum(d.values)
        .attr('d', area)
        .attr('fill', 'blue')
        .attr('opacity', 0.5)
        .lower()

      // Add the year above each chart
      svg
        .append('text')
        .text(d.key)
        .attr('text-anchor', 'middle')
        .attr('x', width / 2)
        .attr('dy', -10)

      var datapoints = d.values
      var jpList = datapoints.map(d => +d.ASFR_jp)
      var usList = datapoints.map(d => +d.ASFR_us)

      // Japanese fertility numbers
      svg
        .append('text')
        .datum('datapoints')
        .attr('x', width)
        .text(d3.sum(jpList).toFixed(2))
        .attr('dy', 10)
        .attr('dx', -5)
        .attr('font-size', 8)
        .attr('fill', 'red')
        .attr('text-anchor', 'end')

      // US fertility numbers
      svg
        .append('text')
        .datum('datapoints')
        .text(d3.sum(usList).toFixed(2))
        .attr('dy', 22)
        .attr('dx', -5)
        .attr('x', width)
        .attr('font-size', 8)
        .attr('fill', 'blue')
        .attr('text-anchor', 'end')

      // Add your axes
      var xAxis = d3
        .axisBottom(xPositionScale)
        .tickValues([10, 30, 50])
        .tickSize(-height)

      svg
        .append('g')
        .attr('class', 'axis x-axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis)
        .style('stroke-dasharray', '2, 2')
        .lower()

      svg.selectAll('.x-axis path').remove()

      var yAxis = d3
        .axisLeft(yPositionScale)
        .ticks(3)
        .tickSize(-width)

      svg
        .append('g')
        .attr('class', 'axis y-axis')
        .call(yAxis)
        .style('stroke-dasharray', '2, 2')
        .lower()


      svg.selectAll('.y-axis path').remove()
    })
}

export { xPositionScale, yPositionScale, width, height }
