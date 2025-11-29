import { useEffect, useState } from "react";
import { gradesApi } from "../api/gradesApi";
import { Link } from "react-router-dom";

interface GradeRecord {
  courseId: number;
  courseCode: string;
  courseTitle: string;
  faculty: string;
  grade: string;
  term: string;
}

export default function Grades() {
  const [grades, setGrades] = useState<GradeRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterTerm, setFilterTerm] = useState<string>("all");

  useEffect(() => {
    let isMounted = true;

    async function fetchGrades() {
      try {
        setLoading(true);
        const res = await gradesApi.get("/grades");
        if (isMounted) {
          setGrades(res.data);
        }
      } catch (err) {
        console.error("Failed to fetch grades:", err);
        if (isMounted) {
          setError("Failed to load grades. Please try again later.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchGrades();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-gray-600">Loading your grades...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">My Grades</h1>
        <p className="text-gray-600 mt-1">
          View your academic performance across all courses
        </p>
      </div>

      {/* Grades List */}
      {grades.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <p className="text-gray-600 mb-4">
            {filterTerm === "all" 
              ? "No grades available yet. Complete your courses to see your grades here."
              : `No grades found for ${filterTerm}.`
            }
          </p>
          {filterTerm !== "all" && (
            <button
              onClick={() => setFilterTerm("all")}
              className="text-lavender-gray-700 hover:underline font-medium"
            >
              View all grades
            </button>
          )}
          {grades.length === 0 && (
            <Link
              to="/courses"
              className="inline-block mt-4 px-6 py-3 bg-lavender-gray-700 text-white rounded-lg hover:bg-lavender-gray-800 transition"
            >
              Browse Courses
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {grades.map((g, index) => (
            <div 
              key={`${g.courseId}-${index}`} 
              className="p-5 bg-white shadow-sm rounded-lg border hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h2 className="font-bold text-lg mb-1">
                    {g.courseCode} — {g.courseTitle}
                  </h2>
                  <p className="text-sm text-gray-600 mb-1">
                    <span className="font-medium">Faculty:</span> {g.faculty}
                  </p>
                  <p className="text-xs text-gray-500">
                    {g.term}
                  </p>
                </div>
                
                <div className="ml-4">
                  <div className={`
                    px-4 py-2 rounded-lg font-bold text-xl
                    ${getGradeColor(g.grade)}
                  `}>
                    {g.grade}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Summary */}
      {grades.length > 0 && (
        <div className="mt-6 text-sm text-gray-600 text-center">
          Showing {grades.length} grade{grades.length !== 1 ? 's' : ''}
          {filterTerm !== "all" && ` for ${filterTerm}`}
        </div>
      )}
    </div>
  );
}

/* Helper function to get grade color */
function getGradeColor(grade: string): string {
  const firstChar = grade.charAt(0);
  
  switch (firstChar) {
    case 'A':
      return 'bg-green-100 text-green-800';
    case 'B':
      return 'bg-blue-100 text-blue-800';
    case 'C':
      return 'bg-yellow-100 text-yellow-800';
    case 'D':
      return 'bg-orange-100 text-orange-800';
    case 'F':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}