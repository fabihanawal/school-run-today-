# Security Specification & Threat Model

## 1. Data Invariants
1. **Public Read vs Admin Write**: General public collections (`settings`, `notices`, `courses`, `staff`, `gallery`, `quizzes`) are readable by all visitors (`allow read: if true;`) to serve the school website, but write operations (`create`, `update`, `delete`) are strictly restricted to authenticated Administrators.
2. **Contact Messages & Admissions**: Any prospective applicant or visitor may create an admission application or contact message. Public visitors cannot list, read, update, or delete other people's submissions. Admins have full access.
3. **Students Collection**: Students are queryable for result verification or login verification, but records can only be created/updated/deleted by administrators.
4. **Admins Collection**: Privileged roles cannot be self-assigned. Only existing verified admins or the initial bootstrapped owner (`tayebkjl@gmail.com`) can exist in `/admins/{adminId}`.
5. **ID Poisoning Protection**: All document IDs must be valid alphanumeric/hyphen/underscore strings <= 128 characters (`isValidId()`).
6. **Default Deny**: Any unmatched paths are blocked by catch-all `allow read, write: if false;`.

---

## 2. The Dirty Dozen Attack Payloads

1. **Payload 1 (Ghost Field Injection)**: An attacker submits a contact message containing hidden admin elevation flags `{ "isAdmin": true, "role": "ADMIN" }`.
   *Expected*: PERMISSION_DENIED.
2. **Payload 2 (Unauthenticated Notice Deletion)**: An unauthenticated request attempts `DELETE /notices/notice_123`.
   *Expected*: PERMISSION_DENIED.
3. **Payload 3 (Unauthenticated Settings Mutation)**: An unauthenticated attacker attempts `UPDATE /settings/default` with defaced text.
   *Expected*: PERMISSION_DENIED.
4. **Payload 4 (Contact Message Scraping)**: A visitor tries to `list /messages` to harvest visitor phone numbers and personal emails.
   *Expected*: PERMISSION_DENIED.
5. **Payload 5 (Admission Application Snooping)**: An unauthenticated user requests `get /admissions/admission_999` to read another student's birth certificate and guardian details.
   *Expected*: PERMISSION_DENIED.
6. **Payload 6 (Admin Privilege Self-Grant)**: A regular authenticated user writes a document to `/admins/{their_uid}` to grant themselves admin rights.
   *Expected*: PERMISSION_DENIED.
7. **Payload 7 (Oversized Payload / Denial of Wallet)**: An attacker posts a contact message containing a 10MB message string.
   *Expected*: PERMISSION_DENIED (size constraint violated).
8. **Payload 8 (Admission Status Tampering)**: An applicant creates an admission form with `status: "APPROVED"` bypassing the administrative review process.
   *Expected*: PERMISSION_DENIED (new admissions must have `status: 'PENDING'`).
9. **Payload 9 (ID Injection Attack)**: An attacker creates a notice with a 2KB long junk document ID.
   *Expected*: PERMISSION_DENIED (`isValidId(id)` fails).
10. **Payload 10 (Student Result Self-Modification)**: A student modifies their GPA to 5.00 in `/students/{studentId}`.
    *Expected*: PERMISSION_DENIED (only admins can mutate student records).
11. **Payload 11 (Unauthenticated Staff Directory Tamper)**: An unauthenticated user attempts to update a teacher's contact number in `/staff/{staffId}`.
    *Expected*: PERMISSION_DENIED.
12. **Payload 12 (Course Deletion by Student)**: An authenticated student attempts `delete /courses/course_101`.
    *Expected*: PERMISSION_DENIED.

---

## 3. Test Runner Specification (`firestore.rules.test.ts`)
The rules are validated to ensure that unauthenticated or non-admin attempts to mutate protected documents, scrape private admissions/messages, or self-assign admin roles fail with `PERMISSION_DENIED`.
