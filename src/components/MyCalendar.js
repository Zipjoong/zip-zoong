//react & chakra-ui
import React, { useEffect, useState } from "react";
import { Box } from "@chakra-ui/react";
//calendar library
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
//firebase
import { getStudyRecordsOfUserXForCalendar } from "./Firebase";

function convertFirebaseDataToCalendarData(studyRecordsForEachSubject) {
  const calEvents = [];
  for (var i = 0; i < studyRecordsForEachSubject.length; i++) {
    // console.log("study records i", studyRecordsForEachSubject[i]);
    const studyDuration =
      studyRecordsForEachSubject[i].end_time.seconds -
      studyRecordsForEachSubject[i].start_time.seconds;
    calEvents.push({
      title:
        studyRecordsForEachSubject[i].subject_name +
        " " +
        studyDuration / 60 +
        "분 공부",
      start: new Date(studyRecordsForEachSubject[i].start_time.seconds * 1000),
      end: new Date(studyRecordsForEachSubject[i].end_time.seconds * 1000),
    });
  }

  return calEvents;
}

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
      />
    </Box>
  );
}

export default MyCalendar;
