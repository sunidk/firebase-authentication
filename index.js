const express = require("express");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT;
app.use(express.json());
const routes = require("./api/routes");
app.use("/", routes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
