// =============================
// Standard timetable (top table)
// =============================

const STANDARD_TIMETABLE = [
  // Morning lessons
  { type: "lesson", label: "1 pamoka", start: "08:00", end: "08:45" },
  { type: "break",  label: "Pertrauka", start: "08:45", end: "08:55" },

  { type: "lesson", label: "2 pamoka", start: "08:55", end: "09:40" },
  { type: "break",  label: "Pertrauka", start: "09:40", end: "09:50" },

  { type: "lesson", label: "3 pamoka", start: "09:50", end: "10:35" },
  { type: "break",  label: "Pertrauka", start: "10:35", end: "10:45" },

  { type: "lesson", label: "4 pamoka", start: "10:45", end: "11:30" },
  { type: "break",  label: "Pietų pertrauka", start: "11:30", end: "12:00" }, // 30-min lunch

  // Afternoon lessons
  { type: "lesson", label: "5 pamoka", start: "12:00", end: "12:45" },
  { type: "break",  label: "Pertrauka", start: "12:45", end: "12:55" },

  { type: "lesson", label: "6 pamoka", start: "12:55", end: "13:40" },
  { type: "break",  label: "Pertrauka", start: "13:40", end: "13:50" },

  { type: "lesson", label: "7 pamoka", start: "13:50", end: "14:35" },
  { type: "break",  label: "Pertrauka", start: "14:35", end: "14:45" },

  { type: "lesson", label: "8 pamoka", start: "14:45", end: "15:30" },
  { type: "break",  label: "Pertrauka", start: "15:30", end: "15:40" },

  { type: "lesson", label: "9 pamoka", start: "15:40", end: "16:25" }
];


// ==========================================
// Praktinio mokymo laikas (bottom table)
// ==========================================

const PRAKTINIS_TITLE =
  "PRAKTINIO MOKYMO LAIKAS";

const PRAKTINIS_TIMETABLE = [
  // I Pamaina
  { type: "section", label: "I Pamaina" },
  { type: "lesson", label: "1 pamoka", start: "08:00", end: "08:45" },
  { type: "lesson", label: "2 pamoka", start: "08:45", end: "09:30" },
  { type: "break",  label: "Pertrauka", start: "09:30", end: "09:40" },
  { type: "lesson", label: "3 pamoka", start: "09:40", end: "10:25" },
  { type: "lesson", label: "4 pamoka", start: "10:25", end: "11:10" },
  { type: "break",  label: "Pietų pertrauka", start: "11:10", end: "11:40" },
  { type: "lesson", label: "5 pamoka", start: "11:40", end: "12:25" },
  { type: "lesson", label: "6 pamoka", start: "12:25", end: "13:10" },
  { type: "break",  label: "Pertrauka", start: "13:10", end: "13:20" },
  { type: "lesson", label: "7 pamoka", start: "13:20", end: "14:05" },

  // II Pamaina
  { type: "section", label: "II Pamaina" },
  { type: "lesson", label: "8 pamoka", start: "14:15", end: "15:00" },
  { type: "lesson", label: "9 pamoka", start: "15:00", end: "15:45" },
  { type: "break",  label: "Pertrauka", start: "15:45", end: "15:55" },
  { type: "lesson", label: "10 pamoka", start: "15:55", end: "16:40" },
  { type: "lesson", label: "11 pamoka", start: "16:40", end: "17:25" },
  { type: "break",  label: "Pietų pertrauka", start: "17:25", end: "17:55" },
  { type: "lesson", label: "12 pamoka", start: "17:55", end: "18:40" },
  { type: "lesson", label: "13 pamoka", start: "18:40", end: "19:25" },
  { type: "break",  label: "Pertrauka", start: "19:25", end: "19:35" },
  { type: "lesson", label: "14 pamoka", start: "19:35", end: "20:20" }
];
