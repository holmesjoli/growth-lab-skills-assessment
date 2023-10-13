// Libraries
import { useEffect } from 'react';
import * as d3 from 'd3';

import './App.css';
import metadata from './data/metadata.json';
import networkData from './data/network.json';

// Constants
const width = 800;
const height = 600;
const margin = {left: 50, right: 50, top: 50, bottom: 50}

let xScale = d3.scaleLinear()
  .domain(d3.extent(networkData.nodes, d => d.x))
  .range([margin.left, width - margin.right]);

let yScale = d3.scaleLinear()
  .domain(d3.extent(networkData.nodes, d => d.y))
  .range([height - margin.bottom, margin.top]);

function initNodes () {
  
  d3.select("#Visualization svg")
  .append("g")
    .selectAll("circle")
    .data(networkData.nodes)
    .enter()
    .append("circle")
    // .attr("fill", function(d) { return colorScale(d.zone); })
    .attr("cx", d => xScale(d.x))
    .attr("cy", d => yScale(d.y))
    .attr("r", '4px')
    .attr("stroke", "#CCCCCC")
    .attr("stroke-width", 1)
    .attr("cursor", "pointer");

}

function initViz() {

  d3
    .select("#Visualization")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  initNodes();
}

function App() {

  console.log(networkData)

  useEffect(() => {

    initViz();

  }, [])

  return (
    <div className="App">
      <div id="Visualization">
      </div>
    </div>
  );
}

export default App;
