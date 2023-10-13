// Libraries
import { useEffect } from 'react';

import './App.css';
import metaData from './data/metadata.json';
import networkData from './data/network.json';

// Components
import { initViz, initNodes, initLinks, initTooltip } from './components/network';

// Data management
metaData = metaData.productHs92; // simplify object
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

function App() {

  useEffect(() => {

    initViz(selector);
    initLinks(selector, networkData);
    initNodes(selector, networkData, metaData);
    initTooltip(selector, metaData);

  }, [])

  return (
    <div className="App">
      <div id={selector}>
      </div>
    </div>
  );
}

export default App;
