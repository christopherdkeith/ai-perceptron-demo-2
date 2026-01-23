// ===================================
// USER INTERFACE CONTROL
// ===================================
// This file handles all UI interactions, chart visualization,
// and coordinating between the perceptron algorithm and display.

// Global UI variables
var chart;
var trainingData = [];
var isTraining = false;
var trainingInterval;
var learningRate = 0.1;

// Target plane parameters (z = Ax + By + C)
var targetA = 0.5;  // Coefficient for x
var targetB = 0.3;  // Coefficient for y
var targetC = 0.2;  // Constant term

// Define custom polygon3d series type for Highcharts 3D
Highcharts.seriesType('polygon3d', 'scatter3d', {
    marker: {
        enabled: false,
        states: {
            hover: {
                enabled: false
            }
        }
    },
    stickyTracking: false,
    tooltip: {
        followPointer: true,
        pointFormat: ''
    },
    trackByArea: true
}, {
    type: 'polygon',
    getGraphPath: function() {
        var graphPath = Highcharts.Series.prototype.getGraphPath.call(this);
        var i = graphPath.length + 1;
        // Close all segments
        while (i--) {
            if ((i === graphPath.length || graphPath[i][0] === 'M') && i > 0) {
                graphPath.splice(i, 0, ['Z']);
            }
        }
        this.areaPath = graphPath;
        return graphPath;
    },
    drawGraph: function() {
        // Hack into the fill logic in area.drawGraph
        this.options.fillColor = this.color;
        Highcharts.seriesTypes.area.prototype.drawGraph.call(this);
    },
    drawLegendSymbol: Highcharts.LegendSymbolMixin.drawRectangle,
    drawTracker: Highcharts.Series.prototype.drawTracker,
    setStackedPoints: Highcharts.noop
});

// Initialize the Highcharts 3D visualization
function initChart() {
    chart = Highcharts.chart('chart-container', {
        chart: {
            type: 'scatter',
            options3d: {
                enabled: true,
                alpha: 15,      // Vertical rotation angle
                beta: 30,       // Horizontal rotation angle
                depth: 250,     // Z-axis depth
                viewDistance: 5,
                fitToPlot: false,
                frame: {
                    bottom: { size: 1, color: 'rgba(0,0,0,0.05)' },
                    back: { size: 1, color: 'rgba(0,0,0,0.05)' },
                    side: { size: 1, color: 'rgba(0,0,0,0.05)' }
                }
            },
            margin: [50, 50, 50, 50],
            events: {
                load: function() {
                    // Enable drag to rotate
                    var chart = this;
                    var isDragging = false;
                    var startX, startY;
                    var startAlpha, startBeta;
                    
                    // Mouse down - start dragging
                    Highcharts.addEvent(chart.container, 'mousedown', function(e) {
                        e.preventDefault();
                        isDragging = true;
                        startX = e.pageX;
                        startY = e.pageY;
                        startAlpha = chart.options.chart.options3d.alpha;
                        startBeta = chart.options.chart.options3d.beta;
                    });
                    
                    // Mouse move - rotate chart
                    Highcharts.addEvent(chart.container, 'mousemove', function(e) {
                        if (isDragging) {
                            e.preventDefault();
                            var dx = e.pageX - startX;
                            var dy = e.pageY - startY;
                            
                            // Update rotation angles (negative dx for reversed horizontal rotation)
                            chart.options.chart.options3d.alpha = startAlpha + dy * 0.5;
                            chart.options.chart.options3d.beta = startBeta - dx * 0.5;
                            chart.redraw(false);
                        }
                    });
                    
                    // Mouse up - stop dragging
                    Highcharts.addEvent(document, 'mouseup', function() {
                        isDragging = false;
                    });
                }
            }
        },
        title: {
            text: '3D Perceptron Learning Visualization'
        },
        xAxis: {
            title: { text: 'X Coordinate' },
            min: -1,
            max: 1,
            gridLineWidth: 1
        },
        yAxis: {
            title: { text: 'Y Coordinate' },
            min: -1,
            max: 1
        },
        zAxis: {
            title: { text: 'Z Coordinate' },
            min: -2,
            max: 2,
            showFirstLabel: false
        },
        legend: {
            enabled: true
        },
        plotOptions: {
            scatter: {
                marker: {
                    radius: 4,
                    symbol: 'circle'
                },
                dataLabels: {
                    enabled: false
                }
            }
        },
        series: [
            {
                name: 'Above Plane (+1)',
                color: '#4CAF50',
                data: []
            },
            {
                name: 'Below Plane (-1)',
                color: '#2196F3',
                data: []
            },
            {
                name: 'Target Plane',
                type: 'polygon3d',
                color: 'rgba(244, 67, 54, 0.3)',
                data: [],
                enableMouseTracking: false,
                marker: { enabled: false },
                lineWidth: 2,
                borderColor: '#f44336'
            },
            {
                name: 'Decision Boundary',
                type: 'polygon3d',
                color: 'rgba(255, 152, 0, 0.3)',
                data: [],
                enableMouseTracking: false,
                marker: { enabled: false },
                lineWidth: 2,
                borderColor: '#FF9800'
            }
        ]
    });
}

