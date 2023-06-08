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

const palette = ["rgba(0,0,255,2)", "rgba(0,0,255,1)", "rgba(0,0,255,0.2)"];

function convertFirebaseDataToCalendarData(studyRecordsForEachSubject) {
  const calEvents = [];
  for (var i = 0; i < studyRecordsForEachSubject.length; i++) {
    // console.log("study records i", studyRecordsForEachSubject[i]);
    const studyDuration =
      studyRecordsForEachSubject[i].end_time.seconds -
      studyRecordsForEachSubject[i].start_time.seconds;
    // const seletedColor =
    //   palette[studyRecordsForEachSubject[i].subject_id % palette.length];
    const a = studyDuration / 60 / 150;
    const seletedColor = "rgba(0,0,255," + a + ")";
    calEvents.push({
      title:
        studyRecordsForEachSubject[i].subject_name +
        " " +
        studyDuration / 60 +
        "분",
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

      const studyRecordsFromFirebase = await getStudyRecordsOfUserXForCalendar(
        "0"
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
