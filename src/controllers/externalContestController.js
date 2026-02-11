const ExternalContest = require("../models/externalContestModel");

exports.getContests = async (req, res) => {
  try {
    const { status } = req.query;

    //DB status
    const statusMap = {
      active: ["Active"],
      closed: ["Completed"],
      completed: ["Completed"],
      rejected: ["Rejected"],
      "in-review": ["In-Review"],
      all: ["Active", "Completed", "Rejected", "In-Review"]
    };

    let filter = {};

    if (status && statusMap[status]) {
      filter.contestStatus = { $in: statusMap[status] };
    }

    const contests = await ExternalContest.find(filter).sort({
      createdAt: -1
    });

    res.status(200).json({
      success: true,
      total: contests.length,
      status: status || "all",
      data: contests
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