// Generate random training data points in 3D
function generateTrainingData() {
    var numPoints = parseInt(document.getElementById('num-points').value);
    trainingData = [];
    
    for (var i = 0; i < numPoints; i++) {
        // Random x, y, and z between -1 and 1
        var x = Math.random() * 2 - 1;
        var y = Math.random() * 2 - 1;
        var z = Math.random() * 2 - 1;
        
        // Calculate where the point should be relative to target plane
        // Target plane equation: z = Ax + By + C
        var planeZ = targetA * x + targetB * y + targetC;
        
        // Classification: +1 if point is above the plane, -1 if below
        var classification = z > planeZ ? 1 : -1;
        
        trainingData.push({ x: x, y: y, z: z, classification: classification });
    }
    
    updateChart();
}

// Start training process
function startTraining() {
    if (isTraining) return;
    
    learningRate = parseFloat(document.getElementById('learning-rate').value);
    isTraining = true;
    
    // Update button states
    document.getElementById('start-btn').disabled = true;
    document.getElementById('stop-btn').disabled = false;
    
    // Train one round every 500ms for visualization
    trainingInterval = setInterval(function() {
        trainOneRound();
    }, 500);
}

// Stop training process
function stopTraining() {
    isTraining = false;
    if (trainingInterval) {
        clearInterval(trainingInterval);
    }
    // Update button states
    document.getElementById('start-btn').disabled = false;
    document.getElementById('stop-btn').disabled = true;
}

// Reset perceptron and display
function reset() {
    stopTraining();
    resetPerceptron();
    updateDisplay();
    updateChart();
}

// Generate new data points
function generateNewData() {
    stopTraining();
    trainingRound = 0;
    generateTrainingData();
    updateDisplay();
}

// Reset camera to default viewing angle
function resetCamera() {
    if (chart && chart.options && chart.options.chart && chart.options.chart.options3d) {
        chart.options.chart.options3d.alpha = 15;
        chart.options.chart.options3d.beta = 30;
        chart.redraw(false);
    }
}

// Update target plane when user changes A, B, or C coefficients
function updateTargetPlane() {
    stopTraining();
    targetA = parseFloat(document.getElementById('target-a').value);
    targetB = parseFloat(document.getElementById('target-b').value);
    targetC = parseFloat(document.getElementById('target-c').value);
    
    // Update equation display
    var signB = targetB >= 0 ? ' + ' : ' ';
    var signC = targetC >= 0 ? ' + ' : ' ';
    document.getElementById('target-equation').textContent = 
        'z = ' + targetA + 'x' + signB + Math.abs(targetB) + 'y' + signC + Math.abs(targetC);
    
    // Regenerate training data with new target plane
    trainingRound = 0;
    generateTrainingData();
    updateDisplay();
}

