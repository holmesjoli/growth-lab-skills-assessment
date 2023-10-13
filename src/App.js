// Libraries
import { useEffect } from 'react';
import * as d3 from 'd3';

import './App.css';
import metadata from './data/metadata.json';
import networkData from './data/network.json';

// Data management
metadata = metadata.productHs92; // simplify object
networkData.nodes = networkData.nodes.filter(d => d.x && d.y); // filter out null values

let edges = []

for (let e of networkData.edges) {

  let source = networkData.nodes.find(d => d.productId === e.source);
  let target = networkData.nodes.find(d => d.productId === e.target);

  edges.push({'source': {'productID': e.source,
                         'x': source.x,
                          'y': source.y},
              'target': {'productID': e.target,
                         'x': target.x,
                         'y': target.y
              } 
            })
}

networkData.edges = edges

// Constants
const selector = "Visualization";
const width = 1000;
const height = 600;
const margin = {left: 50, right: 50, top: 50, bottom: 50}
const hs92ColorsMap = new Map([
  ['product-HS92-1', 'rgb(125, 218, 161)'],
  ['product-HS92-2', '#F5CF23'],
  ['product-HS92-3', 'rgb(218, 180, 125)'],
  ['product-HS92-4', 'rgb(187, 150, 138)'],
  ['product-HS92-5', 'rgb(217, 123, 123)'],
  ['product-HS92-6', 'rgb(197, 123, 217)'],
  ['product-HS92-7', 'rgb(141, 123, 216)'],
  ['product-HS92-8', 'rgb(123, 162, 217)'],
  ['product-HS92-9', 'rgb(125, 218, 218)'],
  ['product-HS92-10', '#2a607c'],
  ['product-HS92-14', 'rgb(178, 61, 109)'],
]);

// Scale functions

let xScale = d3.scaleLinear()
  .domain(d3.extent(networkData.nodes, d => d.x))
  .range([margin.left, width - margin.right]);

let yScale = d3.scaleLinear()
  .domain(d3.extent(networkData.nodes, d => d.y))
  .range([height - margin.bottom, margin.top]);

function initTooltip() {

  d3.select(`#${selector}`)
    .append("div")
    .attr("class", "Tooltip");
}

function addTooltip() {

  d3.selectAll(".node").on("mouseover", function (e, d) {
    var cx = xScale(d.x) + 20;
    var cy = yScale(d.y) - 10;

    let sector = metadata.find(e => e.productId === d.productId);

    d3.select(".Tooltip")
        .style("visibility", "visible")
        .style("left", cx + "px")
        .style("top", cy + "px")
        .html(`${sector.productName} (${sector.productCode})`);

    d3.select(this)
    .attr("stroke", "red")
    .attr("stroke-width", 3);

  }).on("mouseout", function () {
    d3.select(".Tooltip")
      .style("visibility", "hidden");

    d3.select(this)
    .attr("stroke", "#CCCCCC")
    .attr("stroke-width", 1);

  });
}

function initNodes () {

  d3.select(`#${selector} svg`)
  .append("g")
    .selectAll("circle")
    .data(networkData.nodes)
    .enter()
    .append("circle")
    .attr("class", "node")
    .attr("fill", function(d) {
      let sector = metadata.find(e => e.productId === d.productId).productSector.productId;
      return hs92ColorsMap.get(sector);
    })
    .attr("cx", d => xScale(d.x))
    .attr("cy", d => yScale(d.y))
    .attr("r", '4px')
    .attr("stroke", "#CCCCCC")
    .attr("stroke-width", 1)
    .attr("cursor", "pointer");
}

function initLinks() {
  d3.select(`#${selector} svg`)
  .append("g")
    .selectAll("lines")
    .data(networkData.edges)
    .enter()
    .append("line")
    .attr("x1", d => xScale(d.source.x))
    .attr("y1", d => yScale(d.source.y))
    .attr("x2", d => xScale(d.target.x))
    .attr("y2", d => yScale(d.target.y))
    .attr("stroke", "#CCCCCC")
    .attr("stroke-width", 1);
}

function initViz() {

  d3
    .select(`#${selector}`)
    .append("svg")
    .attr("width", width)
    .attr("height", height);
}

function App() {

  useEffect(() => {

    initViz();
    initLinks();
    initNodes();
    initTooltip();
    addTooltip();

  }, [])

  return (
    <div className="App">
      <div id={selector}>
      </div>
    </div>
  );
}

export default App;
