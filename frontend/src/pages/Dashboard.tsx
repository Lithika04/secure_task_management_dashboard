//wrap the renders taskList --> responsible for actual feature
//resued anywhere if needed

import React from "react";
import TaskList from "../components/Tasks/TaskList";

const Dashboard: React.FC = () => {
  return <TaskList />;
};
export default Dashboard;
