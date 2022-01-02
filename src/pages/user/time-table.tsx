import React from "react";
import { Link } from "react-router-dom";

export const TimeTable = () => {
  return (
    <div>
      <h1 className=" text-3xl">table</h1>
      <Link className="text-sky-400" to="/create-patient">
        create-patient
      </Link>
    </div>
  );
};
