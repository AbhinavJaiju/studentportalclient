import { useEffect, useState } from "react";
import React from "react";
import { useUser } from "../lib/customHooks";
import Papa from "papaparse";
import axios from "axios";
import { API_ROUTES } from "../utils/constants";
import { useNavigate } from "react-router-dom";
import NoticeBoard from "./NoticeBoard";
import SubjectCalendar from "./CalenderComponent";
import styles from "../styles/studentDashboard.module.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, authenticated } = useUser();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [updateCount, setUpdateCount] = useState(0);
  const [notices, setNotice] = useState();

  console.log("jullo", user);
  const [noticeCount, setNoticeCount] = useState(0);

  useEffect(() => {
    if (user && user.requests) {
      setNoticeCount(user.requests.length);
      console.log("hello", user);
    }
    const fetchData = async () => {
      try {
        const response = await axios.get(API_ROUTES.GET_NOTICE);
        console.log(response.data);
        setNotice(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching notices:", err);
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Hardcoded admin email
    const adminEmail = "admin@example.com";
    let ID = noticeCount + 1;

    // Send request data to the backend or handle it as needed
    const requestData = {
      adminEmail,
      title,
      description,
    };
    try {
      const response = await axios.post(API_ROUTES.CREATE_REQUEST, {
        email: user.email_Id,
        id: ID,
        description: description,
        title: title,
      });

      setNoticeCount(ID); // Update notice count
      // Trigger re-fetch by updating updateCount
      setUpdateCount((prevCount) => prevCount + 1);
      console.log(response);
    } catch (error) {
      console.error("Error uploading notice:", error);
    } finally {
      setLoading(false);
    }

    // Reset form fields
    setTitle("");
    setDescription("");

    // Handle further actions (e.g., send request data to the backend)
    console.log("Request Data:", requestData);
  };

  function signOut() {
    // Clear token from localStorage
    localStorage.removeItem("token");

    // Redirect or perform any other necessary actions
    // For example, redirect to a sign-in page
    navigate("/signin");
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (user.length === 0) {
    return <div>No data available</div>;
  }

  console.log(authenticated);
  if (!user || !authenticated) {
    return (
      <div className="p-16 bg-gray-800 h-screen">
        <div className="text-2xl mb-4 font-bold text-white">Dashboard</div>
        <div className="ml-2 w-8 h-8 border-l-2 rounded-full animate-spin border-white" />
      </div>
    );
  }

  return (
    <div className="p-16 bg-gray-800 h-screen">
      {notices &&
        notices.notice.map((notice) => <NoticeBoard notices={notice} />)}
      <div className="text-4xl mb-8 font-bold text-white">Dashboard</div>
      {user && (
        <>
          <div className={styles.userDetailsContainer}>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <img
                  className={styles.profileImg}
                  src="https://placeimg.com/640/480/arch/any"
                  alt=""
                />
                <h3>{user.firstname}</h3>
              </div>
              <div className={styles.cardBody}>
                <p>
                  <strong>Student ID:</strong> {user.studentId}
                </p>
                <p>
                  <strong>Last Name:</strong> {user.lastname}
                </p>
                <p>
                  <strong>Email ID:</strong> {user.email_Id}
                </p>
                <p>
                  <strong>Contact Number:</strong> {user.contactNumber}
                </p>
                <p>
                  <strong>Nationality:</strong> {user.nationality}
                </p>
                <p>
                  <strong>Section:</strong> A
                </p>
              </div>
            </div>
          </div>
          <div className={styles.timetable}>
            <h2>TimeTable</h2>
            <SubjectCalendar events={user.subjectDates} />
          </div>
        </>
      )}

<div className={styles.container}>
      <h2 className={styles.heading}>Send Request to Admin</h2>
      <form onSubmit={handleSubmit} className={styles.requestForm}>
        <div className={styles.formGroup}>
          <label htmlFor="title" className={styles.label}>Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="description" className={styles.label}>Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className={styles.textarea}
          ></textarea>
        </div>
        <button type="submit" className={styles.submitButton}>Send Request</button>
      </form>
      <button type="button" className={styles.signoutButton} onClick={signOut}>
        Sign Out
      </button>
    </div>
    </div>
  );
};

export default Dashboard;
