import networkx as nx
from typing import List, Optional, Tuple
from ..models.track import Track, TrackElement, TrackGraph, ElementType

class TrackService:
    """Service for converting tracks to graphs and solving paths"""
    
    @staticmethod
    def track_to_graph(track: Track) -> TrackGraph:
        """Convert track elements to a directed graph"""
        G = nx.DiGraph()
        
        # Add nodes from track elements
        for element in track.elements:
            G.add_node(
                element.id,
                type=element.type,
                position=(element.position.x, element.position.y),
                rotation=element.rotation
            )
        
        # Add edges based on connections
        for element in track.elements:
            for connection_id in element.connections:
                G.add_edge(element.id, connection_id)
        
        # Find valid path from start to end
        valid_path = TrackService._find_valid_path(G, track.elements)
        
        # Convert to serializable format
        nodes = [
            {
                "id": node,
                "type": str(G.nodes[node].get("type", "")),
                "position": G.nodes[node].get("position", (0, 0)),
                "rotation": G.nodes[node].get("rotation", 0)
            }
            for node in G.nodes()
        ]
        
        edges = [
            {"source": u, "target": v}
            for u, v in G.edges()
        ]
        
        return TrackGraph(
            nodes=nodes,
            edges=edges,
            valid_path=valid_path
        )
    
    @staticmethod
    def _find_valid_path(G: nx.DiGraph, elements: List[TrackElement]) -> Optional[List[str]]:
        """Find a valid path from start to end, avoiding forbidden paths"""
        # Find start and end nodes
        start_nodes = [e.id for e in elements if e.type == ElementType.START]
        end_nodes = [e.id for e in elements if e.type == ElementType.END]
        forbidden_nodes = [e.id for e in elements if e.type == ElementType.FORBIDDEN_PATH]
        
        if not start_nodes or not end_nodes:
            return None
        
        start = start_nodes[0]
        end = end_nodes[0]
        
        # Create a copy of graph without forbidden nodes
        G_filtered = G.copy()
        for node in forbidden_nodes:
            if node != start and node != end:
                G_filtered.remove_node(node)
        
        try:
            path = nx.shortest_path(G_filtered, start, end)
            return path
        except nx.NetworkXNoPath:
            return None
        except nx.NodeNotFound:
            return None
    
    @staticmethod
    def analyze_track(track: Track) -> dict:
        """Analyze track and return statistics"""
        graph = TrackService.track_to_graph(track)
        
        element_counts = {}
        for element in track.elements:
            element_type = element.type
            element_counts[element_type] = element_counts.get(element_type, 0) + 1
        
        return {
            "element_count": len(track.elements),
            "element_types": element_counts,
            "has_valid_path": graph.valid_path is not None,
            "path_length": len(graph.valid_path) if graph.valid_path else 0
        }
