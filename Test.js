// Import the required libraries
const fs = require('fs');

// Function to parse and read JSON input
function readJsonFile(filename) {
    const data = fs.readFileSync(filename, 'utf8');
    return JSON.parse(data);
}

// Function to decode y values from the given base
function decodeValue(value, base) {
    return parseInt(value, base);
}

// Function to perform Lagrange Interpolation and find constant c
function lagrangeInterpolation(points) {
    let c = 0;

    for (let i = 0; i < points.length; i++) {
        let x_i = points[i].x;
        let y_i = points[i].y;

        let li = 1; // The Lagrange basis polynomial

        for (let j = 0; j < points.length; j++) {
            if (i !== j) {
                let x_j = points[j].x;
                li *= (0 - x_j) / (x_i - x_j);
            }
        }

        c += y_i * li;
    }

    return c;
}

// Main function to execute the algorithm
function findSecretConstant(filename) {
    const jsonData = readJsonFile(filename);

    const n = jsonData.keys.n;
    const k = jsonData.keys.k;

    const points = [];

    for (let i = 1; i <= n; i++) {
        if (jsonData.hasOwnProperty(i.toString())) {
            const x = i; // x value is the key itself
            const base = jsonData[i].base;
            const value = jsonData[i].value;

            // Decode y value
            const y = decodeValue(value, base);

            // Store the point (x, y)
            points.push({ x: x, y: y });
        }
    }

    // We need at least k points to find the polynomial
    if (points.length < k) {
        throw new Error(`Insufficient points. Need at least ${k} points to find the polynomial.`);
    }

    // Find the constant term c using Lagrange Interpolation
    const c = lagrangeInterpolation(points.slice(0, k));

    console.log(`The constant term 'c' is: ${c}`);
}

// Run the main function with the input filename
findSecretConstant('input2.json');
