import "./config/load-env";
import { runtimeConfig } from "./config/runtime-config";
import { app } from "./app";

console.log("Server starting...");

app.listen(runtimeConfig.port, () => {
  console.log(`Server running on ${runtimeConfig.port}`);
});
