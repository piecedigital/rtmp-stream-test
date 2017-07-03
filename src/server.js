import express from "express";
import path from "path";
import cp from "child_process";
import fs from "fs";
// import stream from "./stream";

const PORT = process.env.PORT || 9090;

const app = express();

app.use(express.static(path.join(__dirname, "public")));
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*")

  next();
});

app.get("/streams/:file", (req, res) => {
  console.log("sending stream file:", req.params.file);
  const thisPath = path.join(__dirname, "public/streams/stream.m3u8");
  fs.access(thisPath, fs.constants.F_OK && fs.constants.R_OK, err => {
    if(err) {
      console.log("access err", err.stack || err);
      res.status(404).send("No file");
    } else {
      res.sendFile(thisPath);
    }
  });
});

const filePath = "public/streams/stream.m3u8";

const filePathArray = filePath.split("/");
filePathArray.pop();
new Promise(function(resolve, reject) {
  filePathArray.map((folder, ind) => {
    console.log("folder:", folder);
    const thisPath = path.join.apply(null, [__dirname].concat( filePathArray.slice(0, ind+1) ) );
    console.log("this path:", thisPath);
    fs.access(thisPath, fs.constants.F_OK && fs.constants.R_OK && fs.constants.W_OK, err => {
      console.log(ind, ind+1, filePathArray.length);
      if(err) {
        fs.mkdirSync(thisPath);
        console.log("access err", err.stack || err);
      }
      if((ind+1) === filePathArray.length) resolve();
    });
  });
})
.then(() => {
  console.log("we're all good to start streaming");
  console.log(filePath);
  const stream = cp.exec(`ffmpeg -v verbose -i rtmp://192.168.118.128/live/test -c:v libx264 -c:a aac -ac 1 -strict -2 -crf 18 -profile:v baseline -maxrate 400k -bufsize 1835k -pix_fmt yuv420p -flags -global_header -hls_time 10 -hls_list_size 6 -hls_wrap 10 -start_number 1 "${path.join(__dirname, filePath)}"`, (err, stdout, stderr) => {
    if(err) {
      return console.error("main err:", err.stack || err);
    }

    stdout ? console.log(stdout) : null;
    stderr ? console.error("stderr:", stderr.stack || stderr) : null;
  });

  // stream.on("error", e => console.error("process err:", e));
  stream.on("exit", e => console.log("Exit"));
  stream.on("disconnect", e => console.log("Disconnect"));
})
.catch(e => console.error("catch err:", e.stack || e));

app.listen(PORT, function () {
  console.log("listening on port:", PORT);
});
