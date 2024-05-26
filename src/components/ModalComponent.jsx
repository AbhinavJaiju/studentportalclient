import React, { useState } from "react";
import Modal from "react-modal";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from "../styles/ModalComponent.module.css";

Modal.setAppElement("#root");

const ModalComponent = ({ isOpen, onRequestClose, student, onSubmit }) => {
  const [selectedDateTimes, setSelectedDateTimes] = useState([
    { date: new Date(), time: new Date() },
  ]);
  const [selectedSubject, setSelectedSubject] = useState(
    student.subjects_picked[0].subjectSlug || ""
  );

  function getNextSubjectDateId(subjectDate) {
    if (subjectDate.length === 0) {
      return 1;
    }

    const lastElement = subjectDate[subjectDate.length - 1];
    const lastSubjectDateId = lastElement.subjectDateId;

    return lastSubjectDateId + 1;
  }

  const handleDateChange = (index, date) => {
    const newSelectedDateTimes = [...selectedDateTimes];
    newSelectedDateTimes[index].date = date;
    setSelectedDateTimes(newSelectedDateTimes);
  };

  const handleTimeChange = (index, time) => {
    const newSelectedDateTimes = [...selectedDateTimes];
    newSelectedDateTimes[index].time = time;
    setSelectedDateTimes(newSelectedDateTimes);
  };

  const handleSubjectChange = (event) => {
    setSelectedSubject(event.target.value);
  };

  const addDateTime = () => {
    setSelectedDateTimes([
      ...selectedDateTimes,
      { date: new Date(), time: new Date() },
    ]);
  };

  const removeDateTime = (index) => {
    const newSelectedDateTimes = selectedDateTimes.filter(
      (_, i) => i !== index
    );
    setSelectedDateTimes(newSelectedDateTimes);
  };

  const formatDateTime = (date, time) => {
    const combinedDateTime = new Date(date);
    combinedDateTime.setHours(time.getHours());
    combinedDateTime.setMinutes(time.getMinutes());
    combinedDateTime.setSeconds(0);

    const offset = combinedDateTime.getTimezoneOffset();
    const offsetHours = Math.abs(Math.floor(offset / 60));
    const offsetMinutes = Math.abs(offset % 60);
    const offsetSign = offset > 0 ? "-" : "+";
    const formattedOffset = `${offsetSign}${String(offsetHours).padStart(
      2,
      "0"
    )}:${String(offsetMinutes).padStart(2, "0")}`;

    return `${combinedDateTime.toISOString().split(".")[0]}${formattedOffset}`;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextSubjectDateId = getNextSubjectDateId(student.subjectDates);
    const formattedDateTimes = selectedDateTimes.map(({ date, time }) =>
      formatDateTime(date, time)
    );
    const formData = {
      studentEmail: student.email_Id,
      subject: selectedSubject,
      dateTime: formattedDateTimes,
      subjectDateId: nextSubjectDateId,
    };
    onSubmit(formData);
    onRequestClose(); // Close the modal after submission
  };

  console.log(student);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Add Timetable"
      className={styles.modal}
      overlayClassName={styles.overlay}
    >
      <h2>Add Timetable for {student.firstname}</h2>
      <p>
        <strong>Email:</strong> {student.email_Id}
      </p>
      <form onSubmit={handleSubmit}>
        <label>
          Subject:
          <select value={selectedSubject} onChange={handleSubjectChange}>
            {student.subjects_picked.map((subject, index) => (
              <option key={index} value={subject.subjectSlug}>
                {subject.subjectName}
              </option>
            ))}
          </select>
        </label>
        {selectedDateTimes.map((dateTime, index) => (
          <div key={index} className={styles.dateTimeEntry}>
            <label>
              Date:
              <DatePicker
                selected={dateTime.date}
                onChange={(date) => handleDateChange(index, date)}
                dateFormat="yyyy/MM/dd"
              />
            </label>
            <label>
              Time:
              <DatePicker
                selected={dateTime.time}
                onChange={(time) => handleTimeChange(index, time)}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={15}
                timeCaption="Time"
                dateFormat="h:mm aa"
              />
            </label>
            <button type="button" onClick={() => removeDateTime(index)}>
              Remove
            </button>
          </div>
        ))}
        <button type="button" onClick={addDateTime}>
          Add Another DateTime
        </button>
        <button type="submit">Submit</button>
        <button type="button" onClick={onRequestClose}>
          Close
        </button>
      </form>
    </Modal>
  );
};

export default ModalComponent;
