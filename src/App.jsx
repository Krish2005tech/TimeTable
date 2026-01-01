import React, { useState, useRef, useEffect } from 'react';
import { X, Plus, Edit2, Check, AlertCircle, Download ,Eye,EyeOff} from 'lucide-react';
import domtoimage from "dom-to-image-more";
import * as htmlToImage from "html-to-image";
const TimetableGenerator = () => {
  const fileInputRef = useRef(null);
  const timetableRef = useRef(null);
  const [courses, setCourses] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, showModalState] = useState(false);
  const [clashMessage, setClashMessage] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [showAddManual, setShowAddManual] = useState(false);
  const [showClassrooms, setShowClassrooms] = useState(true);

  // const colors = ['#FFE5E5', '#FFE5F0', '#F0E5FF', '#E5F0FF', '#E5F5FF', '#E5FFE5', '#F5FFE5', '#FFE5CC'];
  const colors = [
  '#E3F2FD', // Soft Blue
  '#E8F5E9', // Mint Cream
  '#F3E5F5', // Lavender Mist
  '#FFF9C4', // Lemon Chiffon
  '#FFECB3', // Peach Puff
  '#FFCDD2', // Light Red
  '#F0F4C3', // Honeydew
  '#FFF3E0', // Seashell
  '#E0E0E0' , // Platinum,
  '#FFEBEE', // Misty Rose
];
  const timeSlots = ['8am', '9am', '10am', '11am', '12pm', '1pm', '2pm', '3pm', '4pm', '5pm', '6pm', '7pm'];

  const slotTiming = {
    A: [{ day: 'Mon', start: '9am', end: '10am' }, { day: 'Tue', start: '9am', end: '10am' }, { day: 'Thu', start: '9am', end: '10am' }],
    B: [{ day: 'Tue', start: '10am', end: '11am' }, { day: 'Wed', start: '9am', end: '10am' }, { day: 'Fri', start: '9am', end: '10am' }],
    C: [{ day: 'Mon', start: '10am', end: '11am' }, { day: 'Wed', start: '10am', end: '11am' }, { day: 'Thu', start: '10am', end: '11am' }],
    D: [{ day: 'Fri', start: '10am', end: '11am' }, { day: 'Mon', start: '11am', end: '12pm' }, { day: 'Wed', start: '11am', end: '12pm' }],
    E: [{ day: 'Tue', start: '11am', end: '12pm' }, { day: 'Thu', start: '11am', end: '12pm' }, { day: 'Fri', start: '11am', end: '12pm' }],
    F: [{ day: 'Mon', start: '2pm', end: '3pm' }, { day: 'Tue', start: '2pm', end: '3pm' }, { day: 'Thu', start: '2pm', end: '3pm' }],
    G: [{ day: 'Wed', start: '2pm', end: '3pm' }, { day: 'Fri', start: '2pm', end: '3pm' }, { day: 'Tue', start: '3pm', end: '4pm' }],
    H: [{ day: 'Mon', start: '3pm', end: '4pm' }, { day: 'Wed', start: '3pm', end: '4pm' }, { day: 'Thu', start: '3pm', end: '4pm' }],
    I: [{ day: 'Fri', start: '3pm', end: '4pm' }, { day: 'Mon', start: '4pm', end: '5pm' }, { day: 'Wed', start: '4pm', end: '5pm' }],
    J: [{ day: 'Tue', start: '4pm', end: '5pm' }, { day: 'Thu', start: '4pm', end: '5pm' }, { day: 'Fri', start: '4pm', end: '5pm' }],
    K: [{ day: 'Mon', start: '8am', end: '9am' }, { day: 'Wed', start: '8am', end: '9am' }, { day: 'Fri', start: '8am', end: '9am' }],
    N: [{ day: 'Tue', start: '8am', end: '9am' }, { day: 'Thu', start: '8am', end: '9am' }, { day: 'Fri', start: '5pm', end: '6pm' }],
    U: [{ day: 'Mon', start: '12pm', end: '1pm' }, { day: 'Wed', start: '12pm', end: '1pm' }, { day: 'Fri', start: '12pm', end: '1pm' }],
    M1: [{ day: 'Mon', start: '1pm', end: '3pm' }],
    M2: [{ day: 'Tue', start: '1pm', end: '3pm' }],
    M3: [{ day: 'Wed', start: '1pm', end: '3pm' }],
    M4: [{ day: 'Thu', start: '1pm', end: '3pm' }],
    M5: [{ day: 'Fri', start: '1pm', end: '3pm' }],
    M6: [{ day: 'Mon', start: '3pm', end: '5pm' }],
    M7: [{ day: 'Tue', start: '3pm', end: '5pm' }],
    M8: [{ day: 'Wed', start: '3pm', end: '5pm' }],
    M9: [{ day: 'Thu', start: '3pm', end: '5pm' }],
    M10: [{ day: 'Fri', start: '3pm', end: '5pm' }],
    L1: [{ day: 'Mon', start: '9am', end: '11am' }],
    L2: [{ day: 'Tue', start: '9am', end: '11am' }],
    L3: [{ day: 'Wed', start: '9am', end: '11am' }],
    L4: [{ day: 'Thu', start: '9am', end: '11am' }],
    L5: [{ day: 'Fri', start: '9am', end: '11am' }],
    L6: [{ day: 'Mon', start: '11am', end: '1pm' }],
    L7: [{ day: 'Tue', start: '11am', end: '1pm' }],
    L8: [{ day: 'Wed', start: '11am', end: '1pm' }],
    L9: [{ day: 'Thu', start: '11am', end: '1pm' }],
    L10: [{ day: 'Fri', start: '11am', end: '1pm' }],
    NG1: [{ day: 'Thu', start: '5pm', end: '6pm' }],
    NG2: [{ day: 'Tue', start: '5pm', end: '6pm' }],
    NG3: [{ day: 'Wed', start: '5pm', end: '6pm' }],
    O:[{ day: 'Mon', start: '6pm', end: '7pm' }],
    P:[{ day: 'Tue', start: '6pm', end: '7pm' }],
    Q:[{ day: 'Wed', start: '6pm', end: '7pm' }],
    R:[{ day: 'Thu', start: '6pm', end: '7pm' }],
    S:[{ day: 'Fri', start: '6pm', end: '7pm' }],
  };

  const timeToMinutes = (time) => {
    const match = time.match(/(\d+)(?::(\d+))?\s*(am|pm)/i);
    if (!match) return null;
    let hours = parseInt(match[1]);
    const minutes = match[2] ? parseInt(match[2]) : 0;
    if (match[3].toLowerCase() === 'pm' && hours !== 12) hours += 12;
    if (match[3].toLowerCase() === 'am' && hours === 12) hours = 0;
    return hours * 60 + minutes;
  };

  const checkOverlap = (newCourse, existingCourses) => {
    if (!newCourse.schedule) return null;

    for (const existing of existingCourses) {
      if (existing.id === newCourse.id) continue;
      if (!existing.schedule) continue;

      // Check each day/time combo in new course against existing
      for (const newSlot of newCourse.schedule) {
        for (const existSlot of existing.schedule) {
          // Only check if same day
          if (newSlot.day !== existSlot.day) continue;

          const newStart = timeToMinutes(newSlot.start);
          const newEnd = timeToMinutes(newSlot.end);
          const existStart = timeToMinutes(existSlot.start);
          const existEnd = timeToMinutes(existSlot.end);

          // Check for time overlap
          if (!(newEnd <= existStart || existEnd <= newStart)) {
            return existing; // Return the conflicting course
          }
        }
      }
    }
    return null;
  };

  useEffect(() => {
    fetch("/courses.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load courses.json");
        }
        return response.json();
      })
      .then((sampleCourses) => {
        const processedCourses = sampleCourses.courses.map((c) => {
          let schedule = [];
          
          // Handle specific custom schedules
          if (c.schedule) {
            schedule = c.schedule;
            schedule = [{ day: 'Tue', start: '3pm', end: '5pm' }];
          } else if (c.slot && slotTiming[c.slot.toUpperCase()]) {
            schedule = slotTiming[c.slot.toUpperCase()];
          }

          return {
            ...c,
            schedule,
            // color: c.color || colors[Math.floor(Math.random() * colors.length)],
          };
        });

        setCourses(processedCourses);
      })
      .catch((error) => {
        console.error("Error loading courses:", error);
      });
  }, []);


  const addCourseToTimetable = (course) => {
    // 1. Find which colors are currently used in the schedule
  const usedColors = new Set(selectedCourses.map(c => c.color));

  // 2. Find the first color in our palette that isn't used yet
  let nextColor = colors.find(c => !usedColors.has(c));

  // 3. Fallback: If all colors are used, cycle through them using modulus
  if (!nextColor) {
    nextColor = colors[selectedCourses.length % colors.length];
  }


    // Get schedule from slot or use provided schedule
    let schedule = course.schedule;
    if (!schedule && course.slot) {
      schedule = slotTiming[course.slot.toUpperCase()] || [];
    }

    const newCourse = {
      ...course,
      id: Date.now() + Math.random(),
      schedule: schedule,
      color: nextColor,
    };

    const conflictingCourse = checkOverlap(newCourse, selectedCourses);
    if (conflictingCourse) {
      setClashMessage(`⚠️ Time clash detected! "${newCourse.name}" conflicts with "${conflictingCourse.name}"`);
      showModalState(true);
      return;
    }
    setSelectedCourses([...selectedCourses, newCourse]);
    setSearchTerm('');
  };

  const updateCourse = (id, updates) => {
    const course = selectedCourses.find(c => c.id === id);

    // Get schedule from slot if provided
    let schedule = updates.schedule;
    if (!schedule && updates.slot) {
      schedule = slotTiming[updates.slot.toUpperCase()] || [];
    }

    const updated = {
      ...course,
      ...updates,
      schedule: schedule || course.schedule,
    };

    const otherCourses = selectedCourses.filter(c => c.id !== id);

    const conflictingCourse = checkOverlap(updated, otherCourses);
    if (conflictingCourse) {
      setClashMessage(`⚠️ Time clash detected! "${updated.name}" conflicts with "${conflictingCourse.name}"`);
      showModalState(true);
      return;
    }

    setSelectedCourses(selectedCourses.map(c => (c.id === id ? updated : c)));
    setEditingId(null);
  };

  const removeCourse = (id) => {
    setSelectedCourses(selectedCourses.filter(c => c.id !== id));
  };

  // const generateTimetable = () => {
  //   const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  //   const times = ['8-9am', '9-10am', '10-11am', '11am-12pm', '12-1pm', '1-2pm', '2-3pm', '3-4pm', '4-5pm', '5-6pm'];

  //   const timetable = {};
  //   days.forEach(day => {
  //     times.forEach(time => {
  //       timetable[`${day}-${time}`] = [];
  //     });
  //   });

  //   selectedCourses.forEach(course => {
  //     if (!course.schedule) return;

  //     // Process each specific day/time slot for this course
  //     course.schedule.forEach(({ day, start, end }) => {
  //       const startMin = timeToMinutes(start);
  //       const endMin = timeToMinutes(end);

  //       times.forEach(time => {
  //         const [startStr, endStr] = time.split('-');
  //         const slotStart = timeToMinutes(startStr);
  //         const slotEnd = timeToMinutes(endStr);

  //         // Check if course overlaps with this time slot
  //         if (!(endMin <= slotStart || startMin >= slotEnd)) {
  //           timetable[`${day}-${time}`].push(course);
  //         }
  //       });
  //     });
  //   });
  //   console.log(timetable);
  //   return { days, times, timetable };
  // };
  const generateTimetable = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

    // Define slots with real times
    const times = [
      { label: '8-9am', start: '8am', end: '9am' },
      { label: '9-10am', start: '9am', end: '10am' },
      { label: '10-11am', start: '10am', end: '11am' },
      { label: '11am-12pm', start: '11am', end: '12pm' },
      { label: '12-1pm', start: '12pm', end: '1pm' },
      { label: '1-2pm', start: '1pm', end: '2pm' },
      { label: '2-3pm', start: '2pm', end: '3pm' },
      { label: '3-4pm', start: '3pm', end: '4pm' },
      { label: '4-5pm', start: '4pm', end: '5pm' },
      { label: '5-6pm', start: '5pm', end: '6pm' },
      { label: '6-7pm', start: '6pm', end: '7pm' }
    ];

    const timetable = {};
    days.forEach(day => {
      times.forEach(t => {
        timetable[`${day}-${t.label}`] = [];
      });
    });

    selectedCourses.forEach(course => {
      if (!course.schedule) return;

      course.schedule.forEach(({ day, start, end }) => {
        const startMin = timeToMinutes(start);
        const endMin = timeToMinutes(end);

        times.forEach(t => {
          const slotStart = timeToMinutes(t.start);
          const slotEnd = timeToMinutes(t.end);

          // Proper overlap check
          if (startMin < slotEnd && endMin > slotStart) {
            timetable[`${day}-${t.label}`].push(course);
          }
        });
      });
    });

    // console.log(timetable);
    return { days, times: times.map(t => t.label), timetable };
  };

  const exportToPNG = async () => {
    const exportRef = timetableRef;
    if (!exportRef.current) return;

    const SCALE = 2;
    const LANDSCAPE_WIDTH = 1200;

    // Clone the node
    const node = exportRef.current.cloneNode(true);

    // 🔑 DO NOT override width/height
    Object.assign(node.style, {
      width: `${LANDSCAPE_WIDTH}px`,
      height: "auto",
      position: "absolute",
      top: "0",
      left: "0",
      background: "#ffffff",
      overflow: "visible",
    });

    // Move off-screen but keep renderable
    // node.style.transform = "translateX(-300vw)";

    document.body.appendChild(node);

    // Wait for layout + fonts
    await document.fonts.ready;
    await new Promise((r) => requestAnimationFrame(r));

    // 🔥 Measure EXACT rendered size
    const rect = node.getBoundingClientRect();
    const EXPORT_WIDTH = Math.ceil(rect.width);
    const EXPORT_HEIGHT = Math.ceil(rect.height);

    // ❗ SAFETY CHECK
    if (EXPORT_WIDTH === 0 || EXPORT_HEIGHT === 0) {
      console.error("Export failed: zero size", rect);
      document.body.removeChild(node);
      return;
    }

    try {
      const dataUrl = await htmlToImage.toPng(node, {
        width: EXPORT_WIDTH,
        height: EXPORT_HEIGHT,
        pixelRatio: SCALE,
        backgroundColor: "#ffffff",
      });

      const link = document.createElement("a");
      link.download = "timetable.png";
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Export failed:", err);
    } finally {
      document.body.removeChild(node);
    }
  };

  const { days, times, timetable } = generateTimetable();

  const filteredCourses = courses.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
    // || c.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate the next available color for the Manual Form to use as default
