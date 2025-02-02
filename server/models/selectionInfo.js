const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// selectionInfo 스키마 정의
const selectionInfoSchema = new Schema(
  {
    applicantId: { type: [String], required: true },
    host: { type: String, required: true },
    applicant: { type: Array, required: true },
    roomTitle: { type: String, required: true },
    runningTime: {type: String, required: true},
    startTime: { type: String, required: true },
    date: {type: String, required: true},
    reviewWritten: { type: Boolean, default: false }, // 후기 작성 여부 필드 추가
  },
  { versionKey: false } // versionKey를 false로 지정해야 합니다.
);

selectionInfoSchema.set("collection", "selectionInfo");

// selectionInfo 모델 생성
const SelectionInfo = mongoose.model("selectionInfo", selectionInfoSchema);

module.exports = SelectionInfo;