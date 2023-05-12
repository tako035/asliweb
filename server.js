const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const mongoose = require("mongoose");

const app = require("./app");
const port = process.env.PORT || 3000;
const uri = process.env.DATABASE.replace(
  /<PASSWORD>/g,
  process.env.DATABASE_PASSWORD
);
mongoose.connect(uri).then(() => {
  console.log("Connection established with DB Server");
});

app.listen(port, () => console.log(`Listening on ${port} ...`));
