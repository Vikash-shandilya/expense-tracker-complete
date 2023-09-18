const fs = require("fs");
const path = require("path");

const loadConfig = () => {
  const configPath = path.join(__dirname, "config.json"); // Update the path as needed
  const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
  process.env.CONFIG = JSON.stringify(config);
};

module.exports = loadConfig;
