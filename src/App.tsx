// Libraries
import { useEffect } from 'react';

import './App.css';
import metaData from './data/metadata.json';
import networkData from './data/network.json';

import { NetworkData } from './types';

// Components
import { initViz, initNodes, initLinks, initTooltip } from './components/Network';
import { addLinkPosition } from './components/DataManagement';

// Data management
let networkDataNew: NetworkData = {nodes: [], 
                                   edges: []
                                  };

networkDataNew.nodes = networkData.nodes.filter(d => d.x && d.y); // filter out null values
networkDataNew.edges = addLinkPosition(networkData);

// Constants
const selector = "Visualization";

function App() {

  useEffect(() => {

    initViz(selector);
    initLinks(selector, networkDataNew);
    initNodes(selector, networkDataNew, metaData.productHs92);
    initTooltip(selector, networkDataNew, metaData.productHs92);

  }, [])

  return (
    <div className="App">
      <div id={selector}>
      </div>
    </div>
  );
}

export default App;
