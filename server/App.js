const express = require("express");
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const port = 5000;
//const mongoDB = 'mongodb://127.0.0.1/webViewer';
const uri="mongodb+srv://webViewerClient:DjHpfPdeAZvlL4ud@cluster0.cbgcm.mongodb.net/pptinfo?retryWrites=true&w=majority"
var indexRouter = require("./routes/index");
var PPTRouter = require("./routes/pptRouter");
const PPT = require("./models/ppt");
mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
app.listen(port, () => console.log(`Listening on port ${port}`));
app.use("/", indexRouter);
app.use("/ppt", PPTRouter);
const corsOptions ={
  origin:'http://localhost:3000', 
  credentials:true,            // access-control-allow-credentials:true
  optionSuccessStatus:200
}
app.use(cors(corsOptions));
module.exports = app;