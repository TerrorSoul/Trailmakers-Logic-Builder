import React from 'react';
import { BaseEdge, EdgeLabelRenderer, getBezierPath } from 'reactflow';

const CustomEdge = ({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    data,
    style = {}
}) => {
    const [edgePath, labelX, labelY] = getBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    });

    const value = data?.value || 0;
    const isActive = value !== 0;

    return (
        <>
            <BaseEdge
                path={edgePath}
                style={{
                    ...style,
                    strokeWidth: 2,
                    stroke: isActive ? '#4CAF50' : '#999',
                    animation: isActive ? 'flowAnimation 1s linear infinite' : 'none'
                }}
            />
            <EdgeLabelRenderer>
                <div
                    style={{
                        position: 'absolute',
                        transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
                        background: '#fff',
                        padding: '2px 4px',
                        borderRadius: 4,
                        fontSize: 12,
                        pointerEvents: 'all',
                        border: '1px solid #ccc'
                    }}
                >
                    {value.toFixed(2)}
                </div>
            </EdgeLabelRenderer>
            <defs>
                <marker
                    id={`arrow-${id}`}
                    viewBox="0 0 10 10"
                    refX="5"
                    refY="5"
                    markerWidth="3"
                    markerHeight="3"
                    orient="auto-start-reverse"
                >
                    <path d="M 0 0 L 10 5 L 0 10 z" fill={isActive ? '#4CAF50' : '#999'} />
                </marker>
            </defs>
        </>
    );
};

export default React.memo(CustomEdge);