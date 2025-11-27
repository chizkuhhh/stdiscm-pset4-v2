import { useEffect, useState } from "react";
import { gradesApi } from "../api/gradesApi";

interface GradeRecord {
  courseId: string;
  courseCode: string;
  courseTitle: string;
  faculty: string;
  grade: string;
  term: string;
}

export default function Grades() {
  const [grades, setGrades] = useState<GradeRecord[]>([]);

  useEffect(() => {
    async function fetchGrades() {
      const res = await gradesApi.get("/grades");
      setGrades(res.data);
    }
    fetchGrades();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Previous Grades</h1>

      <div className="space-y-4">
        {grades.map((g) => (
          <div key={g.courseId} className="p-4 bg-white shadow rounded-lg border">
            <h2 className="font-semibold">{g.courseCode} — {g.courseTitle}</h2>
            <p className="text-gray-600">Faculty: {g.faculty}</p>
            <p className="text-lg font-bold mt-1">Grade: {g.grade}</p>
            <p className="text-sm text-gray-500 mt-1">Term: {g.term}</p>
          </div>
        ))}

        {grades.length === 0 && (
          <p className="text-gray-600">No grades found.</p>
        )}
      </div>
    </div>
  );
}