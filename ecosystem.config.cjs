module.exports = {
  apps: [
    {
      name: "DuckDuckNoAPI",
      script: "dist/src/index.js",
      node_args: "--env-file .env"
    },
  ],
};
