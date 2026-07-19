import { navigationNodes, graphEdges } from "./map-data";

export interface Point {
    x: number;
    y: number;
}

export class CampusRouter {
    private adjacencyList: Map<string, { node: string; weight: number }[]> = new Map();

    constructor() {
        this.buildGraph();
    }

    private buildGraph() {
        // Initialize adjacency list
        Object.keys(navigationNodes).forEach(id => {
            this.adjacencyList.set(id, []);
        });

        // Add edges (undirected)
        graphEdges.forEach(([u, v]) => {
            const nodeU = navigationNodes[u];
            const nodeV = navigationNodes[v];

            if (nodeU && nodeV) {
                // Calculate physical straight line distance as edge weight
                const dx = nodeU.x - nodeV.x;
                const dy = nodeU.y - nodeV.y;
                const weight = Math.sqrt(dx * dx + dy * dy);

                this.adjacencyList.get(u)?.push({ node: v, weight });
                this.adjacencyList.get(v)?.push({ node: u, weight }); // undirected
            }
        });
    }

    /**
     * Computes the shortest path from start to end using Dijkstra's Algorithm
     */
    public findShortestPath(startId: string, endId: string): Point[] {
        if (!this.adjacencyList.has(startId) || !this.adjacencyList.has(endId)) {
            return [];
        }

        const distances = new Map<string, number>();
        const previous = new Map<string, string | null>();
        const unvisited = new Set<string>();

        // Initialization
        this.adjacencyList.forEach((_, nodeId) => {
            distances.set(nodeId, Infinity);
            previous.set(nodeId, null);
            unvisited.add(nodeId);
        });
        distances.set(startId, 0);

        while (unvisited.size > 0) {
            // Find node with minimum distance
            let currentStr: string | null = null;
            let minDistance = Infinity;

            unvisited.forEach(nodeId => {
                const dist = distances.get(nodeId)!;
                if (dist < minDistance) {
                    minDistance = dist;
                    currentStr = nodeId;
                }
            });

            if (currentStr === null || currentStr === endId) {
                break; // Target reached or unreachable nodes left
            }

            unvisited.delete(currentStr);

            const neighbors = this.adjacencyList.get(currentStr) || [];
            for (const neighbor of neighbors) {
                if (unvisited.has(neighbor.node)) {
                    const newDist = distances.get(currentStr)! + neighbor.weight;
                    if (newDist < distances.get(neighbor.node)!) {
                        distances.set(neighbor.node, newDist);
                        previous.set(neighbor.node, currentStr);
                    }
                }
            }
        }

        // Reconstruct path
        const path: string[] = [];
        let curr: string | null = endId;
        
        while (curr !== null) {
            path.unshift(curr);
            curr = previous.get(curr)!;
        }

        // If start node isn't first, path doesn't exist
        if (path[0] !== startId) {
            return [];
        }

        return path.map(id => ({ x: navigationNodes[id].x, y: navigationNodes[id].y }));
    }
}

export const campusRouter = new CampusRouter();
