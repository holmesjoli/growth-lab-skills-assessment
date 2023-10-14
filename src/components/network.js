// Libraries ----------------------------------------------
import * as d3 from 'd3';

// Data
import networkData from '../data/network.json';

// Constants ----------------------------------------------
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

const strokeColor = "#CCCCCC";
const strokeWidth = 1;

const highlightStrokeColor = "red";
const highlightStrokeWidth = 3;

// Scale functions ----------------------------------------------
let xScale = d3.scaleLinear()
  .domain(d3.extent(networkData.nodes, d => d.x))
  .range([margin.left, width - margin.right]);

let yScale = d3.scaleLinear()
  .domain(d3.extent(networkData.nodes, d => d.y))
  .range([height - margin.bottom, margin.top]);

// Functions ----------------------------------------------

// Filters source ids and returns corresponding target ids
function filterLinksSourceToTarget (data, ids) {

    let links = data.filter(d => ids.includes(d.source.productId) || ids.includes(d.target.productId));

    return links;
}

// Identify nodes and links to highlight
function identifyNodes (links) {
    const source = links.map(d => d.source.productId);
    const target = links.map(d => d.target.productId);
    const nodes = [...new Set(source.concat(target))];

    return nodes;
}

// Initializes the tooltip
export function initTooltip(selector, metaData) {

    let tooltip = d3.select(`#${selector}`)
        .append("div")
        .attr("class", "Tooltip");

    let connectedNodes;
    let connectedLinks;
  
    d3.selectAll(".node").on("mouseover", function (e, d) {
        var cx = xScale(d.x) + 20;
        var cy = yScale(d.y) - 10;

        let sector = metaData.find(e => e.productId === d.productId);

        tooltip
            .style("visibility", "visible")
            .style("left", cx + "px")
            .style("top", cy + "px")
            .html(`${sector.productName} (${sector.productCode})`);
  
        connectedLinks = filterLinksSourceToTarget(networkData.edges, [d.productId]);
        connectedNodes = identifyNodes(connectedLinks);

        connectedNodes.forEach(e => 
            d3.select(`#${e}`)
                .attr("stroke", highlightStrokeColor)
                .attr("stroke-width", highlightStrokeWidth)
        )

        connectedLinks.forEach(e => 
            d3.select(`#${e.source.productId}-${e.target.productId}`)
                .attr("stroke", highlightStrokeColor)
                .attr("stroke-width", highlightStrokeWidth)
            )
  
    }).on("mouseout", function () {

        tooltip
            .style("visibility", "hidden");

        connectedNodes.forEach(e => 
            d3.select(`#${e}`)
            .attr("stroke", strokeColor)
            .attr("stroke-width", strokeWidth)
        );

        connectedLinks.forEach(e => 
            d3.select(`#${e.source.productId}-${e.target.productId}`)
            .attr("stroke", strokeColor)
            .attr("stroke-width", strokeWidth)
        )

    });
}

//Initialize Network Nodes
export function initNodes (selector, networkData, metaData) {
  
    d3.select(`#${selector} svg`)
    .append("g")
      .selectAll("circle")
      .data(networkData.nodes)
      .enter()
      .append("circle")
      .attr("class", "node")
      .attr("id", d => d.productId)
      .attr("fill", function(d) {
        let sector = metaData.find(e => e.productId === d.productId).productSector.productId;
        return hs92ColorsMap.get(sector);
      })
      .attr("cx", d => xScale(d.x))
      .attr("cy", d => yScale(d.y))
      .attr("r", 4)
      .attr("stroke", strokeColor)
      .attr("stroke-width", strokeWidth)
      .attr("cursor", "pointer");
}
 
// Initalize Network Links (edges)
export function initLinks(selector, networkData) {

    d3.select(`#${selector} svg`)
    .append("g")
      .selectAll("lines")
      .data(networkData.edges)
      .enter()
      .append("line")
      .attr("class", "link")
      .attr("id", d => `${d.source.productId}-${d.target.productId}`)
      .attr("x1", d => xScale(d.source.x))
      .attr("y1", d => yScale(d.source.y))
      .attr("x2", d => xScale(d.target.x))
      .attr("y2", d => yScale(d.target.y))
      .attr("stroke", strokeColor)
      .attr("stroke-width", 1);
}
 
// Initialized the SVG
export function initViz(selector) {

    d3
      .select(`#${selector}`)
      .append("svg")
      .attr("width", width)
      .attr("height", height);
}
