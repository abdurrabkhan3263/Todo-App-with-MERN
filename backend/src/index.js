const connectToDb = require("./db/index.js");
const dotEnv = require("dotenv");
const app = require("./app.js");
dotEnv.config();

connectToDb()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server start on the port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log(
      `Something went wrong while connecting to the database ${error}`
    );
  });
