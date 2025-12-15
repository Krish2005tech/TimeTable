import React, { useState, useRef,useEffect } from 'react';
import { Upload, X, Plus, Edit2, Check, AlertCircle } from 'lucide-react';

const TimetableGenerator = () => {
  const fileInputRef = useRef(null);
  const [courses, setCourses] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, showModalState] = useState(false);
  const [clashMessage, setClashMessage] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [showAddManual, setShowAddManual] = useState(false);

  const colors = ['#FFE5E5', '#FFE5F0', '#F0E5FF', '#E5F0FF', '#E5F5FF', '#E5FFE5', '#F5FFE5', '#FFE5CC'];
  const timeSlots = ['8am', '9am', '10am', '11am', '12pm', '1pm', '2pm', '3pm', '4pm', '5pm', '6pm', '7pm'];
 const slotTiming = {
  A: [
    { day: 'Mon', start: '9am', end: '10am' },
    { day: 'Tue', start: '9am', end: '10am' },
    { day: 'Thu', start: '9am', end: '10am' },
  ],

  B: [
    { day: 'Tue', start: '10am', end: '11am' },
    { day: 'Wed', start: '9am', end: '10am' },
    { day: 'Fri', start: '9am', end: '10am' },
  ],

  C: [
    { day: 'Mon', start: '10am', end: '11am' },
    { day: 'Wed', start: '10am', end: '11am' },
    { day: 'Thu', start: '10am', end: '11am' },
  ],

  D: [
    { day: 'Fri', start: '10am', end: '11am' },
    { day: 'Mon', start: '11am', end: '12pm' },
    { day: 'Wed', start: '11am', end: '12pm' },
  ],

  E: [
    { day: 'Tue', start: '11am', end: '12pm' },
    { day: 'Thu', start: '11am', end: '12pm' },
    { day: 'Fri', start: '11am', end: '12pm' },
  ],

  F: [
    { day: 'Mon', start: '2pm', end: '3pm' },
    { day: 'Tue', start: '2pm', end: '3pm' },
    { day: 'Thu', start: '2pm', end: '3pm' },
  ],

  G: [
    { day: 'Wed', start: '2pm', end: '3pm' },
    { day: 'Fri', start: '2pm', end: '3pm' },
    { day: 'Tue', start: '3pm', end: '4pm' },
  ],

  H: [
    { day: 'Mon', start: '3pm', end: '4pm' },
    { day: 'Wed', start: '3pm', end: '4pm' },
    { day: 'Thu', start: '3pm', end: '4pm' },
  ],

  I: [
    { day: 'Fri', start: '3pm', end: '4pm' },
    { day: 'Mon', start: '4pm', end: '5pm' },
    { day: 'Wed', start: '4pm', end: '5pm' },
  ],

  J: [
    { day: 'Tue', start: '4pm', end: '5pm' },
    { day: 'Thu', start: '4pm', end: '5pm' },
    { day: 'Fri', start: '4pm', end: '5pm' },
  ],

  K: [
    { day: 'Mon', start: '8am', end: '9am' },
    { day: 'Wed', start: '8am', end: '9am' },
    { day: 'Fri', start: '8am', end: '9am' },
  ],

  N: [
    { day: 'Tue', start: '8am', end: '9am' },
    { day: 'Thu', start: '8am', end: '9am' },
    { day: 'Fri', start: '5pm', end: '6pm' },
  ],

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
    const newSlot = newCourse.slot.toUpperCase();
    const newTimes = slotTiming[newSlot];
    if (!newTimes) return false;

    for (const existing of existingCourses) {
      if (existing.id === newCourse.id) continue;
      const existingSlot = existing.slot.toUpperCase();
      const existingTimes = slotTiming[existingSlot];
      if (!existingTimes) continue;

      for (const [day1, time1] of newTimes) {
        const [start1, end1] = time1.split('-');
        const start1Min = timeToMinutes(start1);
        const end1Min = timeToMinutes(end1);

        for (const [day2, time2] of existingTimes) {
          if (day1 === day2) {
            const [start2, end2] = time2.split('-');
            const start2Min = timeToMinutes(start2);
            const end2Min = timeToMinutes(end2);

            if (!(end1Min <= start2Min || end2Min <= start1Min)) {
              return true;
            }
          }
        }
      }
    }
    return false;
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const csv = e.target.result;
      const lines = csv.split('\n');
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      
      const newCourses = [];
      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        const values = lines[i].split(',').map(v => v.trim());
        const course = {
          id: Date.now() + Math.random(),
          name: values[headers.indexOf('course title')] || '',
          code: values[headers.indexOf('course code')] || '',
          credits: values[headers.indexOf('credit')] || '',
          faculty: values[headers.indexOf('faculty name')] || '',
          slot: (values[headers.indexOf('slot')] || '').toUpperCase(),
          color: colors[Math.floor(Math.random() * colors.length)],
        };
        if (course.code) newCourses.push(course);
      }
      setCourses(newCourses);
    };
    reader.readAsText(file);
  };

  useEffect(() => {
  fetch('/courses.json')
    .then(res => res.json())
    .then(data => setCourses(data.courses))
    .catch(err => console.error('Error loading courses:', err));
}, []);

  const addCourseToTimetable = (course) => {
    const testCourse = { ...course, id: Date.now() + Math.random() };
    if (checkOverlap(testCourse, selectedCourses)) {
      setClashMessage(`⚠️ Time clash detected for "${course.name}"`);
      showModalState(true);
      return;
    }
    setSelectedCourses([...selectedCourses, testCourse]);
    setSearchTerm('');
  };

  const updateCourse = (id, updates) => {
    const updated = { ...selectedCourses.find(c => c.id === id), ...updates };
    const otherCourses = selectedCourses.filter(c => c.id !== id);
    
    if (checkOverlap(updated, otherCourses)) {
      setClashMessage(`⚠️ Time clash detected for "${updated.name}"`);
      showModalState(true);
      return;
    }
    
    setSelectedCourses(selectedCourses.map(c => c.id === id ? updated : c));
    setEditingId(null);
  };

  const removeCourse = (id) => {
    setSelectedCourses(selectedCourses.filter(c => c.id !== id));
  };

  const generateTimetable = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    const times = ['8-9am', '9-10am', '10-11am', '11am-12pm', '12-1pm', '1-2pm', '2-3pm', '3-4pm', '4-5pm', '5-6pm'];
    
    const timetable = {};
    days.forEach(day => {
      times.forEach(time => {
        timetable[`${day}-${time}`] = [];
      });
    });

    selectedCourses.forEach(course => {
      const slot = slotTiming[course.slot.toUpperCase()];
      if (slot) {
        slot.forEach(([day, time]) => {
          const key = `${day}-${time}`;
          if (timetable[key] !== undefined) {
            timetable[key].push(course);
          }
        });
      }
    });

    return { days, times, timetable };
  };

  const { days, times, timetable } = generateTimetable();

  const filteredCourses = courses.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Course Timetable Generator</h1>
          <p className="text-gray-600">Upload CSV and build your perfect schedule</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition"
            >
              <Upload size={20} /> Upload CSV
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
            />
            {courses.length > 0 && <span className="text-gray-600">{courses.length} courses loaded</span>}
          </div>

          <div className="flex gap-2 mb-6">
            <input
              type="text"
              placeholder="Search by course code or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
            />
            <button
              onClick={() => setShowAddManual(!showAddManual)}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition flex items-center gap-2"
            >
              <Plus size={20} /> Add Manual
            </button>
          </div>

          {searchTerm && filteredCourses.length > 0 && (
            <div className="bg-gray-50 rounded-lg max-h-60 overflow-y-auto">
              {filteredCourses.map(course => (
                <div
                  key={course.id}
                  className="p-4 border-b hover:bg-gray-100 cursor-pointer transition flex justify-between items-center"
                  onClick={() => addCourseToTimetable(course)}
                >
                  <div>
                    <p className="font-semibold text-gray-800">{course.name}</p>
                    <p className="text-sm text-gray-600">{course.code} • Slot {course.slot}</p>
                  </div>
                  <Plus className="text-green-500" size={20} />
                </div>
              ))}
            </div>
          )}

          {showAddManual && (
            <ManualAddForm
              slotTiming={slotTiming}
              colors={colors}
              onAdd={(course) => {
                addCourseToTimetable(course);
                setShowAddManual(false);
              }}
              onCancel={() => setShowAddManual(false)}
            />
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 overflow-x-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Weekly Timetable</h2>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-indigo-100 to-purple-100">
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
                    return (
                      <td
                        key={`${day}-${time}`}
                        className="border border-gray-300 p-2 text-center min-h-16"
                      >
                        {cellCourses.length > 0 ? (
                          <div className="space-y-1">
                            {cellCourses.map(c => (
                              <div
                                key={c.id}
                                className="text-xl font-bold rounded text-gray-800"
                                style={{ backgroundColor: c.color }}
                              >
                                {c.name}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-gray-300">-</div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selectedCourses.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Selected Courses</h2>
            <div className="space-y-4">
              {selectedCourses.map(course => (
                <CourseRow
                  key={course.id}
                  course={course}
                  colors={colors}
                  slotTiming={slotTiming}
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
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
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

function CourseRow({ course, colors, slotTiming, isEditing, onEdit, onUpdate, onRemove, onCancel }) {
  const [name, setName] = useState(course.name);
  const [credits, setCredits] = useState(course.credits);
  const [slot, setSlot] = useState(course.slot);
  const [color, setColor] = useState(course.color);

  const handleSave = () => {
    onUpdate({ name, credits, slot, color });
  };

  if (isEditing) {
    return (
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-indigo-200 rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
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
            <input value={course.code} disabled className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-sm text-gray-600" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-2">Slot</label>
            <select
              value={slot}
              onChange={(e) => setSlot(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none text-sm"
            >
              {Object.keys(slotTiming).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
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
            <label className="text-xs font-semibold text-gray-600 block mb-2">Color</label>
            <div className="flex gap-2">
              {colors.map(c => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-8 h-8 rounded-lg border-3 ${color === c ? 'border-gray-800' : 'border-gray-300'}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
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
        <p className="text-sm text-gray-700">{course.code} • {slot} {credits && `• ${credits} Credits`}</p>
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

function ManualAddForm({ slotTiming, colors, onAdd, onCancel }) {
    const [useSlot, setUseSlot] = useState(true); 
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    slot: 'A',
    startTime: '8am',    // discrete value like 8am, 9am, etc
    endTime: '9am', 
    credits: '',
    color: colors[0],
  });

  return (
    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6 mt-4">
      <h3 className="font-bold text-gray-800 mb-4">Add Course Manually</h3>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
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
        <select
          value={formData.slot}
          onChange={(e) => setFormData({ ...formData, slot: e.target.value })}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
        >
          {Object.keys(slotTiming).map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <input
          placeholder="Credits"
          value={formData.credits}
          onChange={(e) => setFormData({ ...formData, credits: e.target.value })}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
        />
        <div className="flex gap-2">
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
          onClick={() => {
            if (formData.name && formData.code) {
              onAdd({ ...formData, id: Date.now() + Math.random() });
            }
          }}
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