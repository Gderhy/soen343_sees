const { getEventAttendees } = require("../services/supabase/manager/supabase"); // Import the service function to get event attendees

// Import the service function to get attendance trends
const getAttendanceTrendsController = async (req, res) => {
  try {
    const { eventId } = req.body;

    // Call the service function to get attendance trends
    const { data, error } = await getEventAttendees(eventId);

    console.log("Attendance Trends:", data);

    if (error) {
      console.error("Error fetching attendance trends:", error);
      return res.status(500).json({ error: "Internal server error" });
    }

    if (!data) {
      return res.status(404).json({ error: "No attendance data found" });
    }

    const attendanceTrends = data.map((attendance) => {
      return {
        created_at: attendance.created_at,
      };
    });

    res.status(200).json(attendanceTrends);
  } catch (err) {
    console.error("Error fetching attendance trends:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getAttendanceTrendsController,
};
