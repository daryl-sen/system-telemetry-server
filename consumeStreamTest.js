// Testing the stream endpoint to make sure it works

// run node consumeStreamTest.js <hostname> <port> <omitGpu>
// example: node consumeStreamTest.js localhost 8080 false

const { time } = require("console");
const http = require("http");

// Get command-line arguments for hostname and port
const args = process.argv.slice(2);
const hostname = args[0] || "localhost";
const port = args[1] || 8080;
const omitGpu = args[2] || "true";

const options = {
  hostname: hostname,
  port: port,
  path: `/stream?omitGpu=${omitGpu}`,
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
};

const req = http.request(options, (res) => {
  res.setEncoding("utf8");
  res.on("data", (chunk) => {
    const chunkObj = JSON.parse(chunk);

    const availableMemoryPercentage = (
      (chunkObj.cpu.memory.available / chunkObj.cpu.memory.total) *
      100
    ).toFixed(2);
    const currentCpuLoadPercentage = (
      chunkObj.cpu.cpu.currentLoad * 100
    ).toFixed(2);
    const currentCpuTemp = chunkObj.cpu.cpu.temperature;

    console.log(`----------${new Date().toLocaleTimeString()}----------`);
    const padValue = (value, length = 10) =>
      value.toString().padStart(length, " ");

    console.log(`Available memory: ${padValue(availableMemoryPercentage)}%`);
    console.log(`Current CPU load: ${padValue(currentCpuLoadPercentage)}%`);
    console.log(`Current CPU temperature: ${padValue(currentCpuTemp)}°C`);

    if (omitGpu === "true") {
      return;
    }

    const currentGpuTemp = chunkObj.gpu.gpuTemp;
    const availableVramPercentage = (
      ((chunkObj.gpu.vramTotal - chunkObj.gpu.vramUsed) /
        chunkObj.gpu.vramTotal) *
      100
    ).toFixed(2);
    console.log(`Current GPU temperature: ${padValue(currentGpuTemp)}°C`);
    console.log(`Available VRAM: ${padValue(availableVramPercentage)}%`);
  });

  res.on("end", () => {
    console.log("No more data in response.");
  });
});

req.on("error", (e) => {
  console.error(`Problem with request: ${e.message}`);
});

req.end();
