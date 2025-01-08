const os = require("os");
const si = require("systeminformation");
const { exec } = require("child_process");

async function logSystemInfo() {
  try {
    // Clear the console
    process.stdout.write("\x1Bc"); // Use \x1B for clearing the screen

    // Get CPU usage
    const cpuLoad = os.loadavg()[0];
    console.log(
      `CPU Usage: ${((cpuLoad / os.cpus().length) * 100).toFixed(2)}%`
    );

    // Get RAM usage
    const memInfo = await si.mem();
    console.log(
      `RAM Usage: ${(memInfo.used / 1024 / 1024).toFixed(2)} MB / ${(
        memInfo.total /
        1024 /
        1024
      ).toFixed(2)} MB`
    );

    // Get CPU temperature
    const cpuTemp = await si.cpuTemperature();
    if (cpuTemp.main !== null && cpuTemp.main > -1) {
      console.log(`CPU Temperature: ${cpuTemp.main}°C`);
    } else {
      console.log("Could not retrieve CPU temperature.");
    }

    // Get GPU usage and temperature
    const gpuInfo = await new Promise((resolve, reject) => {
      exec(
        "nvidia-smi --query-gpu=utilization.gpu,memory.used,memory.total,temperature.gpu --format=csv,noheader,nounits",
        (error, stdout, stderr) => {
          if (error || stderr) {
            reject(new Error(stderr));
          } else {
            const [gpuUsage, vramUsed, vramTotal, gpuTemp] = stdout
              .split(",")
              .map(Number);
            resolve({ gpuUsage, vramUsed, vramTotal, gpuTemp });
          }
        }
      );
    });

    console.log(`GPU Usage: ${gpuInfo.gpuUsage}%`);
    console.log(`VRAM Usage: ${gpuInfo.vramUsed} MB / ${gpuInfo.vramTotal} MB`);
    console.log(`GPU Temperature: ${gpuInfo.gpuTemp}°C`);
  } catch (error) {
    console.error("Error fetching system information:", error.message);
  }
}

// Set up an interval to log the info every minute
setInterval(logSystemInfo, 1000);

// Initial call to start logging immediately
logSystemInfo();
