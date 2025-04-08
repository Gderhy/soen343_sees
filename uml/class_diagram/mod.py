import xml.etree.ElementTree as ET

# Load and parse the draw.io file
tree = ET.parse("Class_Diagram_343.drawio")
root = tree.getroot()

# Find the mxGraphModel and its root element
mxGraphModel = root.find(".//mxGraphModel")
graph_root = mxGraphModel.find("root")

# Collect boxes and edges
boxes = []
edges = []

for cell in graph_root.findall("mxCell"):
    # Identify edge cells: they have attribute edge="1"
    if cell.get("edge") == "1":
        edges.append(cell)
    else:
        # Consider cells with a geometry element that has an x coordinate as boxes
        geometry = cell.find("mxGeometry")
        if geometry is not None and geometry.get("x") is not None:
            boxes.append(cell)

# Define spacing parameters
padding = 20
# For simplicity, assume all boxes are roughly the same size;
# if not, we may need to compute each box's size.
default_box_width = 120
default_box_height = 60

# Sort boxes by id (or any order you wish)
boxes.sort(key=lambda c: c.get("id"))

# Arrange boxes in a grid (here, for example, 3 columns)
num_columns = 3
for idx, box in enumerate(boxes):
    row = idx // num_columns
    col = idx % num_columns
    
    # Compute new coordinates
    new_x = col * (default_box_width + padding)
    new_y = row * (default_box_height + padding)
    
    # Update the geometry attributes for the box
    geometry = box.find("mxGeometry")
    geometry.set("x", str(new_x))
    geometry.set("y", str(new_y))
    # Optionally, set width and height if they are missing
    if geometry.get("width") is None:
        geometry.set("width", str(default_box_width))
    if geometry.get("height") is None:
        geometry.set("height", str(default_box_height))

# Re-route edges:
# For each edge, adjust the geometry to connect the center of source and target boxes
for edge in edges:
    source_id = edge.get("source")
    target_id = edge.get("target")
    
    # Find corresponding boxes
    source_box = graph_root.find(f"mxCell[@id='{source_id}']")
    target_box = graph_root.find(f"mxCell[@id='{target_id}']")
    
    if source_box is None or target_box is None:
        continue
    
    source_geo = source_box.find("mxGeometry")
    target_geo = target_box.find("mxGeometry")
    
    # Compute centers
    sx = float(source_geo.get("x", "0")) + float(source_geo.get("width", str(default_box_width)))/2
    sy = float(source_geo.get("y", "0")) + float(source_geo.get("height", str(default_box_height)))/2
    tx = float(target_geo.get("x", "0")) + float(target_geo.get("width", str(default_box_width)))/2
    ty = float(target_geo.get("y", "0")) + float(target_geo.get("height", str(default_box_height)))/2
    
    # Get the geometry element of the edge and clear any existing routing points.
    edge_geo = edge.find("mxGeometry")
    # Remove any child elements (like mxPoint)
    for child in list(edge_geo):
        edge_geo.remove(child)
        
    # Set a new geometry for a straight line (or you could add waypoints for a curved route)
    # One simple approach: set the relative flag to 0 and add a new element for the line
    edge_geo.set("relative", "0")
    
    # For more complex routing, you could add intermediate mxPoint elements here
    # This example just uses a straight line from source center to target center
    # (Draw.io will automatically handle snapping to the border of boxes)
    
# Save the modified file
tree.write("Class_Diagram_343_reorganized.drawio", encoding="utf-8", xml_declaration=True)
print("Reorganized diagram saved as Class_Diagram_343_reorganized.drawio")