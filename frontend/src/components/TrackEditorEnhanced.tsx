import React, { useRef, useEffect, useState } from 'react';
import { TrackElement, ElementType, Point, LineType } from '../types';

interface TrackEditorEnhancedProps {
  elements: TrackElement[];
  onElementsChange: (elements: TrackElement[]) => void;
  width: number;
  height: number;
}

type Tool = 'select' | 'pan' | 'draw' | 'line';

const OBSTACLE_LINE_WIDTH_MULTIPLIER = 2;
const LINE_SELECTION_TOLERANCE = 10;

const TrackEditorEnhanced: React.FC<TrackEditorEnhancedProps> = ({ 
  elements, 
  onElementsChange, 
  width, 
  height 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedTool, setSelectedTool] = useState<Tool>('select');
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [selectedLineType, setSelectedLineType] = useState<LineType>(LineType.NORMAL);
  const [lineWidth, setLineWidth] = useState(5);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [drawingPoints, setDrawingPoints] = useState<Point[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [gridSize, setGridSize] = useState(50);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    drawCanvas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [elements, selectedElement, scale, offset, drawingPoints, showGrid]);

  const transformPoint = (x: number, y: number): Point => {
    return {
      x: (x - offset.x) / scale,
      y: (y - offset.y) / scale
    };
  };

  const screenToCanvas = (screenX: number, screenY: number): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const x = screenX - rect.left;
    const y = screenY - rect.top;
    return transformPoint(x, y);
  };

  const snapPoint = (point: Point): Point => {
    if (!snapToGrid) return point;
    return {
      x: Math.round(point.x / gridSize) * gridSize,
      y: Math.round(point.y / gridSize) * gridSize
    };
  };

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    ctx.save();
    ctx.translate(offset.x, offset.y);
    ctx.scale(scale, scale);

    // Draw grid
    if (showGrid) {
      ctx.strokeStyle = '#e0e0e0';
      ctx.lineWidth = 1 / scale;
      for (let x = 0; x < width / scale; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height / scale);
        ctx.stroke();
      }
      for (let y = 0; y < height / scale; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width / scale, y);
        ctx.stroke();
      }
    }

    // Draw elements
    elements.forEach(element => {
      drawElement(ctx, element, element.id === selectedElement);
    });

    // Draw current drawing
    if (drawingPoints.length > 0) {
      // Set style based on selected line type
      switch (selectedLineType) {
        case LineType.START:
          ctx.strokeStyle = '#4CAF50';
          break;
        case LineType.END:
          ctx.strokeStyle = '#F44336';
          break;
        case LineType.FORBIDDEN:
          ctx.strokeStyle = '#FF9800';
          ctx.setLineDash([10 / scale, 5 / scale]);
          break;
        case LineType.COLOR_ZONE:
          ctx.strokeStyle = '#2196F3';
          break;
        case LineType.OBSTACLE:
          ctx.strokeStyle = '#9E9E9E';
          break;
        default:
          ctx.strokeStyle = '#333';
      }
      
      ctx.lineWidth = lineWidth / scale;
      ctx.beginPath();
      ctx.moveTo(drawingPoints[0].x, drawingPoints[0].y);
      for (let i = 1; i < drawingPoints.length; i++) {
        ctx.lineTo(drawingPoints[i].x, drawingPoints[i].y);
      }
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw points
      drawingPoints.forEach(point => {
        ctx.fillStyle = '#2196F3';
        ctx.beginPath();
        ctx.arc(point.x, point.y, 3 / scale, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    ctx.restore();
  };

  const drawElement = (ctx: CanvasRenderingContext2D, element: TrackElement, isSelected: boolean) => {
    ctx.save();

    // Handle drawn lines (PATH type with points)
    if (element.type === ElementType.PATH && element.points && element.points.length > 1) {
      // Get line styling based on lineType
      const lineType = element.lineType || LineType.NORMAL;
      const lineWidth = element.lineWidth || 5;

      switch (lineType) {
        case LineType.START:
          ctx.strokeStyle = '#4CAF50';
          ctx.lineWidth = lineWidth / scale;
          break;
        case LineType.END:
          ctx.strokeStyle = '#F44336';
          ctx.lineWidth = lineWidth / scale;
          break;
        case LineType.FORBIDDEN:
          ctx.strokeStyle = '#FF9800';
          ctx.lineWidth = lineWidth / scale;
          ctx.setLineDash([10 / scale, 5 / scale]);
          break;
        case LineType.COLOR_ZONE:
          ctx.strokeStyle = element.color || '#2196F3';
          ctx.lineWidth = lineWidth / scale;
          break;
        case LineType.OBSTACLE:
          ctx.strokeStyle = '#9E9E9E';
          ctx.lineWidth = (lineWidth * OBSTACLE_LINE_WIDTH_MULTIPLIER) / scale;
          break;
        default:
          ctx.strokeStyle = '#333';
          ctx.lineWidth = lineWidth / scale;
      }

      // Draw the line
      ctx.beginPath();
      ctx.moveTo(element.points[0].x, element.points[0].y);
      for (let i = 1; i < element.points.length; i++) {
        ctx.lineTo(element.points[i].x, element.points[i].y);
      }
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw selection highlight
      if (isSelected) {
        ctx.strokeStyle = '#00BCD4';
        ctx.lineWidth = 3 / scale;
        ctx.setLineDash([5 / scale, 3 / scale]);
        ctx.beginPath();
        ctx.moveTo(element.points[0].x, element.points[0].y);
        for (let i = 1; i < element.points.length; i++) {
          ctx.lineTo(element.points[i].x, element.points[i].y);
        }
        ctx.stroke();
        ctx.setLineDash([]);
      }

      ctx.restore();
      return;
    }

    // Legacy element rendering for backward compatibility
    ctx.translate(element.position.x, element.position.y);
    ctx.rotate((element.rotation * Math.PI) / 180);

    // Set color based on type
    switch (element.type) {
      case ElementType.START:
        ctx.fillStyle = '#4CAF50';
        break;
      case ElementType.END:
        ctx.fillStyle = '#F44336';
        break;
      case ElementType.FORBIDDEN_PATH:
        ctx.fillStyle = '#FF9800';
        break;
      case ElementType.COLOR_ZONE:
        ctx.fillStyle = element.color || '#2196F3';
        break;
      case ElementType.OBSTACLE:
        ctx.fillStyle = '#9E9E9E';
        break;
      case ElementType.AREA_MARKER:
        ctx.fillStyle = element.color || 'rgba(100, 200, 100, 0.3)';
        break;
      default:
        ctx.fillStyle = '#333';
    }

    const w = element.width;
    const h = element.length || 100;

    // Draw based on type
    if (element.type === ElementType.CURVE && element.radius) {
      ctx.beginPath();
      ctx.arc(0, element.radius, element.radius, -Math.PI / 2, 0);
      ctx.lineWidth = w / scale;
      ctx.stroke();
    } else if (element.type === ElementType.OBSTACLE) {
      ctx.beginPath();
      ctx.arc(0, 0, w / 2, 0, Math.PI * 2);
      ctx.fill();
    } else if (element.type === ElementType.PATH && element.path_data) {
      // Draw SVG path
      const path = new Path2D(element.path_data);
      ctx.fill(path);
    } else if (element.type === ElementType.AREA_MARKER && element.points && element.points.length > 0) {
      // Draw polygon
      ctx.beginPath();
      ctx.moveTo(element.points[0].x - element.position.x, element.points[0].y - element.position.y);
      for (let i = 1; i < element.points.length; i++) {
        ctx.lineTo(element.points[i].x - element.position.x, element.points[i].y - element.position.y);
      }
      ctx.closePath();
      ctx.fill();
      
      // Draw label if present
      if (element.label) {
        ctx.fillStyle = '#000';
        ctx.font = `${12 / scale}px Arial`;
        ctx.fillText(element.label, 0, 0);
      }
    } else {
      ctx.fillRect(-w / 2, -h / 2, w, h);
    }

    // Draw selection highlight
    if (isSelected) {
      ctx.strokeStyle = '#00BCD4';
      ctx.lineWidth = 3 / scale;
      ctx.strokeRect(-w / 2 - 5, -h / 2 - 5, w + 10, h + 10);
    }

    ctx.restore();
  };

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const point = screenToCanvas(e.clientX, e.clientY);
    const snappedPoint = snapPoint(point);

    if (selectedTool === 'pan' || (e.button === 1)) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
      return;
    }

    if (selectedTool === 'select') {
      const clickedElement = elements.find(el => {
        if (el.type === ElementType.PATH && el.points && el.points.length > 1) {
          // Check if click is near any line segment
          for (let i = 0; i < el.points.length - 1; i++) {
            const p1 = el.points[i];
            const p2 = el.points[i + 1];
            const dist = distanceToLineSegment(point, p1, p2);
            if (dist < LINE_SELECTION_TOLERANCE) return true;
          }
          return false;
        } else {
          const dx = point.x - el.position.x;
          const dy = point.y - el.position.y;
          return Math.sqrt(dx * dx + dy * dy) < el.width;
        }
      });
      setSelectedElement(clickedElement ? clickedElement.id : null);
    } else if (selectedTool === 'draw' || selectedTool === 'line') {
      setIsDrawing(true);
      setDrawingPoints([...drawingPoints, snappedPoint]);
    }
  };

  const distanceToLineSegment = (point: Point, p1: Point, p2: Point): number => {
    const A = point.x - p1.x;
    const B = point.y - p1.y;
    const C = p2.x - p1.x;
    const D = p2.y - p1.y;

    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    let param = -1;
    if (lenSq !== 0) param = dot / lenSq;

    let xx, yy;

    if (param < 0) {
      xx = p1.x;
      yy = p1.y;
    } else if (param > 1) {
      xx = p2.x;
      yy = p2.y;
    } else {
      xx = p1.x + param * C;
      yy = p1.y + param * D;
    }

    const dx = point.x - xx;
    const dy = point.y - yy;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isPanning) {
      setOffset({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y
      });
    }
  };

  const handleCanvasMouseUp = () => {
    setIsPanning(false);
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newScale = Math.min(Math.max(scale * delta, 0.1), 5);
    setScale(newScale);
  };

  const finishDrawing = () => {
    if (drawingPoints.length > 1) {
      const newElement: TrackElement = {
        id: `element-${Date.now()}`,
        type: ElementType.PATH,
        position: drawingPoints[0],
        rotation: 0,
        width: lineWidth,
        points: drawingPoints,
        connections: [],
        lineType: selectedLineType,
        lineWidth: lineWidth
      };
      onElementsChange([...elements, newElement]);
    }
    setDrawingPoints([]);
    setIsDrawing(false);
  };

  const handleSVGImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const text = await file.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, 'image/svg+xml');
    
    const svgElement = doc.querySelector('svg');
    if (!svgElement) return;

    const paths = doc.querySelectorAll('path');
    const newElements: TrackElement[] = [];

    paths.forEach((path, index) => {
      const pathData = path.getAttribute('d');
      if (!pathData) return;

      const bbox = path.getBBox();
      newElements.push({
        id: `svg-path-${Date.now()}-${index}`,
        type: ElementType.PATH,
        position: { x: bbox.x + bbox.width / 2, y: bbox.y + bbox.height / 2 },
        rotation: 0,
        width: bbox.width,
        path_data: pathData,
        connections: []
      });
    });

    onElementsChange([...elements, ...newElements]);
  };

  const handleDeleteSelected = () => {
    if (selectedElement) {
      onElementsChange(elements.filter(el => el.id !== selectedElement));
      setSelectedElement(null);
    }
  };

  const handleClearCanvas = () => {
    if (window.confirm('Clear all elements?')) {
      onElementsChange([]);
      setSelectedElement(null);
    }
  };

  return (
    <div style={{ border: '2px solid #333', display: 'inline-block' }}>
      <div style={{ padding: '10px', background: '#fff', borderBottom: '1px solid #ccc' }}>
        <h3 style={{ margin: '0 0 10px 0' }}>Enhanced Track Editor</h3>
        
        {/* Drawing Tools */}
        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginBottom: '10px' }}>
          <button
            onClick={() => setSelectedTool('select')}
            style={{
              padding: '8px 12px',
              background: selectedTool === 'select' ? '#2196F3' : '#f0f0f0',
              color: selectedTool === 'select' ? '#fff' : '#000',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            🖱️ Select
          </button>
          <button
            onClick={() => setSelectedTool('pan')}
            style={{
              padding: '8px 12px',
              background: selectedTool === 'pan' ? '#2196F3' : '#f0f0f0',
              color: selectedTool === 'pan' ? '#fff' : '#000',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            🖐️ Pan
          </button>
          <button
            onClick={() => setSelectedTool('draw')}
            style={{
              padding: '8px 12px',
              background: selectedTool === 'draw' ? '#2196F3' : '#f0f0f0',
              color: selectedTool === 'draw' ? '#fff' : '#000',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            ✏️ Draw
          </button>
          <button
            onClick={() => setSelectedTool('line')}
            style={{
              padding: '8px 12px',
              background: selectedTool === 'line' ? '#2196F3' : '#f0f0f0',
              color: selectedTool === 'line' ? '#fff' : '#000',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            📏 Line
          </button>
        </div>

        {/* Line Type Selector */}
        <div style={{ marginBottom: '10px' }}>
          <div style={{ marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>Line Type:</div>
          <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
            {Object.values(LineType).map(type => {
              let color = '#333';
              let icon = '━';
              switch (type) {
                case LineType.START:
                  color = '#4CAF50';
                  icon = '🏁';
                  break;
                case LineType.END:
                  color = '#F44336';
                  icon = '🏆';
                  break;
                case LineType.FORBIDDEN:
                  color = '#FF9800';
                  icon = '⛔';
                  break;
                case LineType.COLOR_ZONE:
                  color = '#2196F3';
                  icon = '🎨';
                  break;
                case LineType.OBSTACLE:
                  color = '#9E9E9E';
                  icon = '🚧';
                  break;
                case LineType.NORMAL:
                  color = '#333';
                  icon = '━';
                  break;
              }
              return (
                <button
                  key={type}
                  onClick={() => setSelectedLineType(type as LineType)}
                  style={{
                    padding: '8px 12px',
                    background: selectedLineType === type ? color : '#f0f0f0',
                    color: selectedLineType === type ? '#fff' : '#000',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: selectedLineType === type ? 'bold' : 'normal'
                  }}
                >
                  {icon} {type}
                </button>
              );
            })}
          </div>
        </div>

        {/* Line Width Control */}
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px' }}>
            <span style={{ fontWeight: 'bold' }}>Line Width:</span>
            <input
              type="range"
              min="1"
              max="20"
              value={lineWidth}
              onChange={e => setLineWidth(parseInt(e.target.value))}
              style={{ width: '150px' }}
            />
            <span>{lineWidth}px</span>
          </label>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '10px' }}>
          <button
            onClick={handleDeleteSelected}
            disabled={!selectedElement}
            style={{
              padding: '8px 12px',
              background: '#F44336',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: selectedElement ? 'pointer' : 'not-allowed',
              opacity: selectedElement ? 1 : 0.5
            }}
          >
            🗑️ Delete
          </button>
          <button
            onClick={handleClearCanvas}
            style={{
              padding: '8px 12px',
              background: '#FF9800',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Clear All
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            style={{
              padding: '8px 12px',
              background: '#4CAF50',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            📁 Import SVG
          </button>
          {isDrawing && (
            <button
              onClick={finishDrawing}
              style={{
                padding: '8px 12px',
                background: '#9C27B0',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              ✓ Finish Drawing
            </button>
          )}
        </div>

        {/* Settings */}
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center', fontSize: '14px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <input
              type="checkbox"
              checked={showGrid}
              onChange={e => setShowGrid(e.target.checked)}
            />
            Show Grid
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <input
              type="checkbox"
              checked={snapToGrid}
              onChange={e => setSnapToGrid(e.target.checked)}
            />
            Snap to Grid
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            Grid Size:
            <input
              type="number"
              value={gridSize}
              onChange={e => setGridSize(parseInt(e.target.value) || 50)}
              style={{ width: '60px', padding: '4px' }}
            />
          </label>
          <div>Zoom: {(scale * 100).toFixed(0)}%</div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".svg"
          onChange={handleSVGImport}
          style={{ display: 'none' }}
        />
      </div>
      
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        onMouseDown={handleCanvasMouseDown}
        onMouseMove={handleCanvasMouseMove}
        onMouseUp={handleCanvasMouseUp}
        onMouseLeave={handleCanvasMouseUp}
        onWheel={handleWheel}
        style={{ 
          cursor: selectedTool === 'pan' || isPanning ? 'grab' : 'crosshair', 
          display: 'block',
          background: '#fff'
        }}
      />
    </div>
  );
};

export default TrackEditorEnhanced;
