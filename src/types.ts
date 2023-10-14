export interface Attribute {
    productId: string;
    x: number | null;
    y: number | null;
}

export interface EdgeAttribute {
    target: string;
    source: string;
}

export interface Edges {
    source: Attribute
    target: Attribute
}

export interface NetworkData {
    nodes: Attribute[],
    edges: Edges[]
}
