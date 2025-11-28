import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { courseApi } from "../api/courseApi";

interface Student {
  studentId: number;
  email: string;
  enrolledAt: string;
}

interface CourseInfo {
  id: number;
  code: string;
  title: string;
}

interface CourseStudentsResponse {
  course: CourseInfo;
  students: Student[];
  totalEnrolled: number;
}

export default function CourseStudents() {
  const { courseId } = useParams<{ courseId: string }>();
  const [data, setData] = useState<CourseStudentsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStudents() {
      try {
        setLoading(true);
        const url = `${courseId}/students`;
        console.log('Calling courseApi with:', url);
        console.log('Full URL will be:', courseApi.defaults.baseURL + '/' + url);
        
        const res = await courseApi.get<CourseStudentsResponse>(url);
        setData(res.data);
      } catch (err) {
        console.error('Error details:', err);
      } finally {
        setLoading(false);
      }
    }

    loadStudents();
  }, [courseId]);

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-gray-600">Loading students...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-6">
        <p className="text-gray-600">No data available</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <Link
          to="/my-courses"
          className="text-blue-600 hover:underline mb-2 inline-block"
        >
          ← Back to My Courses
        </Link>
        <h1 className="text-2xl font-bold">
          {data.course.code} — {data.course.title}
        </h1>
        <p className="text-gray-600 mt-1">
          Total Enrolled: {data.totalEnrolled} student{data.totalEnrolled !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Students List */}
      {data.students.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
          <p className="text-gray-600">No students enrolled yet.</p>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg border overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Enrolled Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.students.map((student) => (
                <tr key={student.studentId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {student.studentId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {student.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(student.enrolledAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}