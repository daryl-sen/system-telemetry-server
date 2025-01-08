// Testing the stream endpoint to make sure it works

const http = require("http");

const options = {
  hostname: "localhost",
  port: 8080,
  path: "/stream?omitGpu=true",
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
};

const req = http.request(options, (res) => {
  res.setEncoding("utf8");
  res.on("data", (chunk) => {
    const chunkObj = JSON.parse(chunk);

    console.log(
      `Memory usage: ${
        (chunkObj.cpu.memory.available / chunkObj.cpu.memory.total) * 100
      }%`
    );
  });

  res.on("end", () => {
    console.log("No more data in response.");
  });
});

req.on("error", (e) => {
  console.error(`Problem with request: ${e.message}`);
});

req.end();
