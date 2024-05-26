import React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const SubjectCalendar = ({ events }) => {
    // console.log(events.flat(2))
    const formattedEvents = events.flatMap((item) => {
        return item.subjectDateAndTime.map(dateTime => ({
            title: item.subject[0].subjectName,
            start: new Date(dateTime),
            end: new Date(new Date(dateTime).getTime() + 60 * 60 * 2000), // Assuming each event is 1 hour long
        }));
    });

    console.log(formattedEvents)


    return (
        <div>
            <Calendar
                localizer={localizer}
                events={formattedEvents}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 500 }}
            />
        </div>
    );
};

export default SubjectCalendar;
