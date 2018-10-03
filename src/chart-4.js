import * as d3 from 'd3'

// I'll give you margins/height/width
var margin = { top: 100, left: 10, right: 10, bottom: 30 }
var height = 500 - margin.top - margin.bottom
var width = 400 - margin.left - margin.right

// And grabbing your container
var container = d3.select('#chart-4')

// Create your scales
let xPositionScale = d3
  .scaleLinear()
  .domain([-6, 6])
  .range([0, width])

let yPositionScale = d3
  .scaleLinear()
  .range([height, 0])

// Create your area generator
var area = d3
  .area()
  .x(d => xPositionScale(d.key))
  .y0(height)
  .y1(d => yPositionScale(d.value))

// Read in your data, then call ready

d3.tsv(require('./climate-data.tsv'))
  .then(ready)
  .catch(err => {
    console.log(err)
  })

// Write your ready function
function ready(datapoints) {
  var through80s = datapoints.filter(function(d) {
    return d.year < 1980
  })
  
  var nested = d3
    .nest()
    .key(d => d.freq)
    .rollup(values => d3.median(values, v => v.diff))
    .entries(through80s)

  let dates = nested.map(d => +d.value)
  yPositionScale.domain(d3.extent(dates))

  container
    .append('svg')
    .attr('class', 'svg1951')
    .attr('height', height + margin.top + margin.bottom)
    .attr('width', width + margin.left + margin.right)
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`)
    .data(nested)
    .append('path')
    .attr('d', area)
    .attr('stroke', 'black')
    .attr('stroke-width', 2)
    .attr('fill', 'none')
    .lower()


  container
    .append('svg')
    .attr('class', 'svg1983')
    .attr('height', height + margin.top + margin.bottom)
    .attr('width', width + margin.left + margin.right)
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`)

  container
    .append('svg')
    .attr('class', 'svg1994')
    .attr('height', height + margin.top + margin.bottom)
    .attr('width', width + margin.left + margin.right)
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`)

  container
    .append('svg')
    .attr('class', 'svg2005')
    .attr('height', height + margin.top + margin.bottom)
    .attr('width', width + margin.left + margin.right)
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`)

}
