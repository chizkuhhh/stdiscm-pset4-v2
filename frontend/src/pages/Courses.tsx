import { useEffect, useState } from "react";
import { courseApi } from "../api/courseApi";
import { enrollmentApi } from "../api/enrollmentApi";
import axios from "axios";

interface Course {
  id: number;
  code: string;
  title: string;
  section: string;
  faculty: string;
  capacity?: number | null;
  enrolledCount?: number;
}

interface Enrollment {
  courseId: number;
}

export default function Courses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [myEnrollments, setMyEnrollments] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const role = localStorage.getItem('role');

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        
        // Fetch all courses (now includes enrolledCount from backend)
        const res = await courseApi.get<Course[]>("/");
        setCourses(res.data);

        // Only fetch enrollments if user is a student
        if (role === "student") {
          const my = await enrollmentApi.get<Enrollment[]>("/mine");
          setMyEnrollments(my.data.map((e) => e.courseId));
        }
      } catch (err) {
        console.error("Failed to load courses:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [role]);

  async function enroll(courseId: number) {
    try {
      await enrollmentApi.post("/", { courseId });
      alert("Enrolled successfully!");
      
      // Update enrollments locally and increment enrolled count
      setMyEnrollments([...myEnrollments, courseId]);
      setCourses(courses.map(c => 
        c.id === courseId 
          ? { ...c, enrolledCount: (c.enrolledCount || 0) + 1 }
          : c
      ));
    } catch (err) {
      console.error(err);
      let errorMsg = 'Enrollment failed'
      if (axios.isAxiosError(err) && err.response?.data?.error) {
        errorMsg = err.response.data.error
      }
      alert(errorMsg);
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-gray-600">Loading courses...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          {role === "student" ? "Available Courses" : "All Courses"}
        </h1>
        <p className="text-gray-600 mt-1">
          {role === "student" 
            ? "Browse and enroll in courses" 
            : "View all courses in the system"}
        </p>
      </div>

      {courses.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
          <p className="text-gray-600">No courses available yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((c) => {
            const alreadyEnrolled = myEnrollments.includes(c.id);
            const isFull = c.capacity && c.enrolledCount ? c.enrolledCount >= c.capacity : false;
            const canEnroll = role === "student" && !alreadyEnrolled && !isFull;

            return (
              <div 
                key={c.id} 
                className="p-5 bg-white shadow-sm rounded-lg border hover:shadow-md transition-shadow"
              >
                {/* Header with badges */}
                <div className="flex justify-between items-start mb-2">
                  <h2 className="font-bold text-lg">{c.code}</h2>
                  <span className="text-xs bg-lavender-gray-200 text-lavender-gray-800 px-2 py-1 rounded font-medium">
                    Section {c.section}
                  </span>
                  <div className="flex gap-1">
                    {role === "student" && alreadyEnrolled && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                        ENROLLED
                      </span>
                    )}
                    {c.capacity && (
                      <span className={`px-2 py-1 text-xs font-medium rounded ${
                        isFull 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {isFull ? 'FULL' : 'OPEN'}
                      </span>
                    )}
                  </div>
                </div>
                
                <h3 className="text-gray-900 font-medium mb-3">{c.title}</h3>
                
                {/* Course details */}
                <div className="space-y-1 mb-4">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Faculty:</span> {c.faculty}
                  </p>
                  
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Enrolled:</span> {c.enrolledCount || 0}
                    {c.capacity && ` / ${c.capacity}`}
                  </p>
                  
                  {!c.capacity && (
                    <p className="text-xs text-gray-500 italic">No capacity limit</p>
                  )}
                </div>

                {/* Action button for students */}
                {role === "student" && (
                  alreadyEnrolled ? (
                    <div className="flex items-center text-green-600 text-sm font-medium">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      You're enrolled in this course
                    </div>
                  ) : (
                    <button
                      onClick={() => enroll(c.id)}
                      disabled={!canEnroll}
                      className={`w-full px-4 py-2 rounded-lg transition font-medium ${
                        canEnroll
                          ? 'bg-lavender-gray-600 text-white hover:bg-lavender-gray-700'
                          : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {isFull 
                        ? 'Course Full' 
                        : 'Enroll in Course'}
                    </button>
                  )
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}