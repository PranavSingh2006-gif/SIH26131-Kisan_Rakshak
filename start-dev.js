import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log("\x1b[32m%s\x1b[0m", "🌾 Starting KisanRakshak Backend & Frontend...\n");

const backend = spawn("npm run dev", {
  cwd: path.join(__dirname, "kisanrakshak-backend"),
  shell: true,
  stdio: "inherit"
});

const frontend = spawn("npm run dev", {
  cwd: path.join(__dirname, "kisanrakshak-frontend"),
  shell: true,
  stdio: "inherit"
});

function cleanup() {
  backend.kill();
  frontend.kill();
  process.exit();
}

process.on("SIGINT", cleanup);
process.on("SIGTERM", cleanup);
process.on("exit", cleanup);