// Update all display values in the UI
function updateDisplay() {
    document.getElementById('training-round').textContent = trainingRound;
    document.getElementById('weight-x').textContent = weightX.toFixed(3);
    document.getElementById('weight-y').textContent = weightY.toFixed(3);
    document.getElementById('weight-z').textContent = weightZ.toFixed(3);
    document.getElementById('bias').textContent = bias.toFixed(3);
    
    // Calculate accuracy
    var correct = 0;
    for (var i = 0; i < trainingData.length; i++) {
        var point = trainingData[i];
        if (predict(point.x, point.y, point.z) === point.classification) {
            correct++;
        }
    }
    var accuracy = trainingData.length > 0 ? (correct / trainingData.length * 100) : 0;
    var wrong = trainingData.length - correct;
    
    document.getElementById('accuracy').textContent = accuracy.toFixed(1) + '%';
    document.getElementById('correct').textContent = correct;
    document.getElementById('wrong').textContent = wrong;
}

// Generate wireframe grid for a plane given coefficients
// Returns points for a grid of lines (simplified single-path version)
function generatePlaneWireframe(a, b, c) {
    var gridSize = 10;
    var wireframeData = [];
    
    // Generate grid points
    for (var i = 0; i <= gridSize; i++) {
        for (var j = 0; j <= gridSize; j++) {
            var x = -1 + (i / gridSize) * 2;
            var y = -1 + (j / gridSize) * 2;
            var z = a * x + b * y + c;
            z = Math.max(-1, Math.min(1, z));
            wireframeData.push([x, y, z]);
        }
    }
    
    return wireframeData;
}

// Generate decision boundary wireframe from perceptron weights
function generateDecisionBoundaryWireframe() {
    // Don't render if weights haven't been initialized
    if (weightZ === 0 && weightX === 0 && weightY === 0) {
        return [];
    }
    
    // Handle degenerate case: plane is vertical (parallel to z-axis)
    if (Math.abs(weightZ) < 0.001) {
        return [];
    }
    
    // Decision boundary: weightX*x + weightY*y + weightZ*z + bias = 0
    // Solve for z: z = -(weightX*x + weightY*y + bias) / weightZ
    var a = -weightX / weightZ;
    var b = -weightY / weightZ;
    var c = -bias / weightZ;
    
    return generatePlaneWireframe(a, b, c);
}

// Update chart with current 3D data
function updateChart() {
    var abovePoints = [];
    var belowPoints = [];
    
    // Separate points by their classification (3D format: [x, y, z])
    for (var i = 0; i < trainingData.length; i++) {
        var point = trainingData[i];
        if (point.classification === 1) {
            abovePoints.push([point.x, point.y, point.z]);
        } else {
            belowPoints.push([point.x, point.y, point.z]);
        }
    }
    
    // Generate target plane as a polygon (4 corners defining a square)
    var targetWireframe = [
        [-1, -1, targetA * -1 + targetB * -1 + targetC],
        [1, -1, targetA * 1 + targetB * -1 + targetC],
        [1, 1, targetA * 1 + targetB * 1 + targetC],
        [-1, 1, targetA * -1 + targetB * 1 + targetC]
    ];
    
    // Generate decision boundary as a polygon
    var decisionWireframe = [];
    if (weightZ !== 0 && (weightX !== 0 || weightY !== 0 || bias !== 0)) {
        var a = -weightX / weightZ;
        var b = -weightY / weightZ;
        var c = -bias / weightZ;
        
        decisionWireframe = [
            [-1, -1, a * -1 + b * -1 + c],
            [1, -1, a * 1 + b * -1 + c],
            [1, 1, a * 1 + b * 1 + c],
            [-1, 1, a * -1 + b * 1 + c]
        ];
    }
    
    // Update all series
    chart.series[0].setData(abovePoints, false);
    chart.series[1].setData(belowPoints, false);
    chart.series[2].setData(targetWireframe, false);
    chart.series[3].setData(decisionWireframe, false);
    chart.redraw();
}

// Initialize on page load
window.onload = function() {
    // Read initial target plane values from inputs
    targetA = parseFloat(document.getElementById('target-a').value);
    targetB = parseFloat(document.getElementById('target-b').value);
    targetC = parseFloat(document.getElementById('target-c').value);
    
    initChart();
    generateTrainingData();
    updateDisplay();
    
    // Update target plane equation display
    var signB = targetB >= 0 ? ' + ' : ' ';
    var signC = targetC >= 0 ? ' + ' : ' ';
    document.getElementById('target-equation').textContent = 
        'z = ' + targetA + 'x' + signB + Math.abs(targetB) + 'y' + signC + Math.abs(targetC);
};
