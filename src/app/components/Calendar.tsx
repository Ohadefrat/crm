import React, { useState, useEffect, forwardRef } from "react";
import FullCalendar from "@fullcalendar/react";
import listPlugin from "@fullcalendar/list";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import bootstrap5Plugin from "@fullcalendar/bootstrap5";
import interactionPlugin from "@fullcalendar/interaction";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import DatePickerWrapper from "../style/react-datepicker";
import { EventInput } from "@fullcalendar/core/index.js";

// interface CalendarEvent {
//   id: string;
//   title: string;
//   allDay: boolean;
//   end: Date | string;
//   start: Date | string;
//   extendedProps?: {
//     calendar?: string;
//   };
// }
type CalendarEvent = EventInput;

interface CalendarProps {
  theme: any;
}
interface PickerProps {
  label?: string;
  error?: boolean;
  registername?: string;
}
type CategoryColors = {
  Personal: string;
  Business: string;
  Family: string;
  Holiday: string;
  ETC: string;
  [key: string]: string; // Index signature allowing any string key
};

const categoryColors: CategoryColors = {
  Personal: "#FF5733",
  Business: "#3366FF",
  Family: "#33FF33",
  Holiday: "#FFCC00",
  ETC: "#9900CC",
};
const MyCalendar: React.FC<CalendarProps> = ({ theme }) => {
  const [filterType, setFilterType] = useState<string>("all");

  const [formValues, setFormValues] = useState<Partial<CalendarEvent>>({
    title: "",
    extendedProps: {
      calendar: "",
    },
    start: "",
    end: "",
    allDay: false,
  });

  const handleFormChange = (fieldName: string, value: any) => {
    setFormValues((prevValues) => {
      if (fieldName === "calendar") {
        return {
          ...prevValues,
          extendedProps: {
            ...prevValues.extendedProps,
            calendar: value,
          },
        };
      }

      return { ...prevValues, [fieldName]: value };
    });
  };
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);

  const [filteredEvents, setFilteredEvents] =
    useState<CalendarEvent[]>(calendarEvents);

  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false);

  useEffect(() => {
    // Filter events based on the selected type
    if (filterType === "all") {
      setFilteredEvents(calendarEvents);
    } else {
      setFilteredEvents(
        calendarEvents.filter(
          (event) => event.extendedProps?.calendar === filterType
        )
      );
    }
  }, [filterType, calendarEvents]);
  useEffect(() => {
    // Fetch events from the API
    fetch("/api/events/getAll")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        if (Array.isArray(data.data)) {
          // Transform the data.data array to match your CalendarEvent type
          const formattedEvents = data.data.map(
            (event: {
              id: { toString: () => any };
              title: any;
              allDay: any;
              start: string | number | Date;
              end: string | number | Date;
              calendar: any;
            }) => ({
              id: event.id.toString(),
              title: event.title,
              allDay: event.allDay,
              start: new Date(event.start),
              end: new Date(event.end),
              extendedProps: {
                calendar: event.calendar,
              },
            })
          );

          // Set the events in state
          setCalendarEvents(formattedEvents);
        } else {
          console.error(
            "Data received from the API does not contain an array:",
            data
          );
        }
      })
      .catch((error) => console.error("Error fetching events:", error));
  }, []);

  const handleEventClick = (eventInfo: any) => {
    setSelectedEvent(eventInfo.event);
    setFormValues({
      title: eventInfo.event.title,
      extendedProps: {
        calendar: eventInfo.event.extendedProps?.calendar || "",
      },
      start: eventInfo.event.start,
      end: eventInfo.event.end,
      allDay: eventInfo.event.allDay,
    });
    setEditDialogOpen(true);
  };

  const handleFilterChange = (type: string) => {
    setFilterType(type);
  };

  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
    setSelectedEvent(null);
  };

  const handleSaveChanges = () => {
    const isNewEvent = selectedEvent === null;

    // Prepare the data to be sent (either for adding a new event or updating an existing event)
    const requestData = isNewEvent
      ? formValues
      : { eventId: selectedEvent.id, ...formValues };

    // Determine the API endpoint based on whether it's a new event or an update
    const apiEndpoint = isNewEvent
      ? "/api/events/addEvent"
      : `/api/events/updateEvent?eventId=${selectedEvent.id}`;

    fetch(apiEndpoint, {
      method: isNewEvent ? "POST" : "PUT", // Use POST for adding, PUT for updating
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (isNewEvent) {
          console.log("Event added:", data);
          // If it's a new event, add it to the calendarEvents state
          setCalendarEvents([...calendarEvents, data]);
        } else {
          console.log("Event updated:", data);
          // If it's an update, update the event in the calendarEvents state
          const updatedEvents = calendarEvents.map((event) =>
            event.id === selectedEvent.id ? { ...event, ...data } : event
          );
          setCalendarEvents(updatedEvents);
        }
      })
      .catch((error) =>
        console.error(
          isNewEvent ? "Error adding event:" : "Error updating event:",
          error
        )
      );

    setEditDialogOpen(false);
    setSelectedEvent(null);
  };

  const handleEventDrop = (eventDropInfo: any) => {
    const { event, oldEvent } = eventDropInfo;

    // Determine the updated start and end times
    const updatedStart = event.start;
    const updatedEnd = event.end || event.start; // Use event.start if end time is not defined

    // Update the event's position in the calendarEvents state
    const updatedEvents = calendarEvents.map((calEvent) =>
      calEvent.id === event.id
        ? { ...calEvent, start: updatedStart, end: updatedEnd }
        : calEvent
    );

    setCalendarEvents(updatedEvents);

    // Prepare the data to be sent for updating the event in the database
    const requestData = {
      eventId: event.id,
      start: updatedStart,
      end: updatedEnd,
    };

    // Send a PUT request to update the event in the database
    fetch(`/api/events/updateEvent?eventId=${event.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Event updated:", data);
        // You can add any additional logic or feedback as needed
      })
      .catch((error) => {
        console.error("Error updating event:", error);
        // Handle the error, such as displaying an error message
      });
  };

  const handleDeleteEvent = () => {
    if (selectedEvent) {
      // Send a DELETE request to your Next.js API route
      fetch(`/api/events/deleteEvent?eventId=${selectedEvent.id}`, {
        method: "DELETE",
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Event deleted:", data);

          // After successfully deleting the event, remove it from the calendarEvents state
          const updatedEvents = calendarEvents.filter(
            (event) => event.id !== selectedEvent.id
          );
          setCalendarEvents(updatedEvents);
        })
        .catch((error) => console.error("Error deleting event:", error));

      // Close the edit dialog
      setEditDialogOpen(false);
      setSelectedEvent(null);
    }
  };

  const handleAddEventButtonClick = () => {
    // Implement the logic to open a dialog or any other action you want
    // For example, you can set a state to open a dialog
    setEditDialogOpen(true);
  };

  const getEventBackgroundColor = (event: CalendarEvent) => {
    const category = event.extendedProps?.calendar;

    // Provide a default color when category is undefined
    const defaultColor = "#FF5733"; // You can change this to your desired default color

    // Use category as an index, or provide the default color if it's undefined
    return category ? categoryColors[category] || defaultColor : defaultColor;
  };
  return (
    <div>
      <div style={{ marginBottom: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <Button
              variant="contained"
              onClick={() => handleFilterChange("all")}
              style={{
                marginRight: "8px",
                backgroundColor: theme.palette.secondary.main,
              }}
            >
              All
            </Button>
            <Button
              variant="contained"
              onClick={() => handleFilterChange("Personal")}
              style={{
                marginRight: "8px",
                backgroundColor: theme.palette.secondary.main,
              }}
            >
              Personal
            </Button>
            <Button
              variant="contained"
              onClick={() => handleFilterChange("Business")}
              style={{
                marginRight: "8px",
                backgroundColor: theme.palette.secondary.main,
              }}
            >
              Business
            </Button>
            <Button
              variant="contained"
              onClick={() => handleFilterChange("Family")}
              style={{
                marginRight: "8px",
                backgroundColor: theme.palette.secondary.main,
              }}
            >
              Family
            </Button>
            <Button
              variant="contained"
              onClick={() => handleFilterChange("Holiday")}
              style={{
                marginRight: "8px",
                backgroundColor: theme.palette.secondary.main,
              }}
            >
              Holiday
            </Button>
            <Button
              variant="contained"
              onClick={() => handleFilterChange("ETC")}
              style={{
                marginRight: "8px",
                backgroundColor: theme.palette.secondary.main,
              }}
            >
              ETC
            </Button>
          </div>
          <div>
            <Button
              variant="contained"
              onClick={handleAddEventButtonClick}
              style={{
                backgroundColor: theme.palette.secondary.main,
              }}
            >
              Add Event
            </Button>
          </div>
        </div>
      </div>
      <FullCalendar
        plugins={[
          interactionPlugin,
          dayGridPlugin,
          timeGridPlugin,
          listPlugin,
          bootstrap5Plugin,
        ]}
        eventContent={(arg) => {
          const backgroundColor = getEventBackgroundColor(arg.event as any);
          return (
            <div
              style={{
                backgroundColor,
                color: "white", // You can adjust the text color as needed
                padding: "3px",
                borderRadius: "5px",
              }}
            >
              {arg.event.title}
            </div>
          );
        }}
        initialView="dayGridMonth"
        events={filteredEvents}
        eventClick={handleEventClick}
        editable={true}
        eventDrop={handleEventDrop}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        themeSystem={theme}
      />

      <Drawer
        anchor="right"
        open={editDialogOpen}
        onClose={handleEditDialogClose}
        ModalProps={{ keepMounted: true }}
        sx={{ "& .MuiDrawer-paper": { width: ["25%"] } }}
      >
        <Box
          className="sidebar-header"
          sx={{
            display: "flex",
            justifyContent: "space-between",
            backgroundColor: "background.default",
            p: (theme) => theme.spacing(3, 3.255, 3, 5.255),
          }}
        >
          <Typography variant="h6">
            {selectedEvent !== null && selectedEvent.title.length
              ? "Update Event"
              : "Add Event"}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {selectedEvent !== null && selectedEvent.title.length ? (
              <IconButton
                size="small"
                onClick={handleDeleteEvent}
                sx={{
                  color: "text.primary",
                  mr: selectedEvent !== null ? 1 : 0,
                }}
              ></IconButton>
            ) : null}
            <IconButton
              size="small"
              onClick={handleEditDialogClose}
              sx={{ color: "text.primary" }}
            ></IconButton>
          </Box>
        </Box>
        <Box
          className="sidebar-body"
          sx={{ p: (theme) => theme.spacing(5, 6) }}
        >
          <DatePickerWrapper>
            <form onSubmit={handleSaveChanges} autoComplete="off">
              {/* Existing code for Title field */}
              <TextField
                label="Title"
                value={formValues.title}
                fullWidth
                sx={{ mb: 2 }}
                onChange={(e) => handleFormChange("title", e.target.value)}
              />
              {/* Additional fields */}
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="event-category">Category</InputLabel>
                <Select
                  label="Category"
                  value={formValues?.extendedProps?.calendar || ""}
                  labelId="event-category"
                  onChange={(e) => handleFormChange("calendar", e.target.value)}
                >
                  <MenuItem value="Personal">Personal</MenuItem>
                  <MenuItem value="Business">Business</MenuItem>
                  <MenuItem value="Family">Family</MenuItem>
                  <MenuItem value="Holiday">Holiday</MenuItem>
                  <MenuItem value="ETC">ETC</MenuItem>
                </Select>
              </FormControl>
              <Box sx={{ mb: 2, width: "100%" }}>
                <DatePicker
                  selectsStart
                  id="event-start-date"
                  endDate={formValues.end as Date}
                  selected={formValues.start as Date}
                  startDate={formValues.start as Date}
                  showTimeSelect={!formValues.allDay}
                  dateFormat={
                    !formValues.allDay ? "yyyy-MM-dd hh:mm" : "yyyy-MM-dd"
                  }
                  customInput={
                    <PickersComponent
                      label="Start Date"
                      registername="startDate"
                    />
                  }
                  onChange={(date) => handleFormChange("start", date)}
                />
              </Box>
              <Box sx={{ mb: 2, width: "100%" }}>
                <DatePicker
                  selectsEnd
                  id="event-end-date"
                  endDate={formValues.end as Date}
                  selected={formValues.end as Date}
                  startDate={formValues.start as Date}
                  showTimeSelect={!formValues.allDay}
                  dateFormat={
                    !formValues.allDay ? "yyyy-MM-dd hh:mm" : "yyyy-MM-dd"
                  }
                  customInput={
                    <PickersComponent label="End Date" registername="endDate" />
                  }
                  onChange={(date) => handleFormChange("end", date)}
                />
              </Box>
              <FormControl sx={{ mb: 6 }}>
                <FormControlLabel
                  label="All Day"
                  control={
                    <Switch
                      checked={formValues.allDay}
                      onChange={() =>
                        handleFormChange("allDay", !formValues.allDay)
                      }
                    />
                  }
                />
              </FormControl>
              <div
                style={{
                  marginBottom: "20px",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Button
                  variant="contained"
                  type="submit"
                  color="primary"
                  style={{
                    backgroundColor: theme.palette.primary.main,
                  }}
                >
                  Save Changes
                </Button>
                {selectedEvent !== null && selectedEvent.title.length ? (
                  <IconButton
                    size="small"
                    onClick={handleDeleteEvent} // Call the delete event function here
                    sx={{
                      color: theme.palette.secondary.main,
                      mr: selectedEvent !== null ? 1 : 0,
                    }}
                  >
                    <DeleteIcon sx={{ fontSize: "30px" }} />{" "}
                    {/* Use DeleteIcon here */}
                  </IconButton>
                ) : null}
              </div>
            </form>
          </DatePickerWrapper>
        </Box>
      </Drawer>
    </div>
  );
};

const PickersComponent = forwardRef(({ ...props }: PickerProps, ref) => {
  return (
    <TextField
      inputRef={ref}
      fullWidth
      {...props}
      label={props.label || ""}
      sx={{ width: "100%" }}
      error={props.error}
    />
  );
});
PickersComponent.displayName = "PickersComponent";

export default MyCalendar;
