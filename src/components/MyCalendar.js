//react & chakra-ui
import React, { useEffect, useState } from "react";
import { Box } from "@chakra-ui/react";
//calendar library
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
//firebase
import { getUsersFromDB, getUserStudyRecordsFromDB } from "./Firebase";

function convertUserStudyRecords_ForCalendarEvents(studyRecord) {
  var calEvents = [];
  for (var i = 0; i < studyRecord.length; i++) {
    console.log("study records i", studyRecord[i]);
    const studyTime =
      studyRecord[i].end_time.seconds - studyRecord[i].start_time.seconds;
    console.log("study time: ", studyTime);
    calEvents.push({
      title: studyTime / 60 + "분 공부",
      start: new Date(studyRecord[i].start_time.seconds * 1000),
      end: new Date(studyRecord[i].end_time.seconds * 1000),
    });
  }

  console.log("calEvents", calEvents);
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
  console.log(studyRecordsState);

  useEffect(() => {
    const fetchData = async () => {
      await getUsersFromDB();
      const studyRecordsFromFB = await getUserStudyRecordsFromDB();
      const studyRecordsForCalendarEvents =
        convertUserStudyRecords_ForCalendarEvents(studyRecordsFromFB);
      await setStudyRecordsState(studyRecordsForCalendarEvents);
      await console.log("useEffect end :(");
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
