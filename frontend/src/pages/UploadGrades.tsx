import { useState } from "react";
import { gradesApi } from "../api/gradesApi";

export default function UploadGrades() {
  const [courseCode, setCourseCode] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [grade, setGrade] = useState("");
  const [term, setTerm] = useState("");

  async function handleUpload() {
    try {
      const res = await gradesApi.post("/grades/upload", {
        courseCode,
        studentEmail,
        grade,
        term,
      });

      alert("Grade uploaded!");
      console.log(res.data);

      setCourseCode("");
      setStudentEmail("");
      setGrade("");
      setTerm("");
    } catch (err) {
      alert("Upload failed");
      console.error(err);
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Upload Grades</h1>

      <div className="space-y-3">
        <input
          placeholder="Course Code (e.g., CS101)"
          className="border p-2 w-full rounded"
          value={courseCode}
          onChange={(e) => setCourseCode(e.target.value)}
        />

        <input
          placeholder="Student Email"
          className="border p-2 w-full rounded"
          value={studentEmail}
          onChange={(e) => setStudentEmail(e.target.value)}
        />

        <input
          placeholder="Grade (e.g., A, B+, C)"
          className="border p-2 w-full rounded"
          value={grade}
          onChange={(e) => setGrade(e.target.value)}
        />

        <input
          placeholder="Term (e.g., 1st Term 2025)"
          className="border p-2 w-full rounded"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
        />

        <button
          onClick={handleUpload}
          className="px-4 py-2 bg-lavender-gray-700 text-white rounded"
        >
          Upload
        </button>
      </div>
    </div>
  );
}