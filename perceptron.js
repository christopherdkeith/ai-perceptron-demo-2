// ===================================
// PERCEPTRON ALGORITHM
// ===================================
// This file contains the core perceptron learning algorithm.
// A perceptron is the simplest form of a neural network that
// learns to classify points based on a linear boundary.
//
// KEY INSIGHT: The perceptron IS a plane, encoded in four numbers:
// - weightX, weightY, and weightZ control the angle/orientation of the plane
// - bias shifts the plane's position in 3D space
// Learning means adjusting these four numbers to find the perfect plane.

// Perceptron weights and bias (these four numbers ARE the plane!)
var weightX = 0;      // Weight for x-coordinate (affects plane's tilt in x direction)
var weightY = 0;      // Weight for y-coordinate (affects plane's tilt in y direction)
var weightZ = 0;      // Weight for z-coordinate (affects plane's tilt in z direction)
var bias = 0;         // Bias term (shifts the plane's position)
var trainingRound = 0; // Counter for training iterations

// Perceptron prediction function
// Takes x, y, and z coordinates and returns +1 (above plane) or -1 (below plane)
function predict(x, y, z) {
    // Calculate weighted sum: (weightX * x) + (weightY * y) + (weightZ * z) + bias
    // This formula determines which side of the plane the point is on
    var sum = weightX * x + weightY * y + weightZ * z + bias;
    
    // Step activation function: 
    // If sum >= 0, the point is on the positive side (above the plane) -> predict +1
    // If sum < 0, the point is on the negative side (below the plane) -> predict -1
    // This is how the perceptron "draws" its decision boundary in 3D
    return sum >= 0 ? 1 : -1;
}

// Train the perceptron on one complete round through all data
// In each round, we check every point and adjust weights when we make mistakes
function trainOneRound() {
    var errors = 0;
    
    // Go through each training point one by one
    for (var i = 0; i < trainingData.length; i++) {
        var point = trainingData[i];
        
        // Make a prediction: is this point above (+1) or below (-1) our current plane?
        var prediction = predict(point.x, point.y, point.z);
        
        // Calculate error: difference between correct answer and our prediction
        // error = 0  means we got it right (no change needed)
        // error = 2  means we predicted -1 but should be +1 (plane needs to tilt down)
        // error = -2 means we predicted +1 but should be -1 (plane needs to tilt up)
        var error = point.label - prediction;
        
        // If prediction was wrong (error != 0), update weights to correct the mistake
        if (error !== 0) {
            errors++;
            
            // Perceptron learning rule:
            // New weight = Old weight + (learning rate × error × input coordinate)
            //
            // Why multiply by the input coordinate?
            // - If x is large and positive, and we need to adjust the plane (error > 0),
            //   we increase weightX more to tilt the plane appropriately
            // - If x is negative, we adjust in the opposite direction
            // - The learning rate controls how big each adjustment step is
            //
            // This gradually rotates and shifts the plane toward the correct position
            weightX = weightX + learningRate * error * point.x;
            weightY = weightY + learningRate * error * point.y;
            weightZ = weightZ + learningRate * error * point.z;
            bias = bias + learningRate * error;
        }
    }
    
    // Increment round counter
    trainingRound++;
    
    // Update the display to show new weights and accuracy
    updateDisplay();
    updateChart();
    
    // Stop if perfect accuracy achieved (no errors in this round)
    if (errors === 0) {
        stopTraining();
        alert('Perfect accuracy achieved! All points classified correctly.');
    }
}

// Reset perceptron to initial state (random or zero weights)
function resetPerceptron() {
    weightX = 0;
    weightY = 0;
    weightZ = 0;
    bias = 0;
    trainingRound = 0;
}
