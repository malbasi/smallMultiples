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
  .x(d => xPositionScale(d.Age))
  .y0(height)

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
  container
    .append('svg')
    .attr('class', 'svg1951')
    .attr('height', height + margin.top + margin.bottom)
    .attr('width', width + margin.left + margin.right)
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`)

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
