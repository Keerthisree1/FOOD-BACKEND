const mongoose = require("mongoose");

const externalContestSchema = new mongoose.Schema(
  {
    contestId: mongoose.Schema.Types.Mixed,
    userId: mongoose.Schema.Types.ObjectId,
    contestStatus: String,
    contestPlanType: String,
    details: Object,
    driveAvailability: Object,
    visibility: Object,
    adminStatus: Object
  },
  {
    collection: "contests", 
    strict: false           
  }
);

module.exports = mongoose.model(
  "ExternalContest",
  externalContestSchema
);
