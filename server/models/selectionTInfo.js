const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// selectionTInfo 스키마 정의
const selectionTInfoSchema = new Schema(
  {
    hostId : { type: String, required: true },
    host: { type: String, required: true },
    applicant: { type: Array, required: true },
    roomTitle: { type: String, required: true },
    runningTime: {type: String, required: true},
    startTime: { type: String, required: true },
    date: {type: String, required: true},
    reviewTWritten: { type: Boolean, default: false }, // 후기 작성 여부 필드 추가
  },
  { versionKey: false } // versionKey를 false로 지정해야 합니다.
);

selectionTInfoSchema.set("collection", "selectionTInfo");

// selectionTInfo 모델 생성
const SelectionTInfo = mongoose.model("selectionTInfo", selectionTInfoSchema);

module.exports = SelectionTInfo;