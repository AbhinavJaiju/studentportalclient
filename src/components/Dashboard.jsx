import { useEffect, useState } from "react";
import React from "react";
import { useUser } from "../lib/customHooks";
import Papa from "papaparse";
import axios from "axios";
import { API_ROUTES } from "../utils/constants";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {

  const navigate = useNavigate();
  const { user, authenticated } = useUser();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [updateCount, setUpdateCount] = useState(0);
  const [notices, setNotice] = useState();

  console.log('jullo',user);
  const [noticeCount, setNoticeCount] = useState(0);

  useEffect(() => {
    if (user && user.requests) {
      setNoticeCount(user.requests.length);
      console.log('hello',user)
    }
    const fetchData = async () => {
      try {
        const response = await fetch(user.timeTables[0].csv.url);
        const blob = await response.blob();

        const blobUrl = URL.createObjectURL(blob);

        Papa.parse(blobUrl, {
          download: true,
          header: true,
          complete: (result) => {
            console.log(result.data);
            setData(result.data);
            setLoading(false);
          },
          error: (error) => {
            console.error("Error parsing CSV:", error);
            setLoading(false);
          },
        });

        URL.revokeObjectURL(blobUrl);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
      try {
        const response = await axios.get(API_ROUTES.GET_NOTICE);
        console.log(response.data);
        setNotice(response.data);
    } catch (err) {
        console.error('Error fetching notices:', err);
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
    navigate('/signin');
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (data.length === 0) {
    return <div>No data available</div>;
  }

  const headers = Object.keys(data[0]);
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
      <div className="text-4xl mb-8 font-bold text-white">Dashboard</div>
      {user && (
        <div className="max-w-sm mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4">
            <div className="text-xl font-bold text-gray-900 mb-4">
              User Details
            </div>
            <div className="text-gray-700 text-base">
              <div class="card shadow-sm">
                <div class="card-header bg-transparent text-center">
                  <img
                    class="profile_img"
                    src="https://placeimg.com/640/480/arch/any"
                    alt=""
                  />
                  <h3>{user.firstname}</h3>
                </div>
                <div class="card-body">
                  <p class="mb-0">
                    <strong class="pr-1">Student ID:</strong>
                    {user.studentId}
                  </p>
                  <p class="mb-0">
                    <strong class="pr-1">Last Name:</strong>
                    {user.lastname}
                  </p>
                  <p class="mb-0">
                    <strong class="pr-1">Email ID:</strong>
                    {user.email_Id}
                  </p>
                  <p class="mb-0">
                    <strong class="pr-1">Contact Number:</strong>{" "}
                    {user.contactNumber}
                  </p>
                  <p class="mb-0">
                    <strong class="pr-1">Nationality:</strong>
                    {user.nationality}
                  </p>
                  <p class="mb-0">
                    <strong class="pr-1">Section:</strong>A
                  </p>
                </div>
              </div>
              {console.log(user.timeTables[0].csv)}

              {headers && (
                <div className="p-4 bg-blue-100 min-h-screen">
                  <h2 className="text-2xl font-bold mb-4 text-gray-800">
                    TimeTable
                  </h2>
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white shadow-md rounded-lg">
                      <thead className="bg-blue-500 text-white">
                        <tr>
                          {headers.map((header) => (
                            <th
                              key={header}
                              className="px-4 py-2 border font-bold"
                            >
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {data.map((row, index) => (
                          <tr
                            key={index}
                            className="even:bg-blue-200 odd:bg-blue-100"
                          >
                            {headers.map((header) => (
                              <td key={header} className="px-4 py-2 border">
                                <span className="font-bold">{row[header]}</span>
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div>
        <h2>Send Request to Admin</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="title">Title:</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>
          <button type="submit">Send Request</button>
        </form>
      </div>
      <button type="button" onClick={signOut}>
        Sign Out
      </button>
      <h2>Notice Board</h2>
            <table className="notice-table">
                <thead>
                    <tr>
                        {/* <th>ID</th>
                        <th>Title</th>
                        <th>Date</th> */}
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody>
                    {notices.notice.map((notice) => (
                        <tr key={notice.noticeId}>
                            {/* <td>{notice.id}</td>
                            <td>{notice.title}</td>
                            <td>{notice.date}</td> */}
                            <td>{notice.noticeDescription}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
    </div>
  );
};

export default Dashboard;
