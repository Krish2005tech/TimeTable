---
title: "Turning a 6-Minute Task into a 6-Hour Side Project: Building an Automatic Timetable Generator"
date: 2025-12-15
description: "How I built a timetable generator for IIT students, the problems I faced, and why programmers love overengineering simple things."
tags: ["react", "side-project", "web-dev", "productivity", "iit"]
---

## Motivation

I am currently the **Vice President of the Board of Academic Interaction** at the Indian Institute of Technology where I study.  
One of the most common questions I get every semester is surprisingly simple:

> *“How do I make my timetable?”*

At IIT, we don’t get a ready-made timetable. Instead, students are given:
- A list of courses they are enrolled in  
- And something called **course slots**

Every semester, an Excel sheet is shared that maps each slot (A, B, C, L1, M3, etc.) to actual days and time ranges.

Sounds simple, right?

Well…  
Most students:
- Ignore the Excel sheet entirely  
- Get scared seeing it for the first time  
- Or are simply too lazy to decode it manually  

As a programmer, I obviously chose the most reasonable solution:

👉 **Convert a 6-minute manual task into a 6-hour side project.**

That’s how **[timetable.krish2005.tech](https://timetable.krish2005.tech)** was born, a simple website that generates your weekly timetable just by selecting your courses.

---

## What I Built

The goal was simple:  
**Enter course names → Get a clean, readable timetable**

But of course, it evolved.

### Key Features

- 🔍 **Search from 466 courses** floated this semester  
  Just type the course name and add it - no slot decoding needed.

- 🗓️ **Automatic timetable generation**  
  Slot-to-time mapping happens behind the scenes.

- 📤 **Export timetable as PNG**  
  One-click export (this button took more effort than expected).

- 🎨 **Custom colors**  
  Change course colors to make the timetable visually pleasing.

- ✏️ **Editable course names**  
  Use short forms like *DBMS* instead of *Database Management Systems*.

- ➕ **Manual course addition**  
  Useful for:
  - Newly added courses  
  - Special electives  
  - Lab courses with different timings for different students

- 🧪 **Edit courses later**  
  Because course schedules love changing mid-semester (*looking at you, fractals*).

- 🌈 **Soft, light color palette**  
  Because aesthetics matter.

---

## Challenges Faced (and How I Solved Them)

### 1. Custom Timings Were Not So Simple

The first prototype was easy:
- Add courses  
- Assign slots  
- Generate timetable  

Everything worked flawlessly.

Then I decided to add **custom timings**, especially for lab courses.

❌ **My first mistake:**  
I assumed a course would have the same timing on all days.

✔ **Reality:**  
A single course can have:
- Different timings  
- On different days  

So I had to redesign the logic to:
- Allow enabling/disabling individual days  
- Set start and end times **per day**

This significantly increased complexity but made the system flexible and future-proof.

---

### 2. Exporting the Timetable as PNG

This was my **first time implementing image export** in a web app.

I tried multiple libraries from the internet:
- Some broke layouts  
- Some failed on mobile  
- Some exported half-rendered images  

Eventually, I found a solution that worked.

But another problem appeared 👇

📱 **Mobile users (my main audience)** were getting:
- Weird portrait-style screenshots  
- Squished tables  
- Unreadable exports  

✔ **The fix:**  
Instead of exporting the visible timetable, I:
- Created a **cloned off-screen version** of the timetable  
- Forced its width to ~1200–1600px  
- Exported that clean layout instead  

This ensured:
- Consistent landscape PNGs  
- Readable text on all devices  

---

### 3. Course Data Was a Mess

Course data came from **Google Sheets**, where:
- Each department had its own sheet  
- Empty rows everywhere  
- Random merged cells  
- Inconsistent column names  
  - *Course Name* in one  
  - *Subject Title* in another  

So before writing any code, I had to:
- Manually clean the data  
- Delete empty rows  
- Unmerge useless cells  
- Normalize headers  

After that, I wrote a **simple Python script** to:
- Convert cleaned `.xlsx` files into JSON  
- Make it easy for the frontend to load and search courses  

Not glamorous work, but absolutely necessary.

---

### 4. The Usual CSS Gremlins

No project is complete without:
- Random spacing bugs  
- Broken layouts on one specific screen size  
- Something looking perfect… except on Safari  

These were small issues, but they kept popping up randomly and needed fixing along the way.

---

## Deployment Experience

Deployment was surprisingly smooth:
- GitHub for version control  
- Cloudflare for hosting  
- Custom domain setup  

Everything worked without major issues, which was a refreshing change.

---

## Final Thoughts

This project was:
- A **fun side project**
- A **real problem solver** for students
- A great learning experience in:
  - UI/UX thinking  
  - Handling real-world messy data  
  - Exporting DOM to images  
  - Edge cases you never think of initially  

Was it overkill for a 6-minute task?  
Absolutely.

Was it worth it?  
Also absolutely.

Sometimes, the best way to learn is to overengineer something simple and enjoy every minute of it.

---

*If you’re an IIT student reading this and still making timetables manually… you know what to do 😉*
