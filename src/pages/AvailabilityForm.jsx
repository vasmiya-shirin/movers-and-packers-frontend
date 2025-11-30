import { useState } from "react";
import API from "../api/api";

const daysList = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const AvailabilityForm = ({ provider, onUpdated }) => {
  const [locations, setLocations] = useState(provider?.availableLocations || []);
  const [startTime, setStartTime] = useState(provider?.availability?.startTime || "");
  const [endTime, setEndTime] = useState(provider?.availability?.endTime || "");
  const [days, setDays] = useState(provider?.availability?.days || []);

  const toggleDay = (day) => {
    if (days.includes(day)) {
      setDays(days.filter((d) => d !== day));
    } else {
      setDays([...days, day]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.put("/provider/availability", {
        availableLocations: locations,
        startTime,
        endTime,
        days,
      });

      onUpdated();
      alert("Availability updated");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      {/* Locations */}
      <textarea
        placeholder="Available locations (comma separated)"
        className="w-full border p-2 rounded"
        value={locations.join(", ")}
        onChange={(e) =>
          setLocations(
            e.target.value.split(",").map((loc) => loc.trim())
          )
        }
      />

      {/* Time */}
      <div className="flex gap-4">
        <div>
          <label>Start Time</label>
          <input
            type="time"
            className="block border p-2 rounded"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </div>
        <div>
          <label>End Time</label>
          <input
            type="time"
            className="block border p-2 rounded"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </div>
      </div>

      {/* Days */}
      <div className="flex flex-wrap gap-3">
        {daysList.map((day) => (
          <button
            key={day}
            type="button"
            onClick={() => toggleDay(day)}
            className={`px-3 py-1 rounded border ${
              days.includes(day) ? "bg-green-600 text-white" : "bg-gray-200"
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      <button className="px-4 py-2 bg-green-600 text-white rounded">
        Save Availability
      </button>
    </form>
  );
};

export default AvailabilityForm;
