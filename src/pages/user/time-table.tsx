import React from "react";
import { Link } from "react-router-dom";

export const TimeTable = () => {
  return (
    <div className="time-grid-container h-full relative bg-blue-500">
      {/*  */}
      <div className="time-grid-left absolute bg-indigo-300 w-10">
        <div className="left-timezone  w-full bg-violet-300">
          <div className="left-timezone-hour  h-8 w-full bg-purple-400">
            09:00
          </div>
          <div className="left-timezone-hour  h-8  bg-purple-400">10:00</div>
          <div className="left-timezone-hour  h-8  bg-purple-400">11:00</div>
          <div className="left-timezone-hour  h-8  bg-purple-400">12:00</div>
          <div className="left-timezone-hour  h-8  bg-purple-400">13:00</div>
          <div className="left-timezone-hour  h-8  bg-purple-400">14:00</div>
          <div className="left-timezone-hour  h-8  bg-purple-400">15:00</div>
          <div className="left-timezone-hour  h-8  bg-purple-400">16:00</div>
          <div className="left-timezone-hour  h-8  bg-purple-400">17:00</div>
          <div className="left-timezone-hour  h-8  bg-purple-400">18:00</div>
          <div className="left-timezone-hour  h-8  bg-purple-400">19:00</div>
          <div className="left-timezone-hour  h-8  bg-purple-400">20:00</div>
        </div>
      </div>
      {/*  */}
      <div className="time-grid-right h-full relative pl-10">
        {/* 이하 가로 줄 */}
        <div className="height-grid">
          <div className="guideline">
            <div className="guideline-half"></div>
          </div>
        </div>
        {/* 이하 세로 줄 */}
        <div className="schedule-grid absolute w-full h-full border-solid border-2 border-yellow-200">
          <div className="schedule-container flex justify-between border-solid border-2 border-green-300">
            <div className="date-column h-full border-black border-solid border-2 basis-1/6">
              <div className="schedule-block-wrap h-full relative">
                <div className="schedule-block">
                  <div className="schedule">hello</div>
                </div>
              </div>
            </div>
            <div className="date-column h-full border-black border-solid border-2 basis-1/6">
              <div className="schedule-block-wrap h-full relative">
                <div className="schedule-block">
                  <div className="schedule">hello</div>
                </div>
              </div>
            </div>
            <div className="date-column h-full border-black border-solid border-2 basis-1/6">
              <div className="schedule-block-wrap h-full relative">
                <div className="schedule-block">
                  <div className="schedule">hello</div>
                </div>
              </div>
            </div>
            <div className="date-column h-full border-black border-solid border-2 basis-1/6">
              <div className="schedule-block-wrap h-full relative">
                <div className="schedule-block">
                  <div className="schedule">hello</div>
                </div>
              </div>
            </div>
            <div className="date-column h-full border-black border-solid border-2 basis-1/6">
              <div className="schedule-block-wrap h-full relative">
                <div className="schedule-block">
                  <div className="schedule">hello</div>
                </div>
              </div>
            </div>
            <div className="date-column h-full border-black border-solid border-2 basis-1/6">
              <div className="schedule-block-wrap h-full relative">
                <div className="schedule-block">
                  <div className="schedule">hello</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
