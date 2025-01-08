import getCpuTelemetry from "../utils/getCpuTelemetry";
import getGpuTelemetry from "../utils/getGpuTelemetry";

export default async function getTelemetryService(omitGpu?: boolean) {
  return {
    cpu: await getCpuTelemetry(),
    gpu: omitGpu ? undefined : await getGpuTelemetry(),
  };
}
