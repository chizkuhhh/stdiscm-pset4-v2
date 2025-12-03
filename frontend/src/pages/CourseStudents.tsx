import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { courseApi } from "../api/courseApi";
import { gradesApi } from "../api/gradesApi";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

interface Student {
  studentId: number;
  email: string;
  enrolledAt: string;
}

interface CourseInfo {
  id: number;
  code: string;
  title: string;
  section: string;
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
  const [error, setError] = useState("");
  const [uploadingFor, setUploadingFor] = useState<Student | null>(null);

  useEffect(() => {
    async function loadStudents() {
      try {
        setLoading(true);
        const res = await courseApi.get<CourseStudentsResponse>(
          `${courseId}/students`
        );
        setData(res.data);
      } catch (err) {
        console.error(err);
        let errorMsg = "Failed to load course students";
        if (axios.isAxiosError(err) && err.response?.data?.error) {
          errorMsg = err.response.data.error;
        }
        setError(errorMsg);
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

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
        <Link
          to="/my-courses"
          className="inline-flex items-center mb-4 px-3 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 text-sm font-medium shadow-sm"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="w-4 h-4 mr-2" />
          Back to My Courses
        </Link>
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
      <div className="mb-6">
        <Link
          to="/my-courses"
          className="inline-flex items-center mb-4 px-3 py-2 bg-white border border-gray-300 text-lavender-gray-700 rounded-md hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 text-sm font-medium shadow-sm"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="w-4 h-4 mr-2" />
          Back to My Courses
        </Link>
        <h1 className="text-2xl font-bold">
          {data.course.code}-{data.course.section}: {data.course.title}
        </h1>
        <p className="text-gray-600 mt-1">
          Total Enrolled: {data.totalEnrolled} student{data.totalEnrolled !== 1 ? "s" : ""}
        </p>
      </div>

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
                  Student Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Enrolled Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.students.map((student) => (
                <tr key={student.studentId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {student.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(student.enrolledAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => setUploadingFor(student)}
                      className="px-3 py-1 bg-lavender-gray-700 text-white rounded hover:bg-lavender-gray-800 transition text-sm font-medium"
                    >
                      Upload Grade
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {uploadingFor && data && (
        <GradeUploadModal
          student={uploadingFor}
          course={data.course}
          onClose={() => setUploadingFor(null)}
        />
      )}
    </div>
  );
}

interface GradeUploadModalProps {
  student: Student;
  course: CourseInfo;
  onClose: () => void;
}

function GradeUploadModal({ student, course, onClose }: GradeUploadModalProps) {
  const [grade, setGrade] = useState("");
  const [term, setTerm] = useState("");
  const [uploading, setUploading] = useState(false);

  async function handleUpload() {
    if (!grade || !term) {
      alert("Please fill in all fields");
      return;
    }

    try {
      setUploading(true);
      await gradesApi.post("/grades/upload", {
        courseCode: course.code,
        studentEmail: student.email,
        grade,
        term,
      });

      alert("Grade uploaded successfully!");
      onClose();
    } catch (err) {
      console.error(err);
      let errorMsg = "Failed to upload grade";
      if (axios.isAxiosError(err) && err.response?.data?.error) {
        errorMsg = err.response.data.error;
      }
      alert(errorMsg);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
        <h2 className="text-xl font-bold mb-4">Upload Grade</h2>

        <div className="mb-4 p-3 bg-gray-50 rounded border">
          <p className="text-sm text-gray-600 mb-1">
            <span className="font-medium">Course:</span> {course.code}-{course.section}: {course.title}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Student:</span> {student.email}
          </p>
        </div>

        <div className="space-y-3 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Grade
            </label>
            <input
              type="text"
              placeholder="e.g., A, B+, 95"
              className="border border-gray-300 p-2 w-full rounded focus:ring-2 focus:ring-lavender-gray-500 focus:border-transparent"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              disabled={uploading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Term
            </label>
            <input
              type="text"
              placeholder="e.g., 2025 Term 1"
              className="border border-gray-300 p-2 w-full rounded focus:ring-2 focus:ring-lavender-gray-500 focus:border-transparent"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              disabled={uploading}
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition"
            disabled={uploading}
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            className="flex-1 px-4 py-2 bg-lavender-gray-700 text-white rounded hover:bg-lavender-gray-800 transition disabled:opacity-50"
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Upload Grade"}
          </button>
        </div>
      </div>
    </div>
  );
}