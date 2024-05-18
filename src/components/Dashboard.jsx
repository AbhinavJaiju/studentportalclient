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
      <div className="text-2xl mb-4 font-bold text-white"> Dashboard </div>
      {user && (
        <div className="text-white">
          <div className="text-lg text-bold mb-2"> User Details </div>
          <div className="flex">
            <div className="w-24 font-medium"></div>
            <div>
              {/* <div>Email:{user.email} </div> */}
              <div> firstName:{user.firstname} </div>
              <div>lastName: {user.lastname} </div>
              <div>emailId: {user.email_Id} </div>
              <div>ContactNumber: {user.contactNumber} </div>
              <div>Nationality: {user.nationality} </div>

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
