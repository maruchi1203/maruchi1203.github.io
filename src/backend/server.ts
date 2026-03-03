import "./config/load-env";
import { runtimeConfig } from "./config/runtime-config";
import { app } from "./app";

console.log("서버 시작 중...");

app.listen(runtimeConfig.port, () => {
  console.log(`서버 포트 : ${runtimeConfig.port}`);
});
