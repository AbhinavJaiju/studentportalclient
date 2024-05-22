import React, { useState, useEffect } from "react";
import { useAdmin } from "../lib/customHooks";
import "../styles/adminDashboard.module.css";
import axios from "axios";
import { API_ROUTES } from "../utils/constants";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [updateCount, setUpdateCount] = useState(0);
  const { user, authenticated } = useAdmin(updateCount);
  const [noticeCount, setNoticeCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");
  const [lastNotice, setLastNotice] = useState(null);
  const [toggleState, setToggleState] = useState(false); // Toggle state

  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.admin && user.admin.notices) {
      setNoticeCount(user.admin.notices.length);
      setLastNotice(user.admin.notices[user.admin.notices.length - 1]);
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    let ID = noticeCount + 1;

    try {
      const response = await axios.post(API_ROUTES.CREATE_NOTICE, {
        email: user.admin.adminEmail,
        id: ID,
        description: content,
        active: toggleState,
      });
      setMessage("Notice uploaded successfully!");
      setTitle("");
      setContent("");
      setNoticeCount(ID); // Update notice count
      // Trigger re-fetch by updating updateCount
      setUpdateCount((prevCount) => prevCount + 1);
      console.log(response);
    } catch (error) {
      setMessage("Failed to upload notice.");
      console.error("Error uploading notice:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleActive = async (noticeId) => {
    // Implement the publish functionality here
    console.log("Publish notice with ID:", noticeId);
    // Example:
    // await axios.post("/api/notices/publish", { noticeId });
  };

  const handleDelete = async (noticeId, ID) => {
    console.log(ID);
    setLoading(true);
    try {
      const response = await axios.post(API_ROUTES.DELETE_NOTICE, {
        ID,
      });
      console.log(response);
      setUpdateCount((prevCount) => prevCount + 1);
    } catch (error) {
      setMessage("Failed to delete notice.");
      console.error("Error deleting notice:", error);
    } finally {
      setLoading(false);
    }
    console.log("Delete notice with ID:", noticeId);
    // Example:
    // await axios.delete(`/api/notices/${noticeId}`);
  };

  const handleToggleActive = async (notice) => {
    try {
      const id = notice.id;
      const active = !notice.active;
      await axios.post(API_ROUTES.UPDATE_NOTICE, { id, active });
      setMessage("Notice updated successfully!");

      // Trigger re-fetch by updating updateCount
      setUpdateCount((prevCount) => prevCount + 1);
    } catch (error) {
      setMessage("Failed to update notice.");
      console.error("Error updating notice:", error);
    }
  };
  const handleToggle = () => {
    setToggleState(!toggleState); // Toggle the state
  };

  const parseCSV = (text) => {
    const lines = text.split("\n");
    const notices = lines.map((line) => {
      const [noticeId, noticeDescription, active] = line.split(",");
      return {
        noticeId: parseInt(noticeId),
        noticeDescription,
        active: active === "true",
      };
    });
    return notices;
  };

  const handleFileUpload = async (event, studentEmail) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target.result;
      const notices = parseCSV(text);
      try {
        await axios.post("/api/notices/bulk", { notices, studentEmail });
        setMessage("Notices uploaded successfully!");
        setUpdateCount((prevCount) => prevCount + 1);
      } catch (error) {
        setMessage("Failed to upload notices.");
        console.error("Error uploading notices:", error);
      }
    };
    reader.readAsText(file);
  };

  function signOut() {
    // Clear token from localStorage
    localStorage.removeItem("token");

    // Redirect or perform any other necessary actions
    // For example, redirect to a sign-in page
    navigate('/signin');
  }

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-details">
        <h2>Admin Details</h2>
        <p>
          <strong>Name:</strong> {user.admin.adminName}
        </p>
        <p>
          <strong>Email:</strong> {user.admin.adminEmail}
        </p>
        <p>
          <strong>ID:</strong> {user.admin.adminId}
        </p>
        <p>
          <strong>Slug:</strong> {user.admin.adminSlug}
        </p>
      </div>

      <div className="student-details">
        <h2>Student Details</h2>
        {user.admin.studentDetails.map((student, index) => (
          <div key={index} className="student-card">
            <p>
              <strong>First Name:</strong> {student.firstname}
            </p>
            <p>
              <strong>Email:</strong> {student.email_Id}
            </p>
            <div className="csv-upload">
              <h3>Upload Notices for {student.firstname}</h3>
              <input
                type="file"
                accept=".csv"
                onChange={(event) => handleFileUpload(event, student.email_Id)}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="notice-upload">
        <h2>Upload Notice</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="id">ID:</label>
            <input type="number" id="id" value={noticeCount + 1} readOnly />
          </div>
          <div className="form-group">
            <label htmlFor="content">Content:</label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            ></textarea>
          </div>

          <button type="button" onClick={handleToggle}>
            {toggleState ? "Set to False" : "Set to True"}
          </button>
          <p>
            <strong>Toggle State:</strong> {toggleState.toString()}
          </p>

          <button type="submit" disabled={loading}>
            {loading ? "Uploading..." : "Upload Notice"}
          </button>
        </form>
        {message && <p className="message">{message}</p>}
      </div>

      {/* {lastNotice && (
        <div className="last-notice">
          <h2>Last Notice</h2>
          <p>
            <strong>ID:</strong> {lastNotice.noticeId}
          </p>
          <p>
            <strong>Description:</strong> {lastNotice.noticeDescription}
          </p>
          <button onClick={() => handlePublish(lastNotice.noticeId, lastNotice.id)}>
            Publish
          </button>
          <button onClick={() => handleDelete(lastNotice.noticeId, lastNotice.id)}>
            Delete
          </button>
        </div>
      )} */}

      {/* notice table */}
      {user.admin.notices && user.admin.notices.length > 0 && (
        <div className="notice-list">
          <h2>Notices</h2>
          <table className="notice-table">
            <thead>
              <tr>
                <th>Notice ID</th>
                <th>Description</th>
                <th>Active</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {user.admin.notices.map((notice) => (
                <tr key={notice.id}>
                  <td>{notice.noticeId}</td>
                  <td>{notice.noticeDescription}</td>
                  <td>{notice.active ? "True" : "False"}</td>
                  <td>
                    <button onClick={() => handleToggleActive(notice)}>
                      {notice.active ? "Deactivate" : "Activate"}
                    </button>
                    <button
                      onClick={() => handleDelete(notice.noticeId, notice.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <h2>Requests</h2>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Student Name</th>
          </tr>
        </thead>
        <tbody>
          {console.log(user.admin.requests)}
          {user.admin.requests.map((request) => (
            <tr key={request.id}>
              <td>{request.requestTitle}</td>
              <td>{request.requestDescription}</td>
              <td>{`${request.studentDetail.firstname} ${request.studentDetail.lastname}`}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button type="button" onClick={signOut}>
        Sign Out
      </button>
    </div>
  );
};

export default AdminDashboard;
