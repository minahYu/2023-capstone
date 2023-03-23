const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const writeSchema = new Schema(
  {
    number: { type: String, required: true },
    period: { type: String, required: true },
    date: { type: Date, required: true },
    tag: { type: Array, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
  }

);

writeSchema.set("collection", "write");

const Write = mongoose.model("write", writeSchema);

module.exports = Write;
