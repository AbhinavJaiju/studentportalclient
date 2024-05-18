import { useEffect, useState } from "react";
import React from "react";
import { useUser } from "../lib/customHooks";
import Papa from "papaparse";

const Dashboard = () => {
  const { user, authenticated } = useUser();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(user.timeTables[0].csv.url);
        const blob = await response.blob();

        const blobUrl = URL.createObjectURL(blob);

        Papa.parse(blobUrl, {
          download: true,
          header: true,
          complete: (result) => {
            console.log(result.data)
            setData(result.data);
            setLoading(false);

          },
          error: (error) => {
            console.error('Error parsing CSV:', error);
            setLoading(false);
          }
        });

        URL.revokeObjectURL(blobUrl);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (data.length === 0) {
    return <div>No data available</div>;
  }

  const headers = Object.keys(data[0]);
  console.log(authenticated)
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
            <div className="text-xl font-bold text-gray-900 mb-4">User Details</div>
            <div className="text-gray-700 text-base">
              <div class="card shadow-sm">
          <div class="card-header bg-transparent text-center">
            <img class="profile_img" src="https://placeimg.com/640/480/arch/any" alt=""/>
            <h3>{user.firstname}</h3>
          </div>
          <div class="card-body">
            <p class="mb-0"><strong class="pr-1">Student ID:</strong>{user.studentId}</p>
            <p class="mb-0"><strong class="pr-1">Last Name:</strong>{user.lastname}</p>
            <p class="mb-0"><strong class="pr-1">Email ID:</strong>{user.email_Id}</p>
            <p class="mb-0"><strong class="pr-1">Contact Number:</strong> {user.contactNumber}</p>
            <p class="mb-0"><strong class="pr-1">Nationality:</strong>{user.nationality}</p>
            <p class="mb-0"><strong class="pr-1">Section:</strong>A</p>
          </div>
        </div>
              {console.log(user.timeTables[0].csv)}

              {headers && (
                <div className="p-4 bg-blue-100 min-h-screen">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">TimeTable</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white shadow-md rounded-lg">
                    <thead className="bg-blue-500 text-white">
                      <tr>
                        {headers.map((header) => (
                          <th key={header} className="px-4 py-2 border font-bold">
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((row, index) => (
                        <tr key={index} className="even:bg-blue-200 odd:bg-blue-100">
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
    </div>
  );
};

export default Dashboard;
