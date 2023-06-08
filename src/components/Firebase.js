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

async function getUsersREST(uid) {
  if (uid) {
    //uid가 있는 경우 한명의 유저를 들고옴
    console.log("uid가 있습니다.", uid);
  } else {
    //uid가 없는 경우 모든유저를 들고옴.
    console.log("uid 없음.", uid);
    const querySnapshot = await getDocs(collection(db, "users"));
  }
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

async function getStudyRecordsOfUserXForCalendar(uid) {
  // 1. uid 에 해당하는 공부기록들을 모두 찾음
  const studyRecordsQuery = query(
    collection(db, "STUDY_RECORDS"),
    where("user_id", "==", uid)
  );
  const studyRecordsQuerySnapshot = await getDocs(studyRecordsQuery);

  // 리스트에 저장하는 방법1
  // const rawData_studyRecords = [];
  // studyRecordsQuerySnapshot.forEach((doc) => {
  //   rawData_studyRecords.push(doc.data());
  // });
  // 리스트에 저장하는 방법2
  const studyRecordsList = studyRecordsQuerySnapshot.docs.map((doc) =>
    doc.data()
  );
  await console.log("studyRecordsList", studyRecordsList);

  // 3. uid 에 해당하는 과목들 불러오기
  const subjectsRef = collection(db, "STUDY_SUBJECTS_TEST");
  const subjectsQuery = query(subjectsRef, where("user_id", "==", uid));
  const subjectsQuerySnapshot = await getDocs(subjectsQuery);

  const subjectsList = [];
  await subjectsQuerySnapshot.forEach((doc) => {
    const newSubjectsObject = doc.data();
    newSubjectsObject.subject_id = doc.id;
    subjectsList.push(newSubjectsObject);
  });
  await console.log("subjectsList", subjectsList);

  // 만들어야 하는 구조
  // {subject_id: ㅁㅁ, start_time: ㅁㅁ, end_time: ㅁㅁ, subject_name: ㅁㅁ}
  const mergedArray = studyRecordsList.map((item) => {
    const { subject_id, start_time, end_time } = item;
    const isMatchedItemExist = subjectsList.find(
      (item) => item.subject_id === subject_id
    );
    const subject_name = isMatchedItemExist
      ? isMatchedItemExist.subject_name
      : "";

    return {
      subject_id,
      start_time,
      end_time,
      subject_name,
    };
  });
  await console.log("mergedArray", mergedArray);

  return mergedArray;
}
function convertToUTC(koreaTime) {
  const date = new Date(koreaTime);
  const utcTime = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
  return utcTime.toISOString();
}

async function getStudyRecordsOfUserXIncludeSubjectName(uid, fromA, toB) {
  // 1. uid 에 해당하는 공부기록들을 모두 찾음
  const studyRecordsQuery = query(
    collection(db, "STUDY_RECORDS"),
    where("user_id", "==", uid)
  );
  // todo: 1-1. 원하는 날짜로 공부기록들 필터링
  const fromNow = convertToUTC(fromA);
  const query2 = query(
    studyRecordsQuery,
    where("start_time", ">=", new Date(fromNow))
  );
  const query3 = query(query2, where("start_time", "<=", new Date(toB)));
  const studyRecordsQuerySnapshot = await getDocs(query3);

  // 리스트에 저장하는 방법1
  // const rawData_studyRecords = [];
  // studyRecordsQuerySnapshot.forEach((doc) => {
  //   rawData_studyRecords.push(doc.data());
  // });

  // 리스트에 저장하는 방법2
  const studyRecordsList = studyRecordsQuerySnapshot.docs.map((doc) =>
    doc.data()
  );
  await console.log("studyRecordsList", studyRecordsList);

  // 2. 공부기록들을 { subject_id : ㅁㅁ, duration : ㅁㅁ } 의 배열로 만듬.
  const StudyRecordsListWithEachStudyDuration = [];
  studyRecordsList.forEach((item) => {
    const { subject_id, end_time, start_time } = item;
    const duration = end_time.seconds - start_time.seconds;
    const isItemExist = StudyRecordsListWithEachStudyDuration.find(
      (item) => item.subject_id === subject_id
    );
    if (isItemExist) {
      isItemExist.duration += duration;
    } else {
      StudyRecordsListWithEachStudyDuration.push({ subject_id, duration });
    }
  });
  await console.log(
    "StudyRecordsList With EachStudyDuration",
    StudyRecordsListWithEachStudyDuration
  );

  // 3. uid 에 해당하는 과목들 불러오기
  const subjectsRef = collection(db, "STUDY_SUBJECTS_TEST");
  const subjectsQuery = query(subjectsRef, where("user_id", "==", uid));
  const subjectsQuerySnapshot = await getDocs(subjectsQuery);

  const subjectsList = [];
  await subjectsQuerySnapshot.forEach((doc) => {
    const newSubjectsObject = doc.data();
    newSubjectsObject.subject_id = doc.id;
    subjectsList.push(newSubjectsObject);
  });
  await console.log("subjectsList", subjectsList);

  // 4. 과목id, 공부시간, 과목이름이 들어있는 리스트 만듬: {subject_id: ㅁㅁ, duration: ㅁㅁ, subject_name: ㅁㅁ}
  const mergedArray = StudyRecordsListWithEachStudyDuration.map((item) => {
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
  await console.log("mergedArray", mergedArray);

  return mergedArray;
}

async function joinAandB(A, B, A_id, B_id) {}

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
  getStudyRecordsOfUserXForCalendar,
  getStudyRecordsOfUserXIncludeSubjectName,
  getUsersREST,
};
