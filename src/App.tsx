// Libraries
import { useEffect } from 'react';

import './App.css';
import metaData from './data/metadata.json';
import networkData from './data/network.json';

// Components
import { initViz, initNodes, initLinks, initTooltip } from './components/network';
import { addLinkPosition } from './components/data_management';

// Data management
metaData = metaData.productHs92; // simplify object
networkData.nodes = networkData.nodes.filter(d => d.x && d.y); // filter out null values
networkData.edges = addLinkPosition(networkData)

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