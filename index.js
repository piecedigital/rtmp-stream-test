var cp = require('child_process');
var env = {
  PORT: 9090,
  NODE_ENV: "dev"
};
// would put other environment variables here
cp.fork("./dist/server.js", [], {
  env: env
});

process.on('uncaughtException', function (err) {
  console.log("\n\r **Uncaught Exception event** \n\r");
  console.log(err);
});
