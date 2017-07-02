import fs from "fs";
import path from "path";

var rs = fs.createReadStream(path.join(__dirname, "public", "output.flv"));
rs.on("data", chunk => {
  console.log(chunk);
})
