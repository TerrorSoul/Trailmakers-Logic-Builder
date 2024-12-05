// src/components/SettingsPanel.js
import React from 'react';
import { BLOCK_TYPES } from '../data/blockTypes';

const SettingsPanel = ({ selectedNode, updateNodeData }) => {
    if (!selectedNode) {
        return (
            <div className="settings-panel">
                <h3>No block selected</h3>
                <p>Select a block to configure its settings</p>
            </div>
        );
    }

    const blockType = BLOCK_TYPES[selectedNode.data.blockType];
    if (!blockType) return null;

    const handleSettingChange = (key, value) => {
        const newData = {
            ...selectedNode.data,
            settings: {
                ...selectedNode.data.settings,
                [key]: value
            }
        };
        updateNodeData(selectedNode.id, newData);
    };

    return (
        <div className="settings-panel">
            <h3>{blockType.name} Settings</h3>

            <div className="setting-group">
                <h4>Output</h4>
                <div className="setting-item">
                    <label>Output Value:</label>
                    <input
                        type="number"
                        value={selectedNode.data.settings.outputValue}
                        onChange={(e) => handleSettingChange('outputValue', parseFloat(e.target.value))}
                        step="0.1"
                    />
                </div>
            </div>

            <div className="setting-group">
                <h4>Keybinds</h4>
                <div className="setting-item">
                    <label>Green Keybind:</label>
                    <input
                        type="text"
                        maxLength="1"
                        value={selectedNode.data.settings.greenKeybind || ''}
                        onChange={(e) => handleSettingChange('greenKeybind', e.target.value.toUpperCase())}
                    />
                </div>
                <div className="setting-item">
                    <label>Red Keybind:</label>
                    <input
                        type="text"
                        maxLength="1"
                        value={selectedNode.data.settings.redKeybind || ''}
                        onChange={(e) => handleSettingChange('redKeybind', e.target.value.toUpperCase())}
                    />
                </div>
            </div>

            <div className="setting-group">
                <h4>Toggle</h4>
                <div className="setting-item">
                    <label>Green Toggle:</label>
                    <input
                        type="checkbox"
                        checked={selectedNode.data.settings.greenToggle || false}
                        onChange={(e) => handleSettingChange('greenToggle', e.target.checked)}
                    />
                </div>
                <div className="setting-item">
                    <label>Red Toggle:</label>
                    <input
                        type="checkbox"
                        checked={selectedNode.data.settings.redToggle || false}
                        onChange={(e) => handleSettingChange('redToggle', e.target.checked)}
                    />
                </div>
            </div>

            <div className="setting-group">
                <h4>Timers</h4>
                <div className="setting-item">
                    <label>Delay (s):</label>
                    <input
                        type="number"
                        value={selectedNode.data.settings.delay || 0}
                        onChange={(e) => handleSettingChange('delay', Math.max(0, parseFloat(e.target.value)))}
                        step="0.01"
                        min="0"
                    />
                </div>
                <div className="setting-item">
                    <label>Duration (s):</label>
                    <input
                        type="number"
                        value={selectedNode.data.settings.duration || 0}
                        onChange={(e) => handleSettingChange('duration', Math.max(0, parseFloat(e.target.value)))}
                        step="0.01"
                        min="0"
                    />
                </div>
                <div className="setting-item">
                    <label>Pause (s):</label>
                    <input
                        type="number"
                        value={selectedNode.data.settings.pause || 0}
                        onChange={(e) => handleSettingChange('pause', Math.max(0, parseFloat(e.target.value)))}
                        step="0.01"
                        min="0"
                    />
                </div>
            </div>

            {selectedNode.data.blockType === 'DISTANCE_SENSOR' && (
                <div className="setting-group">
                    <h4>Sensor Settings</h4>
                    <div className="setting-item">
                        <label>Range:</label>
                        <input
                            type="number"
                            value={selectedNode.data.settings.range}
                            onChange={(e) => handleSettingChange('range', Math.max(0, parseFloat(e.target.value)))}
                            step="0.1"
                            min="0"
                        />
                    </div>
                    <div className="setting-item">
                        <label>Output Mode:</label>
                        <select
                            value={selectedNode.data.settings.outputMode}
                            onChange={(e) => handleSettingChange('outputMode', e.target.value)}
                        >
                            <option value="Trigger">Trigger</option>
                            <option value="Measurement">Measurement</option>
                            <option value="Normalized">Normalized</option>
                        </select>
                    </div>
                    <div className="setting-item">
                        <label>Invert Trigger:</label>
                        <input
                            type="checkbox"
                            checked={selectedNode.data.settings.invertTrigger || false}
                            onChange={(e) => handleSettingChange('invertTrigger', e.target.checked)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default SettingsPanel;