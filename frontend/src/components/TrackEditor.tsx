import React, { useRef, useEffect, useState } from 'react';
import { TrackElement, ElementType, Point } from '../types';

interface TrackEditorProps {
  elements: TrackElement[];
  onElementsChange: (elements: TrackElement[]) => void;
  width: number;
  height: number;
}

const TrackEditor: React.FC<TrackEditorProps> = ({ elements, onElementsChange, width, height }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedTool, setSelectedTool] = useState<ElementType>(ElementType.STRAIGHT);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);

  useEffect(() => {
    drawCanvas();
  }, [elements, selectedElement]);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, width, height);

    // Draw grid
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 50) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += 50) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Draw elements
    elements.forEach(element => {
      drawElement(ctx, element, element.id === selectedElement);
    });
  };

  const drawElement = (ctx: CanvasRenderingContext2D, element: TrackElement, isSelected: boolean) => {
    ctx.save();
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
      default:
        ctx.fillStyle = '#333';
    }

    // Draw shape based on type
    const w = element.width;
    const h = element.length || 100;

    if (element.type === ElementType.CURVE && element.radius) {
      // Draw curve
      ctx.beginPath();
      ctx.arc(0, element.radius, element.radius, -Math.PI / 2, 0);
      ctx.lineWidth = w;
      ctx.stroke();
    } else if (element.type === ElementType.OBSTACLE) {
      // Draw obstacle (circle)
      ctx.beginPath();
      ctx.arc(0, 0, w / 2, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Draw rectangle for other types
      ctx.fillRect(-w / 2, -h / 2, w, h);
    }

    // Draw selection highlight
    if (isSelected) {
      ctx.strokeStyle = '#00BCD4';
      ctx.lineWidth = 3;
      ctx.strokeRect(-w / 2 - 5, -h / 2 - 5, w + 10, h + 10);
    }

    ctx.restore();
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if clicking on existing element
    const clickedElement = elements.find(el => {
      const dx = x - el.position.x;
      const dy = y - el.position.y;
      return Math.sqrt(dx * dx + dy * dy) < el.width;
    });

    if (clickedElement) {
      setSelectedElement(clickedElement.id);
    } else {
      // Add new element
      const newElement: TrackElement = {
        id: `element-${Date.now()}`,
        type: selectedTool,
        position: { x, y },
        rotation: 0,
        width: 50,
        length: selectedTool === ElementType.STRAIGHT ? 100 : undefined,
        radius: selectedTool === ElementType.CURVE ? 80 : undefined,
        connections: []
      };
      onElementsChange([...elements, newElement]);
    }
  };

  const handleDeleteSelected = () => {
    if (selectedElement) {
      onElementsChange(elements.filter(el => el.id !== selectedElement));
      setSelectedElement(null);
    }
  };

  return (
    <div style={{ border: '2px solid #333', display: 'inline-block' }}>
      <div style={{ padding: '10px', background: '#fff', borderBottom: '1px solid #ccc' }}>
        <h3>Track Editor</h3>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {Object.values(ElementType).map(type => (
            <button
              key={type}
              onClick={() => setSelectedTool(type as ElementType)}
              style={{
                padding: '8px 12px',
                background: selectedTool === type ? '#2196F3' : '#f0f0f0',
                color: selectedTool === type ? '#fff' : '#000',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              {type}
            </button>
          ))}
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
            Delete
          </button>
        </div>
      </div>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        onClick={handleCanvasClick}
        style={{ cursor: 'crosshair', display: 'block' }}
      />
    </div>
  );
};

export default TrackEditor;
