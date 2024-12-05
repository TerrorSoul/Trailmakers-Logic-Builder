// src/data/blockTypes.js
export const BLOCK_TYPES = {
    AND_GATE: {
        name: 'AND Gate',
        category: 'Logic Gates',
        inputs: 2,
        outputs: 1,
        settings: {
            outputValue: 1,
            greenKeybind: '',
            redKeybind: '',
            greenToggle: false,
            redToggle: false,
            delay: 0,
            duration: 0,
            pause: 0
        },
        info: 'All inputs must be on',
        computeOutput: (inputs, settings, isActive) => {
            if (isActive || inputs.every(v => v !== 0)) {
                if (settings.duration === 0) return settings.outputValue;

            }
            return 0;
        }
    },
    OR_GATE: {
        name: 'OR Gate',
        category: 'Logic Gates',
        inputs: 2,
        outputs: 1,
        settings: {
            outputValue: 1,
            greenKeybind: '',
            redKeybind: '',
            greenToggle: false,
            redToggle: false,
            delay: 0,
            duration: 0,
            pause: 0
        },
        info: 'At least one input on',
        computeOutput: (inputs, settings, isActive) => {
            if (isActive || inputs.some(v => v !== 0)) {
                if (settings.duration === 0) return settings.outputValue;

            }
            return 0;
        }
    },
    XOR_GATE: {
        name: 'XOR Gate',
        category: 'Logic Gates',
        inputs: 2,
        outputs: 1,
        settings: {
            outputValue: 1,
            greenKeybind: '',
            redKeybind: '',
            greenToggle: false,
            redToggle: false,
            delay: 0,
            duration: 0,
            pause: 0
        },
        info: 'Exactly one input on',
        computeOutput: (inputs, settings, isActive) => {
            if (isActive || inputs.filter(v => v !== 0).length === 1) {
                if (settings.duration === 0) return settings.outputValue;

            }
            return 0;
        }
    },
    NOR_GATE: {
        name: 'NOR Gate',
        category: 'Logic Gates',
        inputs: 2,
        outputs: 1,
        settings: {
            outputValue: 1,
            greenKeybind: '',
            redKeybind: '',
            greenToggle: false,
            redToggle: false,
            delay: 0,
            duration: 0,
            pause: 0
        },
        info: 'No inputs on',
        computeOutput: (inputs, settings, isActive) => {
            if (isActive || inputs.every(v => v === 0)) {
                if (settings.duration === 0) return settings.outputValue;

            }
            return 0;
        }
    },
    DISTANCE_SENSOR: {
        name: 'Distance Sensor',
        category: 'Sensors',
        inputs: 0,
        outputs: 1,
        settings: {
            range: 1.0,
            outputValue: 1.0,
            outputMode: 'Trigger',
            invertTrigger: false,
            delay: 0,
            duration: 0,
            pause: 0
        },
        info: 'Detects objects within range',
        computeOutput: (inputs, settings, isActive, simulationState) => {
            const withinRange = simulationState.distance <= settings.range;
            const shouldTrigger = settings.invertTrigger ? !withinRange : withinRange;
            
            if (shouldTrigger) {
                switch(settings.outputMode) {
                    case 'Measurement':
                        return simulationState.distance * settings.outputValue;
                    case 'Normalized':
                        return (simulationState.distance / settings.range) * settings.outputValue;
                    default: // Trigger
                        return settings.outputValue;
                }
            }
            return 0;
        }
    },
    ALTITUDE_SENSOR: {
        name: 'Altitude Sensor',
        category: 'Sensors',
        inputs: 0,
        outputs: 1,
        settings: {
            altitude: 0,
            outputValue: 1.0,
            outputMode: 'Trigger',
            triggerBelow: false,
            ignoreWaves: true,
            delay: 0,
            duration: 0,
            pause: 0
        },
        info: 'Triggers based on altitude',
        computeOutput: (inputs, settings, isActive, simulationState) => {
            const altitude = simulationState.altitude;
            const aboveThreshold = altitude > settings.altitude;
            const shouldTrigger = settings.triggerBelow ? !aboveThreshold : aboveThreshold;
 
            if (shouldTrigger) {
                switch(settings.outputMode) {
                    case 'Measurement':
                        return altitude * settings.outputValue;
                    case 'Normalized':
                        return (altitude / settings.altitude) * settings.outputValue;
                    default: // Trigger
                        return settings.outputValue;
                }
            }
            return 0;
        }
    },
    SPEED_SENSOR: {
        name: 'Speed Sensor',
        category: 'Sensors',
        inputs: 0,
        outputs: 1,
        settings: {
            speed: 0,
            outputValue: 1.0,
            outputMode: 'Trigger',
            triggerBelow: false,
            delay: 0,
            duration: 0,
            pause: 0
        },
        info: 'Triggers based on speed',
        computeOutput: (inputs, settings, isActive, simulationState) => {
            const speed = simulationState.speed;
            const aboveThreshold = speed > settings.speed;
            const shouldTrigger = settings.triggerBelow ? !aboveThreshold : aboveThreshold;
 
            if (shouldTrigger) {
                switch(settings.outputMode) {
                    case 'Measurement':
                        return speed * settings.outputValue;
                    case 'Normalized':
                        return (speed / settings.speed) * settings.outputValue;
                    default: // Trigger
                        return settings.outputValue;
                }
            }
            return 0;
        }
    },
    ANGLE_SENSOR: {
        name: 'Angle Sensor',
        category: 'Sensors',
        inputs: 0,
        outputs: 1,
        settings: {
            direction: 0,
            width: 90,
            outputValue: 1.0,
            outputMode: 'Trigger',
            triggerOutside: false,
            delay: 0,
            duration: 0,
            pause: 0
        },
        info: 'Triggers based on angle',
        computeOutput: (inputs, settings, isActive, simulationState) => {
            const angle = simulationState.angle;
            const halfWidth = settings.width / 2;
            const minAngle = settings.direction - halfWidth;
            const maxAngle = settings.direction + halfWidth;
            const inRange = angle >= minAngle && angle <= maxAngle;
            const shouldTrigger = settings.triggerOutside ? !inRange : inRange;
 
            if (shouldTrigger) {
                switch(settings.outputMode) {
                    case 'Measurement':
                        return angle * settings.outputValue;
                    case 'Normalized':
                        return ((angle - minAngle) / settings.width) * settings.outputValue;
                    default: // Trigger
                        return settings.outputValue;
                }
            }
            return 0;
        }
    },
    COMPASS: {
        name: 'Compass',
        category: 'Sensors',
        inputs: 0,
        outputs: 1,
        settings: {
            direction: 0,
            width: 90,
            outputValue: 1.0,
            outputMode: 'Trigger',
            triggerOutside: false,
            delay: 0,
            duration: 0,
            pause: 0
        },
        info: 'Triggers based on compass direction',
        computeOutput: (inputs, settings, isActive, simulationState) => {
            const direction = simulationState.direction;
            const halfWidth = settings.width / 2;
            const minAngle = settings.direction - halfWidth;
            const maxAngle = settings.direction + halfWidth;
            const inRange = direction >= minAngle && direction <= maxAngle;
            const shouldTrigger = settings.triggerOutside ? !inRange : inRange;
 
            if (shouldTrigger) {
                switch(settings.outputMode) {
                    case 'Measurement':
                        return direction * settings.outputValue;
                    case 'Normalized':
                        return ((direction - minAngle) / settings.width) * settings.outputValue;
                    default: // Trigger
                        return settings.outputValue;
                }
            }
            return 0;
        }
    }
 };
 
 export const computeNodeOutput = (node, inputValues, edges, simulationState) => {
    const blockType = BLOCK_TYPES[node.data.blockType];
    if (!blockType) return 0;
 
    const settings = node.data.settings;
    const isActive = node.data.isActive || false;
 
    return blockType.computeOutput(inputValues, settings, isActive, simulationState);
 };