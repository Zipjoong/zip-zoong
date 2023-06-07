//react & chakra-ui
import React, { useEffect, useState } from "react";
import { Box, Text } from "@chakra-ui/react";
//chart library
import { ResponsivePie } from "@nivo/pie";
// to do: chart library import
import { getAuth } from "firebase/auth";

//firebase
import { getStudyRecordsOfUserXIncludeSubjectName } from "./Firebase";

function MyChart() {
  const [studyRecordsState, setStudyRecordsState] = useState([
    {
      id: "ruby",
      label: "ruby",
      value: 251,
      color: "hsl(53, 70%, 50%)",
    },
    {
      id: "go",
      label: "go",
      value: 409,
      color: "hsl(216, 70%, 50%)",
    },
    {
      id: "sass",
      label: "sass",
      value: 479,
      color: "hsl(149, 70%, 50%)",
    },
    {
      id: "erlang",
      label: "erlang",
      value: 358,
      color: "hsl(280, 70%, 50%)",
    },
    {
      id: "php",
      label: "php",
      value: 353,
      color: "hsl(325, 70%, 50%)",
    },
  ]);

  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    const fetchData = async () => {
      await console.log("-------- useEffect start :)");
      const studyRecordsListFromFirebase =
        await getStudyRecordsOfUserXIncludeSubjectName("0");
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
    <Box>
      <Text>asdf</Text>
      <Text>hello</Text>

      <Box height={500}>
        <ResponsivePie
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
    </Box>
  );
}

function converFirebaseDataToChartData(originData) {
  const newList = [];
  for (const d of originData) {
    newList.push({
      id: d.subject_name,
      label: d.subject_name,
      value: d.duration / 60,
      color: "hsl(325, 70%, 50%)",
    });
  }
  return newList;
}

export default MyChart;