const usedColors = new Set(selectedCourses.map(c => c.color));
const nextAvailableColor = colors.find(c => !usedColors.has(c)) || colors[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 align-items-center text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Course Timetable Generator</h1>
          <p className="text-gray-600">Build your perfect schedule from our course database</p>
        </div>


        {/* Add Courses Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Add Courses</h2>
          <div className="flex flex-col sm:flex-row gap-2 mb-6">
            <input
              type="text"
              placeholder="Search by course name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
            />
            <button
              onClick={() => setShowAddManual(!showAddManual)}
              className="w-full sm:w-auto bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition flex items-center justify-center gap-2"
            >
              <Plus size={20} /> Add Manually
            </button>
          </div>


          {courses.length > 0 && (
            <p className="text-gray-600 mb-4">{courses.length} courses available</p>
          )}

          {searchTerm && filteredCourses.length > 0 && (
            <div className="bg-gray-50 rounded-lg max-h-60 overflow-y-auto">
              {filteredCourses.map(course => {
                const timeDisplay = course.schedule && course.schedule.length > 0
                  ? `${course.schedule[0].start}-${course.schedule[0].end}`
                  : 'No schedule';

                return (
                  <div
                    key={course.id}
                    className="p-4 border-b hover:bg-gray-100 cursor-pointer transition flex justify-between items-center"
                    onClick={() => addCourseToTimetable(course)}
                  >
                    <div>
                      <p className="font-semibold text-gray-800">{course.name}</p>
                      <p className="text-sm text-gray-600">
                        {course.code} • {course.slot} {course.credits && `• ${course.credits} Credits`} {course.Instructor && `• ${course.Instructor}`}
                      </p>
                    </div>
                    <Plus className="text-green-500" size={20} />
                  </div>
                );
              })}
            </div>
          )}

          {showAddManual && (
            <ManualAddForm
              slotTiming={slotTiming}
              colors={colors}
              defaultColor={nextAvailableColor}
              timeSlots={timeSlots}
              onAdd={(course) => {
                addCourseToTimetable(course);
                setShowAddManual(false);
              }}
              onCancel={() => setShowAddManual(false)}
            />
          )}
        </div>

        {/* Selected Courses Section */}
        {selectedCourses.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Selected Courses</h2>
            <div className="space-y-4">
              {selectedCourses.map(course => (
                <CourseRow
                  key={course.id}
                  course={course}
                  colors={colors}
                  slotTiming={slotTiming}
                  timeSlots={timeSlots}
                  isEditing={editingId === course.id}
                  onEdit={() => setEditingId(course.id)}
                  onUpdate={(updates) => updateCourse(course.id, updates)}
                  onRemove={() => removeCourse(course.id)}
                  onCancel={() => setEditingId(null)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Timetable Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 overflow-x-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Weekly Timetable</h2>
            {selectedCourses.length > 0 && (
              <div className="flex justify-center items-center gap-x-2">
             <button
  onClick={() => setShowClassrooms(!showClassrooms)}
  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition
    ${
      !showClassrooms
        ? "bg-gradient-to-r from-blue-500 to-cyan-600 text-white hover:shadow-lg"
        : "bg-gradient-to-r from-gray-400 to-gray-600 text-white hover:shadow"
    }
  `}
>
  {showClassrooms ? <EyeOff size={20} /> : <Eye size={20} />}
  {showClassrooms ? "Hide Classrooms" : "Show Classrooms"}
</button>

              <button
                onClick={exportToPNG}
                className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition"
                >
                <Download size={20} /> Export as PNG
              </button>
                </div>
            )}
          </div>
          <div ref={timetableRef} className="bg-white">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-indigo-100">
                  <th className="border border-gray-300 p-3 text-gray-800 font-semibold text-center w-24">Time</th>
                  {days.map(day => (
                    <th key={day} className="border border-gray-300 p-3 text-gray-800 font-semibold text-center">
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {times.map(time => (
                  <tr key={time}>
                    <td className="border border-gray-300 p-3 text-gray-700 font-semibold text-center bg-gray-50">
                      {time}
                    </td>
                    {days.map(day => {
                      const cellCourses = timetable[`${day}-${time}`] || [];

                      if (cellCourses.length === 0) {
                        return (
                          <td key={`${day}-${time}`} className="border border-gray-300 p-2 text-center min-h-16 bg-white">
                            <div className="text-gray-300">-</div>
                          </td>
                        );
                      }

                      return (
                        <td key={`${day}-${time}`} className="border border-gray-300 p-0 text-center">
                          {cellCourses.map(c => (
                            <div
                              key={c.id}
                              className="text-sm font-bold w-full h-20 flex flex-col items-center justify-center p-1"
                              style={{ backgroundColor: c.color }}
                            >
                              <span className="text-gray-800">{c.name}</span>
                              {showClassrooms && c.Classroom && (
                                <span className="text-gray-600 text-sm ml-2">({c.Classroom})</span>
                              )}
                            </div>
                          ))}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>


      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="text-red-500" size={28} />
              <h3 className="text-xl font-bold text-gray-800">Schedule Conflict</h3>
            </div>
            <p className="text-gray-600 mb-6">{clashMessage}</p>
            <button
              onClick={() => showModalState(false)}
              className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

function CourseRow({ course, colors, slotTiming, timeSlots, isEditing, onEdit, onUpdate, onRemove, onCancel }) {
  const [name, setName] = useState(course.name);
  const [credits, setCredits] = useState(course.credits);
  const [slot, setSlot] = useState(course.slot);
  // const [startTime, setStartTime] = useState(course.schedule?.[0]?.start || '9am');
  // const [endTime, setEndTime] = useState(course.schedule?.[0]?.end || '10am');
  const [color, setColor] = useState(course.color);
  const [useSlot, setUseSlot] = useState(!!course.slot);
  const [Classroom, setClassroom] = useState(course.Classroom || 'N/A');
  // const [selectedDays, setSelectedDays] = useState(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);
  const [dayTimings, setDayTimings] = useState(() => {
    const initialTimings = {
      Mon: { enabled: false, start: '9am', end: '10am' },
      Tue: { enabled: false, start: '9am', end: '10am' },
      Wed: { enabled: false, start: '9am', end: '10am' },
      Thu: { enabled: false, start: '9am', end: '10am' },
      Fri: { enabled: false, start: '9am', end: '10am' },
    };

    if (course.schedule && !course.slot) {
      course.schedule.forEach(slot => {
        if (initialTimings[slot.day]) {
          initialTimings[slot.day] = {
            enabled: true,
            start: slot.start,
            end: slot.end
          };
        }
      });
    }

    return initialTimings;
  });

  // Helper to get time range display
  const getTimeDisplay = () => {
    if (!course.schedule || course.schedule.length === 0) return 'No schedule';
    const first = course.schedule[0];
    return `${first.start}-${first.end}`;
  };

  const handleSave = () => {
    const updates = {
      name,
      credits,
      color,
      Classroom,
    };

    if (useSlot) {
      updates.slot = slot;
      updates.schedule = slotTiming[slot.toUpperCase()] || [];
    } else {
      // Create custom schedule from dayTimings
      updates.schedule = Object.entries(dayTimings)
        .filter(([_, timing]) => timing.enabled)
        .map(([day, timing]) => ({
          day,
          start: timing.start,
          end: timing.end,
        }));
      updates.slot = 'Custom';
    }

    onUpdate(updates);
  };

  if (isEditing) {
    return (
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-indigo-200 rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-2">Course Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-2">Code</label>
            <input
              value={course.code}
              disabled
              className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-sm text-gray-600"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-2">Credits</label>
            <input
              value={credits}
              onChange={(e) => setCredits(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-2">Classroom</label>
            <input
              value={Classroom}
              onChange={(e) => setClassroom(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-2">Schedule Type</label>
            <div className="flex gap-4 mt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={useSlot}
                  onChange={() => setUseSlot(true)}
                  className="w-4 h-4"
                />
                <span className="text-sm">Use Slot</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={!useSlot}
                  onChange={() => setUseSlot(false)}
                  className="w-4 h-4"
                />
                <span className="text-sm">Custom Time</span>
              </label>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label className="text-xs font-semibold text-gray-600 block mb-2">
            {useSlot ? 'Select Slot' : 'Set Custom Time'}
          </label>
          {useSlot ? (
            <select
              value={slot}
              onChange={(e) => setSlot(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none text-sm"
            >
              {Object.keys(slotTiming).map(s => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          ) : (
            <div className="space-y-3">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map(day => (
                <div key={day} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={dayTimings[day].enabled}
                        onChange={(e) => {
                          setDayTimings({
                            ...dayTimings,
                            [day]: {
                              ...dayTimings[day],
                              enabled: e.target.checked
                            }
                          });
                        }}
                        className="w-4 h-4"
                      />
                      <span className="font-semibold text-gray-700 w-12">{day}</span>
                    </div>
                    <div className="flex gap-1 items-center flex-1">
                      <select
                        value={dayTimings[day].start}
                        onChange={(e) => {
                          setDayTimings({
                            ...dayTimings,
                            [day]: {
                              ...dayTimings[day],
                              start: e.target.value
                            }
                          });
                        }}
                        disabled={!dayTimings[day].enabled}
                        className={`flex-1 px-2 py-2 border border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none text-sm ${!dayTimings[day].enabled ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : ''
                          }`}
                      >
                        {timeSlots.map(t => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                      <span className="font-bold text-gray-600 text-xs">to</span>
                      <select
                        value={dayTimings[day].end}
                        onChange={(e) => {
                          setDayTimings({
                            ...dayTimings,
                            [day]: {
                              ...dayTimings[day],
                              end: e.target.value
                            }
                          });
                        }}
                        disabled={!dayTimings[day].enabled}
                        className={`flex-1 px-2 py-2 border border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none text-sm ${!dayTimings[day].enabled ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : ''
                          }`}
                      >
                        {timeSlots.map(t => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mb-4">
          <label className="text-xs font-semibold text-gray-600 block mb-2">Color</label>
          <div className="flex gap-2 flex-wrap">
            {colors.map(c => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={`w-8 h-8 rounded-lg border-2 ${color === c ? 'border-gray-800' : 'border-gray-300'}`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleSave}
            className="flex-1 bg-green-500 text-white py-2 rounded-lg font-semibold hover:bg-green-600 transition flex items-center justify-center gap-2"
          >
            <Check size={18} /> Save
          </button>
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-400 text-white py-2 rounded-lg font-semibold hover:bg-gray-500 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="border-l-4 rounded-lg p-6 flex justify-between items-center transition hover:shadow-md"
      style={{ backgroundColor: course.color, borderColor: '#666' }}
    >
      <div className="text-left">
        <p className="font-bold text-gray-800">{name}</p>
        <p className="text-sm text-gray-700">
          {course.code} • {course.slot} {credits && `• ${credits} Credits`} {course.Instructor && `• ${course.Instructor}`}
        </p>
      </div>
      <div className="flex gap-2">
        <button
          onClick={onEdit}
          className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition"
        >
          <Edit2 size={18} />
        </button>
        <button
          onClick={onRemove}
          className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}

function ManualAddForm({ slotTiming, colors, timeSlots, onAdd, onCancel, defaultColor }) {
  const [useSlot, setUseSlot] = useState(true);
  // const [selectedDays, setSelectedDays] = useState(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);
  const [dayTimings, setDayTimings] = useState({
    Mon: { enabled: false, start: '9am', end: '10am' },
    Tue: { enabled: false, start: '9am', end: '10am' },
    Wed: { enabled: false, start: '9am', end: '10am' },
    Thu: { enabled: false, start: '9am', end: '10am' },
    Fri: { enabled: false, start: '9am', end: '10am' },
  });
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    slot: 'A',
    startTime: '9am',
    endTime: '10am',
    credits: '',  
    // color: colors[0],
    color: defaultColor || colors[0],
    Classroom: '',
  });

  const handleAdd = () => {
    if (!formData.name || !formData.code) {
      alert('Please fill in course name and code');
      return;
    }

    let schedule;
    if (useSlot) {
      schedule = slotTiming[formData.slot.toUpperCase()] || [];
    } else {
      // Create custom schedule from dayTimings
      schedule = Object.entries(dayTimings)
        .filter(([_, timing]) => timing.enabled)
        .map(([day, timing]) => ({
          day,
          start: timing.start,
          end: timing.end,
        }));

      if (schedule.length === 0) {
        alert('Please select at least one day for the course');
        return;
      }
    }

    onAdd({
      ...formData,
      schedule,
      slot: useSlot ? formData.slot : 'Custom',
      id: Date.now() + Math.random(),
    });
  };

  return (
    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6 mt-4">
      <h3 className="font-bold text-gray-800 mb-4">Add Course Manually</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <input
          placeholder="Course Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
        />
        <input
          placeholder="Course Code"
          value={formData.code}
          onChange={(e) => setFormData({ ...formData, code: e.target.value })}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
        />
        <input
          placeholder="Credits"
          value={formData.credits}
          onChange={(e) => setFormData({ ...formData, credits: e.target.value })}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
        />
        <input
          placeholder="Classroom"
          value={formData.Classroom}
          onChange={(e) => setFormData({ ...formData, Classroom: e.target.value })}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
        />
        <div>
          <label className="text-xs font-semibold text-gray-600 block mb-2">Schedule Type</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={useSlot}
                onChange={() => setUseSlot(true)}
                className="w-4 h-4"
              />
              <span className="text-sm">Slot</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={!useSlot}
                onChange={() => setUseSlot(false)}
                className="w-4 h-4"
              />
              <span className="text-sm">Custom</span>
            </label>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <label className="text-xs font-semibold text-gray-600 block mb-2">
          {useSlot ? 'Select Slot' : 'Set Time Range'}
        </label>
        {useSlot ? (
          <select
            value={formData.slot}
            onChange={(e) => setFormData({ ...formData, slot: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
          >
            {Object.keys(slotTiming).map(s => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        ) : (
          <div className="space-y-3">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map(day => (
              <div key={day} className="border border-gray-200 rounded-lg p-3 bg-white">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={dayTimings[day].enabled}
                      onChange={(e) => {
                        setDayTimings({
                          ...dayTimings,
                          [day]: {
                            ...dayTimings[day],
                            enabled: e.target.checked
                          }
                        });
                      }}
                      className="w-4 h-4"
                    />
                    <span className="font-semibold text-gray-700 w-12">{day}</span>
                  </div>
                  <div className="flex gap-1 items-center flex-1">
                    <select
                      value={dayTimings[day].start}
                      onChange={(e) => {
                        setDayTimings({
                          ...dayTimings,
                          [day]: {
                            ...dayTimings[day],
                            start: e.target.value
                          }
                        });
                      }}
                      disabled={!dayTimings[day].enabled}
                      className={`flex-1 px-2 py-2 border border-gray-300 rounded-lg focus:border-green-500 focus:outline-none text-sm ${!dayTimings[day].enabled ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : ''
                        }`}
                    >
                      {timeSlots.map(t => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                    <span className="font-bold text-gray-600 text-xs">to</span>
                    <select
                      value={dayTimings[day].end}
                      onChange={(e) => {
                        setDayTimings({
                          ...dayTimings,
                          [day]: {
                            ...dayTimings[day],
                            end: e.target.value
                          }
                        });
                      }}
                      disabled={!dayTimings[day].enabled}
                      className={`flex-1 px-2 py-2 border border-gray-300 rounded-lg focus:border-green-500 focus:outline-none text-sm ${!dayTimings[day].enabled ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : ''
                        }`}
                    >
                      {timeSlots.map(t => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mb-4">
        <label className="text-xs font-semibold text-gray-600 block mb-2">Color</label>
        <div className="flex gap-2 flex-wrap">
          {colors.map(c => (
            <button
              key={c}
              onClick={() => setFormData({ ...formData, color: c })}
              className={`w-10 h-10 rounded-lg border-2 ${formData.color === c ? 'border-gray-800' : 'border-gray-300'}`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleAdd}
          className="flex-1 bg-green-500 text-white py-2 rounded-lg font-semibold hover:bg-green-600 transition"
        >
          Add Course
        </button>
        <button
          onClick={onCancel}
          className="flex-1 bg-gray-400 text-white py-2 rounded-lg font-semibold hover:bg-gray-500 transition"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
export default TimetableGenerator;