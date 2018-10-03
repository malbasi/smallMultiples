import * as d3 from 'd3'

// Create your margins and height/width
var margin = { top: 30, left: 40, right: 20, bottom: 20 }

var height = 250 - margin.top - margin.bottom
var width = 150 - margin.left - margin.right
// I'll give you this part!
var container = d3.select('#chart-3')

// Create your scales
let xPositionScale = d3
  .scaleLinear()
  .domain([1980, 2010])
  .range([0, width])

let yPositionScale = d3
  .scaleLinear()
  .domain([0, 20000])
  .range([height, 0])

// Create your line generator
var line = d3
  .line()
  .x(d => xPositionScale(d.year))
  .y(d => yPositionScale(d.income))

// Read in your data
Promise.all([
  d3.csv(require('./middle-class-income.csv')),
  d3.csv(require('./middle-class-income-usa.csv'))
])
  .then(ready)
  .catch(err => {
    console.log(err)
  })

// Create your ready function

function ready([worldDatapoints, usaDatapoints]) {
  var nested = d3
    .nest()
    .key(d => d.country)
    .entries(worldDatapoints)

  container
    .selectAll('.middleClass')
    .data(nested)
    .enter()
    .append('svg')
    .attr('class', 'middleClass')
    .attr('height', height + margin.top + margin.bottom)
    .attr('width', width + margin.left + margin.right)
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`)
    .each(function(d) {
      var svg = d3.select(this)

      let datapoints = d.values
      // console.log(datapoints)

      // add world lines
      svg
        .append('path')
        .datum(datapoints)
        .attr('d', line)
        .attr('stroke', 'darkred')
        .attr('stroke-width', 2)
        .attr('fill', 'none')

      // add text of each country
      svg
        .append('text')
        .datum(datapoints)
        .text(d.key)
        .attr('x', d => xPositionScale(1995))
        .attr('y', d => yPositionScale(d[3].income))
        .attr('dy', 25)
        .attr('dx', 10)
        .attr('font-size', 12)
        .attr('alignment-baseline', 'bottom')
        .attr('text-anchor', 'middle')
        .attr('font-weight', 'bold')

      // add USA line
      svg
        .append('path')
        .datum(usaDatapoints)
        .attr('d', line)
        .attr('stroke', 'lightgrey')
        .attr('stroke-width', 2)
        .attr('fill', 'none')

      // and 'U.S.A.' to each USA line
      svg
        .append('text')
        .text('USA')
        .attr('x', 20)
        .attr('y', 25)
        .attr('font-size', 12)
        .attr('alignment-baseline', 'bottom')
        .attr('text-anchor', 'middle')
        .attr('fill', 'lightgrey')

      // Add your axes
      var xAxis = d3
        .axisBottom(xPositionScale)
        .tickValues([1980, 1990, 2000, 2010])
        .tickSize(0)
        .tickFormat(d3.format("d"))

      svg
        .append('g')
        .attr('class', 'axis x-axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis)

      var formatComma = d3.format(",")

      var yAxis = d3
        .axisLeft(yPositionScale)
        .ticks(4)
        .tickSize(-width)
        .tickFormat(d => '$' + formatComma(d))
        .tickValues([5000, 10000, 15000, 20000])

      svg
        .append('g')
        .attr('class', 'axis y-axis')
        .call(yAxis)
        .style('stroke-dasharray', '2, 2')
        .lower()


      // console.log("this is D", d)
    })
}
export {
  xPositionScale,
  yPositionScale,
  line,
  width,
  height,
}
