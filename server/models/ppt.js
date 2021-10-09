const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const commentSchema = new Schema(
    {
      comment: {
        type: String,
        required: true,
      },
      id:{
        type:Number,
        required:true,
      },
      author: {
        type: String,
        required: true,
      },
      author_id:{
        type:String,
      },
      pptid:{
          type:String,
          required:true,
      },
      slideid:{
        type:Number,
        required:true,
    }
    },
    {
      timestamps: true,
    }
  );
  const pptSchema = new Schema(
    {
      name: {
        type: String,
        required: true,
      },
      user:{
        type:String,
        required:true,
      },
      ppturl:{
        type:String,
        required:true
      },
      pdfurl:{
        type:String,
        required:true
      },
      isprivate:{
        type:Boolean,
        required:true
      },
      comments: [commentSchema],
    },
    {
      timestamps: true,
    }
  );
  var PPT = mongoose.model("PPT", pptSchema);
  module.exports = PPT;