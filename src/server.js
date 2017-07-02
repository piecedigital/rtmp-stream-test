import express from "express";
import path from "path";
import stream from "./stream";

const PORT = process.env.PORT || 9090;

const app = express();

app.use(express.static(path.join(__dirname, "public")));
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*")

  next();
});

app.get("/get-stream", (req, res) => {
  stream(res);
  // res.on("data", function (chunk) {
  //   console.log(chunk);
  // })
});

// app.get("/stream.m3u8", (req, res) => {
//   // stream(res);
//   res.on("data", function (chunk) {
//     console.log(chunk);
//   })
// });


app.listen(PORT, function () {
  console.log("listening on port:", PORT);
});
