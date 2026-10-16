# Viva & Oral Defense Notes: Curriculum Mapping & Alignment

### Core Question: "How do you know this is mapped to NCERT or any State Board?"

#### Honest, Defensible Answer:
1. **Original Content Built on Foundational Outcomes:**
   All learning outcomes, teacher activities, and practice tasks in the app are **original content** authored specifically for multi-grade classrooms. We do **not** copy text, exercises, illustrations, or stories from NCERT or Balbharati textbooks.
   
2. **Title-Match Candidates vs. Verified Sign-offs:**
   Where current official chapter catalogs are available (such as NCERT Class 1 & 2 *Joyful Mathematics*, Class 3 *Maths Mela*, and Class 3–4 *Our Wondrous World*), topics are mapped as **`candidate`** title matches. They are explicitly marked in both code and UI with a note: *"matched by chapter title only; learning outcome not yet compared"*.

3. **No Fabricated Textbook Information:**
   Where textbooks have not been verified with the physical book in hand—including NCERT Class 5, foundational Class 1–2 EVS, and Maharashtra State Board (*Balbharati*) textbooks—entries are strictly marked **`status: 'to-research'`** with chapter titles labeled `TO RESEARCH`. We never invent chapter names, numbers, page ranges, or edition years.

4. **Multi-Grade Extension Content:**
   In cases where a multi-grade topic does not have a 1-to-1 chapter counterpart in the national textbook for that specific grade, it is classified as **`status: 'extension'`** (e.g. multi-grade village water auditing or village market calculations designed to keep younger and older cohorts synchronously engaged).

5. **Visible Verification Protocol & Status Badges:**
   Every single grade card in the Planner displays a visible status badge (`Candidate`, `Extension`, `To Research`, or `Verified by <Name>`). Furthermore, the app provides a full **Curriculum Coverage Matrix** modal and CSV export with real-time computed statistics:
   - **Candidate Mappings:** 20
   - **Verified Mappings:** 0 (requires manual reviewer sign-off with `verifiedBy` and `verifiedOn`)
   - **Extension Content:** 6
   - **To Research:** 94
   - **Total Evaluated Entries:** 120

6. **The Verification Protocol (What is needed for 'Verified'):**
   Transitioning any entry to `'verified'` requires an educator or researcher to:
   - Obtain the physical or authorized digital PDF from *ncert.nic.in* or *ebalbharati.in*.
   - Verify the exact chapter number, title, and page range.
   - Compare the pedagogical learning outcomes.
   - Record the reviewer's name (`verifiedBy`) and date (`verifiedOn`).
   Automated unit tests enforce that missing any of these fields causes build and test failures immediately.
