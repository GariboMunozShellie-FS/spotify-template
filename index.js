const http = require("http");
const app = require("./app/app");
require("dotenv").config();

http.createServer(app).listen(process.env.port, () => {
    console.log(`Server running on port: ${process.env.port}`)
});
