
import React from 'react';
import { useUser } from '../lib/customHooks';

const Dashboard = () => {
  const { user, authenticated } = useUser();
  if (!user || !authenticated) {
    return <div className="p-16 bg-gray-800 h-screen">
        <div className="text-2xl mb-4 font-bold text-white">Dashboard</div>
        <div className="ml-2 w-8 h-8 border-l-2 rounded-full animate-spin border-white" />
      </div>;
  }

  return (
    <div className="p-16 bg-gray-800 h-screen">
      <div className="text-2xl mb-4 font-bold text-white"> Dashboard </div>
      {
        user &&
        <div className='text-white'>
          <div className="text-lg text-bold mb-2"> User Details </div>
          <div className="flex">
            <div className="w-24 font-medium">
            </div>
            <div>
              {/* <div>Email:{user.email} </div> */}
              <div> firstName:{user.firstname} </div>
              <div>lastName: {user.lastname} </div>
              <div>emailId: {user.email_Id} </div>
              <div>ContactNumber: {user.contactNumber} </div>
              <div>Nationality: {user.nationality} </div>
              {user.subjects_picked.map((item,index)=>
                <div key={index}>
                  <div>Subject Name: {item.subjectName} </div>
                  <div>Subject Date:{item.chosenSubjectDate[0].subjectDateAndTime[0]} </div>
                </div>
              )}
            {console.log(user)}
            </div>
          </div>
        </div>
      }
    </div>
  );
}

export default Dashboard;
