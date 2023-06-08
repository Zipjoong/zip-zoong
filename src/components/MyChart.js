//react & chakra-ui
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Button,
  Text,
  Stack,
  Container,
  SimpleGrid,
  Image,
  Flex,
  Heading,
  StackDivider,
  Icon,
  useColorModeValue,
  VStack,
  HStack,
} from "@chakra-ui/react";
//chart library
import { ResponsivePie, ResponsivePieCanvas } from "@nivo/pie";
// to do: chart library import
import { getAuth } from "firebase/auth";

//firebase
import { getStudyRecordsOfUserXIncludeSubjectName } from "./Firebase";

function remainOnlyDate(start_date_time) {
  start_date_time.setHours(0, 0, 0, 0);
  start_date_time = new Date();
  start_date_time.setDate(start_date_time.getDate());
  console.log("@@@@@@@@@@@@@@@@@@@@@@@", start_date_time);
  var nextDate = new Date();
  nextDate.setDate(start_date_time.getDate() + 1);
  console.log("################", nextDate);
  console.log(nextDate.toISOString());
  // console.log("0000으로 세팅함", start_date_time);
  // /////////////////////
  // var temp_date = new Date();
  // temp_date.setDate(start_date_time.getDate() - 1);
  // var prevDate = temp_date;
  // var nextDate = start_date_time;

  // const dateOnly1 = prevDate.toISOString().split("T")[0];
  // const dateOnly2 = nextDate.toISOString().split("T")[0];

  // return [dateOnly1, "2023-06-08"];

  /////////////////
  // var nextDate = new Date(date_time);
  // nextDate = nextDate.setDate(date_time.getDate() + 1);
  // nextDate = new Date(nextDate);
  // console.log("nextDAte", nextDate);
  const dateOnly1 = start_date_time.toISOString().split("T")[0];
  const dateOnly2 = nextDate.toISOString().split("T")[0];

  console.log("?????????????", dateOnly1, dateOnly2);
  return [dateOnly1, dateOnly2];
}

function converFirebaseDataToChartData(originData) {
  const newList = [];
  for (const d of originData) {
    newList.push({
      id: d.subject_name,
      label: d.subject_name,
      value: d.real_dura,
      color: "hsl(325, 70%, 50%)",
    });
  }
  return newList;
}

function MyChart() {
  console.log("차트 컴포넌트 로드됨");
  const [studyRecordsState, setStudyRecordsState] = useState([
    // {
    //   id: "ruby",
    //   label: "ruby",
    //   value: 251,
    //   color: "hsl(53, 70%, 50%)",
    // },
    // {
    //   id: "go",
    //   label: "go",
    //   value: 409,
    //   color: "hsl(216, 70%, 50%)",
    // },
    // {
    //   id: "sass",
    //   label: "sass",
    //   value: 479,
    //   color: "hsl(149, 70%, 50%)",
    // },
    // {
    //   id: "erlang",
    //   label: "erlang",
    //   value: 358,
    //   color: "hsl(280, 70%, 50%)",
    // },
    // {
    //   id: "php",
    //   label: "php",
    //   value: 353,
    //   color: "hsl(325, 70%, 50%)",
    // },
  ]);
  const [calData, setCalData] = useState(null);

  const location = useLocation();
  const data = location.state?.data;
  console.log("들고온 데이터", data);

  const asdf = remainOnlyDate(data.start);

  const navigate = useNavigate();
  function goBackToCalendar() {
    navigate("/calendar");
  }

  useEffect(() => {
    const fetchData = async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      await console.log("-------- useEffect start :)");
      await console.log("!!!!!!!!!!!!!!!!", asdf[0], asdf[1]);
      const studyRecordsListFromFirebase =
        await getStudyRecordsOfUserXIncludeSubjectName(
          user.uid,
          asdf[0],
          asdf[1]
        );
      await console.log(
        "studyRecordsFromFirebase",
        studyRecordsListFromFirebase
      );
      await console.log("-------- ↑firebase에서 들고온 재료");
      const piechartList = converFirebaseDataToChartData(
        studyRecordsListFromFirebase
      );
      await console.log("piechartList", piechartList);
      setStudyRecordsState(piechartList);

      await console.log("-------- useEffect end :(");
    };
    fetchData();
  }, []);

  return (
    <VStack>
      <Box>
        <Text fontSize={"6xl"}>
          하루 동안 공부한 과목들의 누적 시간들을 살펴보세요!
        </Text>
      </Box>
      <Box height={500}>
        <ResponsivePie
          height={500}
          layers={[
            "arcLinkLabels",
            "arcs",
            "arcLabels",
            "legends",
            ({ centerX, centerY, dataWithArc, arcGenerator }) => {
              const totalValue = studyRecordsState.reduce(
                (total, d) => total + d.value,
                0
              );

              return (
                <g transform={`translate(${centerX},${centerY})`}>
                  <text
                    textAnchor="middle"
                    dominantBaseline="middle"
                    style={{ fontSize: "24px", fontWeight: "bold" }}
                  >
                    {totalValue}
                  </text>
                  <text
                    y={24}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    style={{ fontSize: "16px" }}
                  >
                    Total
                  </text>
                </g>
              );
            },
          ]}
          data={studyRecordsState}
          margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
          sortByValue={true}
          innerRadius={0.55}
          padAngle={0.7}
          cornerRadius={3}
          activeOuterRadiusOffset={8}
          colors={{ scheme: "nivo" }}
          borderWidth={NaN}
          borderColor={{
            from: "color",
            modifiers: [["darker", "0.2"]],
          }}
          arcLinkLabelsSkipAngle={12}
          arcLinkLabelsTextColor="#333333"
          arcLinkLabelsThickness={2}
          arcLinkLabelsColor={{ from: "color" }}
          arcLabelsTextColor={{
            from: "color",
            modifiers: [["darker", 2]],
          }}
          legends={[]}
        />
      </Box>
      <Box height={500}>
        <ResponsivePieCanvas
          data={studyRecordsState}
          margin={{ top: 40, right: 200, bottom: 40, left: 80 }}
          innerRadius={0.5}
          padAngle={0.7}
          cornerRadius={3}
          activeOuterRadiusOffset={8}
          colors={{ scheme: "paired" }}
          borderColor={{
            from: "color",
            modifiers: [["darker", 0.6]],
          }}
          arcLinkLabelsSkipAngle={10}
          arcLinkLabelsTextColor="#333333"
          arcLinkLabelsThickness={2}
          arcLinkLabelsColor={{ from: "color" }}
          arcLabelsSkipAngle={10}
          arcLabelsTextColor="#333333"
          legends={[
            {
              anchor: "right",
              direction: "column",
              justify: false,
              translateX: 140,
              translateY: 0,
              itemsSpacing: 2,
              itemWidth: 60,
              itemHeight: 14,
              itemTextColor: "#999",
              itemDirection: "left-to-right",
              itemOpacity: 1,
              symbolSize: 14,
              symbolShape: "circle",
            },
          ]}
        />
      </Box>

      <Box>
        <Button onClick={goBackToCalendar}>캘린더로 돌아가기</Button>
      </Box>
    </VStack>
  );
}

export default MyChart;
