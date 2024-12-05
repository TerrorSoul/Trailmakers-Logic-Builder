// src/components/SimulationControls.js
import React, { useState } from 'react';

const SimulationControls = ({ updateSimulation }) => {
    const [angle, setAngle] = useState(0);
    const [distance, setDistance] = useState(0);
    const [altitude, setAltitude] = useState(0);
    const [speed, setSpeed] = useState(0);

    const handleChange = (type, value) => {
        switch(type) {
            case 'angle':
                setAngle(value);
                break;
            case 'distance':
                setDistance(value);
                break;
            case 'altitude':
                setAltitude(value);
                break;
            case 'speed':
                setSpeed(value);
                break;
        }
        updateSimulation({ angle, distance, altitude, speed });
    };

    return (
        <div className="simulation-controls">
            <div className="control-group">
                <label>Angle:</label>
                <input
                    type="range"
                    min="-180"
                    max="180"
                    value={angle}
                    onChange={(e) => handleChange('angle', parseFloat(e.target.value))}
                />
                <span>{angle}°</span>
            </div>
            <div className="control-group">
                <label>Distance:</label>
                <input
                    type="range"
                    min="0"
                    max="10"
                    step="0.1"
                    value={distance}
                    onChange={(e) => handleChange('distance', parseFloat(e.target.value))}
                />
                <span>{distance}m</span>
            </div>
            <div className="control-group">
                <label>Altitude:</label>
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={altitude}
                    onChange={(e) => handleChange('altitude', parseFloat(e.target.value))}
                />
                <span>{altitude}m</span>
            </div>
            <div className="control-group">
                <label>Speed:</label>
                <input
                    type="range"
                    min="0"
                    max="200"
                    value={speed}
                    onChange={(e) => handleChange('speed', parseFloat(e.target.value))}
                />
                <span>{speed}km/h</span>
            </div>
        </div>
    );
};

export default SimulationControls;