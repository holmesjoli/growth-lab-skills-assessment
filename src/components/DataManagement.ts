import { Edges } from '../types';

// Adds the positions from the nodes to each of the edges
export function addLinkPosition(data: any) {
    let edges: Edges[] = [];
    for (let e of data.edges) {

    let source = data.nodes.find((d: any) => d.productId === e.source);
    let target = data.nodes.find((d: any) => d.productId === e.target);

    edges.push({'source': {'productId': e.source,
                            'x': source.x,
                            'y': source.y},
                'target': {'productId': e.target,
                            'x': target.x,
                            'y': target.y
                } 
                })
    }

    return edges;
}
