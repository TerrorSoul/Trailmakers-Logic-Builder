// src/components/LogicNode.js
import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { BLOCK_TYPES } from '../data/blockTypes';

const LogicNode = memo(({ data, id, selected }) => {
    const type = BLOCK_TYPES[data.blockType];

    const inputHandles = Array.from({ length: type.inputs }, (_, i) => (
        <Handle
            key={`input-${i}`}
            type="target"
            position={Position.Left}
            id={`input-${i}`}
            style={{
                top: type.inputs === 1 ? '50%' : `${(i + 1) * (100 / (type.inputs + 1))}%`,
                background: '#555'
            }}
        />
    ));

    const outputHandle = (
        <Handle
            type="source"
            position={Position.Right}
            id="output"
            style={{
                top: '50%',
                background: '#555'
            }}
        />
    );

    return (
        <div className={`logic-node ${data.blockType.toLowerCase()} ${selected ? 'selected' : ''}`}>
            {inputHandles}
            <div className="logic-node-content">
                <div className="logic-node-title">{type.name}</div>
                <div className="logic-node-settings">
                    {data.settings.greenKeybind && (
                        <div className="keybind green">{data.settings.greenKeybind}</div>
                    )}
                    {data.settings.redKeybind && (
                        <div className="keybind red">{data.settings.redKeybind}</div>
                    )}
                </div>
            </div>
            {outputHandle}
        </div>
    );
});

export default LogicNode;