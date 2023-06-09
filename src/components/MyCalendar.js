//react & chakra-ui
import React, { useCallback, useEffect, useState } from "react";
import { Box } from "@chakra-ui/react";
//calendar library
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
//firebase
import { getStudyRecordsOfUserXForCalendar } from "./Firebase";
import { useNavigate } from "react-router-dom";
import { getAuth } from "@firebase/auth";

const palette = ["rgba(0,0,255,2)", "rgba(0,0,255,1)", "rgba(0,0,255,0.2)"];

function formatTime(time) {
  if (!time) {
    return `00:00:00`;
  } else {
    const hours = Math.floor(time / 3600)
      .toString()
      .padStart(2, "0");
    const minutes = Math.floor((time % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (time % 60).toString().padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  }
}

function convertFirebaseDataToCalendarData(studyRecordsForEachSubject) {
  const calEvents = [];
  for (var i = 0; i < studyRecordsForEachSubject.length; i++) {
    // console.log("study records i", studyRecordsForEachSubject[i]);
    // const studyDuration =
    //   studyRecordsForEachSubject[i].end_time.seconds -
    //   studyRecordsForEachSubject[i].start_time.seconds;
    const studyDuration = studyRecordsForEachSubject[i].real_study_time;
    // const seletedColor =
    //   palette[studyRecordsForEachSubject[i].subject_id % palette.length];
    console.log(studyDuration, "STUDY");
    const colorPower = studyDuration / 60;
    const seletedColor = "rgba(0,0,255," + colorPower + ")";
    calEvents.push({
      title:
        studyRecordsForEachSubject[i].subject_name +
        "  " +
        formatTime(studyDuration),
      // studyRecordsForEachSubject[i].subject_name +
      // " " +
      // Math.floor(studyDuration / 3600) +
      // ":" +
      // Math.floor(studyDuration / 60) +
      // ":" +
      // (studyDuration % 60),
      start: new Date(studyRecordsForEachSubject[i].start_time.seconds * 1000),
      end: new Date(studyRecordsForEachSubject[i].end_time.seconds * 1000),
      color: seletedColor,
    });
  }

  return calEvents;
}

const eventStyleGetter = (event) => {
  const style = {
    backgroundColor: event.color, // 이벤트 색상을 배경색으로 지정
    color: "white", // 텍스트 색상
    borderRadius: "5px",
    border: "none",
    display: "block",
  };
  return {
    style: style,
  };
};

function MyCalendar() {
  const [studyRecordsState, setStudyRecordsState] = useState([
    {
      title: "title",
      // allDay: true,
      start: Date.now(),
      end: Date.now(),
      pk: "1",
    },
  ]);

  const navigate = useNavigate();
  const moveToChart = (calEvent) => {
    console.log("클릭한 캘린더 이벤트", calEvent);
    navigate("/chart", { state: { data: calEvent } });
  };

  useEffect(() => {
    const fetchData = async () => {
      await console.log("-------- useEffect start :)");

      //auth 먼저하고 calendar 값들 불러오기
      const auth = getAuth();
      const user = auth.currentUser;
      const studyRecordsFromFirebase = await getStudyRecordsOfUserXForCalendar(
        user.uid
      );
      await console.log(
        "studyRecordsListFromFirebase",
        studyRecordsFromFirebase
      );
      await console.log("-------- ↑firebase에서 들고온 재료");
      const studyRecordsForCalendarEvents = convertFirebaseDataToCalendarData(
        studyRecordsFromFirebase
      );
      await console.log(
        "studyRecordsForCalendarEvents",
        studyRecordsForCalendarEvents
      );
      setStudyRecordsState(studyRecordsForCalendarEvents);
      await console.log("-------- useEffect end :(");
    };
    fetchData();
  }, []);

  moment.locale("ko-KR");
  const localizer = momentLocalizer(moment);

  return (
    <Box>
      <Calendar
        localizer={localizer}
        events={studyRecordsState}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 800, margin: "50px" }}
        onSelectEvent={moveToChart}
        eventPropGetter={eventStyleGetter}
      />
    </Box>
  );
}

export default MyCalendar;
