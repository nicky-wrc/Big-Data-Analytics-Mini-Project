const { execFile } = require("child_process");
const path = require("path");

const PYTHON_PATH = process.env.PYTHON_PATH || "python3";
const MODEL_DIR = process.env.MODEL_DIR || path.join(__dirname, "../../../model");
const PREDICT_SCRIPT = path.join(MODEL_DIR, "predict.py");

function predict(features) {
  return new Promise((resolve, reject) => {
    const child = execFile(
      PYTHON_PATH,
      [PREDICT_SCRIPT],
      { maxBuffer: 1024 * 1024 },
      (error, stdout, stderr) => {
        if (error) {
          reject(new Error(`Prediction failed: ${stderr || error.message}`));
          return;
        }
        try {
          resolve(JSON.parse(stdout.trim()));
        } catch (e) {
          reject(new Error(`Invalid prediction output: ${stdout}`));
        }
      }
    );
    child.stdin.write(JSON.stringify({ features }));
    child.stdin.end();
  });
}

function predictBatch(featuresList) {
  return new Promise((resolve, reject) => {
    const child = execFile(
      PYTHON_PATH,
      [PREDICT_SCRIPT],
      { maxBuffer: 10 * 1024 * 1024 },
      (error, stdout, stderr) => {
        if (error) {
          reject(new Error(`Batch prediction failed: ${stderr || error.message}`));
          return;
        }
        try {
          resolve(JSON.parse(stdout.trim()));
        } catch (e) {
          reject(new Error(`Invalid batch output: ${stdout}`));
        }
      }
    );
    child.stdin.write(JSON.stringify({ features: featuresList }));
    child.stdin.end();
  });
}

module.exports = { predict, predictBatch };
