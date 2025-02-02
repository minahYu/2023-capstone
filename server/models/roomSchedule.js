const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const roomScheduleSchema = new Schema(
  {
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    userType: { type: String, required: true, enum: ["Teacher", "Student"] },
    roomTitle: { type: String, required: true },
    runningTime: { type: String, required: true },
    startTime: { type: String, required: true },
    date: { type: String, required: true },
    reviewWritten: { type: Boolean, required: false },
  },
  {
    versionKey: false,
  }
);

roomScheduleSchema.add({
  prepaymentBtn: {
    type: Boolean,
    required: function () {
      return this.userType === "Student";
    },
  },
});

roomScheduleSchema.set("collection", "roomSchedule");

const RoomSchedule = mongoose.model("RoomSchedule", roomScheduleSchema);

module.exports = RoomSchedule;
