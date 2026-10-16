# Custom Topics Specification & User Guide

## Overview
"Multi-Grade Teaching Assistant" supports teacher-authored custom curriculum topics. Because every rural primary classroom is unique, teachers can author and import local topics (such as local flora, fauna, market products, folklore, or village geography) that integrate seamlessly into the 5-grade rotation timetable, session planner, and differentiated worksheets.

Teachers are responsible for the factual accuracy and pedagogical suitability of their authored topics.

---

## Technical Security & Integrity Safeguards
1. **Pure Offline Processing**: Custom topics are parsed strictly from JSON using standard browser parsing (`JSON.parse`). No scripts, code, or executable templates are ever run.
2. **React Escaping**: All rendered strings undergo standard React JSX text escaping. `dangerouslySetInnerHTML` is never used.
3. **Bound Constraints**:
   - Maximum total topic file size: **200 KB**.
   - Maximum individual string length: **1,000 characters**.
   - No arbitrary or unexpected root properties allowed.
4. **Pedagogical Constraints (Grades 1–5)**:
   - Must provide structured plans for all 5 grades (`1`, `2`, `3`, `4`, `5`).
   - Maximum independent (solo) minutes per grade strictly follows `MAX_SOLO_MINUTES`:
     - Grade 1: ≤ 10 min
     - Grade 2: ≤ 12 min
     - Grade 3: ≤ 15 min
     - Grade 4: ≤ 20 min
     - Grade 5: ≤ 25 min
   - Tier Differentiation: Every authored question must provide both `support` and `stretch` variants, or explicitly declare `sameAcrossTiers: true` with a pedagogical `sameReason` (reserved for drawing/visual tasks).

---

## Schema & JSON Format Example

Teachers can click **"Topic template"** in the Topic Picker modal to download a working starter JSON file:

```json
{
  "schemaVersion": 1,
  "id": "custom-birds",
  "subject": "evs",
  "title": {
    "en": "Local Birds (Custom)",
    "hi": "स्थानीय पक्षी (कस्टम)",
    "mr": "स्थानिक पक्षी (कस्टम)"
  },
  "theme": {
    "en": "Birds observed around our village",
    "hi": "हमारे गाँव के आसपास दिखने वाले पक्षी",
    "mr": "आपल्या गावाच्या परिसरात दिसणारे पक्षी"
  },
  "hook": {
    "en": "Ask children: Which bird did you hear or see on your way to school this morning?",
    "hi": "बच्चों से पूछें: आज सुबह स्कूल आते समय आपने कौन सा पक्षी देखा या सुना?",
    "mr": "मुलांना विचारा: आज सकाळी शाळेत येताना तुम्ही कोणता पक्षी पाहिला किंवा ऐकला?"
  },
  "grades": {
    "1": {
      "outcome": { "en": "Identifies common birds by sound and appearance" },
      "teacher": {
        "title": { "en": "Bird picture talk" },
        "minutes": 8,
        "steps": [{ "en": "Show pictures of sparrow and crow" }]
      },
      "independent": {
        "task": { "en": "Draw your favourite bird" },
        "minutes": 10,
        "mode": "solo"
      },
      "earlyFinisher": { "en": "Colour your drawing" },
      "checklist": [{ "en": "Did the student draw a bird?" }],
      "questions": [{
        "type": "static",
        "items": [{
          "core": { "q": { "en": "Draw a crow or sparrow." }, "a": { "en": "Drawing of bird" } },
          "kind": "draw",
          "sameAcrossTiers": true,
          "sameReason": "Visual drawing task accessible to all Grade 1 tiers"
        }]
      }]
    },
    "2": { ... },
    "3": { ... },
    "4": { ... },
    "5": { ... }
  }
}
```

---

## Local Storage & Backup Migration
- Custom topics are saved locally in the browser's IndexedDB (`multigrade-assistant` database, `customTopics` table).
- They appear with a gold **⭐ Custom** badge in the Topic Picker.
- They can be deleted anytime using the red 🗑️ button.
- Backup format version is upgraded to `v2`.
- **Backward Compatibility**: Version 1 backups (without custom topics) import seamlessly without error.
