import React from "react";
import "../styles/NoticeBoard.module.css"; // Make sure to import the CSS file

const NoticeBoard = ({ notices }) => {
  return (
    <div className="notice-board-container">
      <div className="notice-board-content">
        <table className="notice-table">
          <tbody>
            <tr key={notices.noticeId}>
              <td>{notices.noticeDescription}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NoticeBoard;
