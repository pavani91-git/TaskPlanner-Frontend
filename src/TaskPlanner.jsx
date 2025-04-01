import { useState } from "react";
import "./styles/TaskPlanner.css"; // Ensure CSS file exists

const TaskPlanner = () => {
  const [tasks, setTasks] = useState("");
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      const taskList = tasks
        .split(",")
        .map((task) => task.trim())
        .filter((task) => task);
      const plannedSchedule = generateSchedule(taskList);
      setSchedule(plannedSchedule);
      setLoading(false);
    }, 1000);
  };

  const generateSchedule = (taskList) => {
    if (taskList.length === 0) {
      return { tasks: [], explanation: "No tasks provided!" };
    }

    let now = new Date();
    now.setMinutes(now.getMinutes() + 5); // Start first task 5 minutes from now

    let schedule = taskList.map((task, index) => {
      let taskTime = new Date(now.getTime() + index * 30 * 60000); // Add 30 mins per task
      let formattedTime = formatTime(taskTime);

      return { time: formattedTime, task: task };
    });

    let explanation = `Your tasks are scheduled dynamically starting from ${formatTime(
      now
    )} with 30-minute intervals.`;

    return { tasks: schedule, explanation };
  };

  const formatTime = (date) => {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12; // Convert 24-hour to 12-hour format
    minutes = minutes < 10 ? "0" + minutes : minutes;
    return `${hours}:${minutes} ${ampm}`;
  };

  return (
    <div className="app-container">
      <div className="planner-box">
        <h1>Dynamic Task Planner</h1>
        <p>Type your tasks (comma-separated):</p>

        <form onSubmit={handleSubmit}>
          <textarea
            value={tasks}
            onChange={(e) => setTasks(e.target.value)}
            placeholder="e.g., Run 20 mins, Mow lawn, Prep for meeting..."
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Planning..." : "Plan My Day"}
          </button>
        </form>

        {loading && (
          <div className="spinner-container">
            <div className="spinner"></div>
          </div>
        )}

        {schedule && (
          <div className="schedule">
            <h2>Your Schedule</h2>
            <ul>
              {schedule.tasks.map((task, i) => (
                <li key={i}>
                  {task.time}: {task.task}
                </li>
              ))}
            </ul>
            <h3>Why This Way?</h3>
            <p>{schedule.explanation}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskPlanner;
