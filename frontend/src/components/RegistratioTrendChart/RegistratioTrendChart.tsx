import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "./RegistratioTrendChart.css";
import { FC, useEffect, useState } from "react";
import { fetchAttendanceTrends } from "../../services/backend/managers";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface RegistratioTrendChartProps {
  eventId: string;
}

const RegistratioTrendChart: FC<RegistratioTrendChartProps> = ({ eventId }) => {
  const [data, setData] = useState({
    labels: [], // Time intervals (e.g., months)
    datasets: [
      {
        label: "Number of Registrations",
        data: [], // Counts of registrations
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.4,
      },
    ],
  });

  useEffect(() => {
    if(!eventId) return;

    const getAttendanceTrends = async () => {
      const {data, error } = await fetchAttendanceTrends(eventId);
      if (error) {
        console.error("Error fetching attendance trends:", error);
        return;
      }

      if (!data) {
        console.error("No data received for attendance trends.");
        return;
      }
    
      const groupedData = groupByTimeInterval(data, "day"); // Group by month

      const labels = Object.keys(groupedData); // Time intervals (e.g., months)
      const counts = Object.values(groupedData); // Counts of registrations

      setData({
        labels,
        datasets: [
          {
            label: "Number of Registrations",
            data: counts,
            borderColor: "rgba(75, 192, 192, 1)",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            tension: 0.4,
          },
        ],
      });

    }

    getAttendanceTrends();

  }, [eventId]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Registration Trends",
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Day",
        },
      },
      y: {
        title: {
          display: true,
          text: "Number of Registrations",
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="registration-trend-chart">
      <Line data={data} options={options} />
    </div>
  );
};

const groupByTimeInterval = (
  data: { created_at: string }[],
  interval: "month" | "day" | "week"
) => {
  const grouped: { [key: string]: number } = {};

  data.forEach((item) => {
    const date = new Date(item.created_at); // Use the correct field name

    if (isNaN(date.getTime())) {
      console.error("Invalid date encountered:", item.created_at); // Log invalid dates
      return; // Skip this item
    }

    let key: string;

    if (interval === "month") {
      key = date.toLocaleString("default", { month: "long" }); // e.g., "January"
    } else if (interval === "day") {
      key = date.toISOString().split("T")[0]; // e.g., "2025-04-08"
    } else if (interval === "week") {
      const week = Math.ceil(date.getDate() / 7); // Calculate week of the month
      key = `${date.toLocaleString("default", { month: "long" })} - Week ${week}`;
    }

    grouped[key] = (grouped[key] || 0) + 1; // Increment count for the interval
  });

  return grouped;
};

export default RegistratioTrendChart;
