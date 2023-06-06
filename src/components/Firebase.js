import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function getUsersFromDB() {
  const usersCol = collection(db, "users");
  const userSnapshot = await getDocs(usersCol);
  // console.log('userSnapshot', userSnapshot);
  // console.log('userSnapshot.docs', userSnapshot.docs);
  const userList = userSnapshot.docs.map((doc) => doc.data());
  console.log("userList", userList);

  return userList;
}

async function getUsers(db) {
  const querySnapshot = await getDocs(collection(db, "users"));
  const querySnapshot2 = await getDocs(
    collection(querySnapshot, "study_record")
  );
  console.log("222", querySnapshot2);
  console.log("querySnapshot", querySnapshot);
  console.log("querySnapshot.docs", querySnapshot.docs);
  // console.log('testing', querySnapshot.docs.data);
  console.log("forEachDoc");
  querySnapshot.forEach((doc) => {
    console.log(doc.data());
  });
  console.log("!!!!!!!!!!!!!!!!!!!!!!!");
  console.log(querySnapshot.docs[0].data());
  getDocs(collection());
}

async function getUserStudyRecordsFromDB() {
  const querySnapshot = await getDocs(collection(db, "/STUDY_RECORDS"));
  const studyRecords = querySnapshot.docs.map((doc) => doc.data());
  console.log("studyRecords", studyRecords);

  return studyRecords;
}

async function getUserStudyRecordsFromDB2(userId) {
  const studyRecordsQuery = query(
    collection(db, "STUDY_RECORDS"),
    where("user_id", "==", userId)
  );
  const studyRecordsQuerySnapshot = await getDocs(studyRecordsQuery);
  // console.log('studyRecordsQuerySnapshot', studyRecordsQuerySnapshot.docs);

  const rawData_studyRecords = [];
  studyRecordsQuerySnapshot.forEach((doc) => {
    rawData_studyRecords.push(doc.data());
  });
  await console.log(rawData_studyRecords);

  ////////////////////////
  const durationBySubjectId = [];

  rawData_studyRecords.forEach((item) => {
    const { subject_id, end_time, start_time } = item;
    const duration = end_time.seconds - start_time.seconds;

    const isItemExist = durationBySubjectId.find(
      (item) => item.subject_id === subject_id
    );
    if (isItemExist) {
      isItemExist.duration += duration;
    } else {
      durationBySubjectId.push({ subject_id, duration });
    }
  });

  console.log("durationBySubjectId", durationBySubjectId);

  /////////////////////////////////////////////////////////
  const subjectsRef = collection(db, "STUDY_SUBJECTS_TEST");
  const subjectsQuery = query(subjectsRef, where("user_id", "==", userId));
  const subjectsQuerySnapshot = await getDocs(subjectsQuery);
  const subjectsList = [];
  await subjectsQuerySnapshot.forEach((doc) => {
    const newSubjectsObject = doc.data();
    newSubjectsObject.subject_id = doc.id;
    subjectsList.push(newSubjectsObject);
  });
  await console.log("subjectsList", subjectsList);

  // /////////////////////////////////////

  const mergedArray = durationBySubjectId.map((item) => {
    const { subject_id, duration } = item;
    const matchingItem = subjectsList.find(
      (item) => item.subject_id === subject_id
    );
    const subject_name = matchingItem ? matchingItem.subject_name : "";

    return {
      subject_id,
      duration,
      subject_name,
    };
  });

  // mergedArray();
  await console.log(mergedArray);

  ///////////////////////
  // // 공부 기록을 담을 배열

  // // study_records 컬렉션의 각 문서에 대해 반복
  // for (const doc of studyRecordsquerySnapshot.docs) {
  //   const recordData = doc.data();
  //   const subjectId = recordData.subject_id;
  //   const startTime = recordData.start_time;
  //   const endTime = recordData.end_time;

  //   // study_subjects 컬렉션에서 해당 과목 정보 조회
  //   const subjectDoc = await db
  //     .collection('STUDY_SUBJECTS_TEST')
  //     .doc(subjectId)
  //     .get();

  //   if (subjectDoc.exists) {
  //     const subjectData = subjectDoc.data();
  //     const subjectName = subjectData.subject_name;

  //     // 각 과목의 공부 시간 계산
  //     const studyTime = endTime - startTime;

  //     // 결과 리스트에 과목 이름과 공부 시간 추가
  //     recordsList.push({
  //       subjectName,
  //       studyTime,
  //     });
  //   } else {
  //     console.log('해당 과목이 존재하지 않습니다.');
  //   }
  // }

  // console.log(recordsList);
  return mergedArray;
}

async function writeUsers(db) {
  // try {
  //   const docRef = await addDoc(collection(db, 'users'), {
  //     first: 'Junhyeong',
  //     last: 'Park',
  //     born: 2020,
  //   });
  //   console.log('Document written with ID: ', docRef.id);
  // } catch (e) {
  //   console.error('Error adding document: ', e);
  // }
}

export {
  getUsersFromDB,
  getUserStudyRecordsFromDB,
  getUserStudyRecordsFromDB2,
};
