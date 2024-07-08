import React from "react";
import styles from '../styles/NoticeBoard.module.css';

const NoticeBoard = ({ notices }) => {
  return (
    <div className={styles.noticeBoardContainer}>
      <div className={styles.noticeBoardContent}>
        <table className={styles.noticeTable}>
          <tbody>
              <tr key={notices.noticeId} className={styles.noticeRow}>
                <td className={styles.noticeDescription}>{notices.noticeDescription}</td>
              </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NoticeBoard;
