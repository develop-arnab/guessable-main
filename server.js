// eslint-disable-next-line no-undef
import express from "express";

// eslint-disable-next-line no-undef
const port = process.env.PORT || 8080;
const app = express();

app.use(express.static("dist"));

// send the user to index html page inspite of the url
app.get("*", (req, res) => {
  res.sendFile("index.html", { root: "dist" });
});

app.listen(port, () => {
  // eslint-disable-next-line no-undef
  console.log(`Server is running on port: ${port}`);
});
