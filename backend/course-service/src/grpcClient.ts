import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';

const PROTO_PATH = path.join(__dirname, '../../enrollment-service/proto/enrollment.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const enrollmentProto = grpc.loadPackageDefinition(packageDefinition).enrollment as any;

// Create gRPC client
const enrollmentClient = new enrollmentProto.EnrollmentService(
  '127.0.0.1:50051',
  grpc.credentials.createInsecure()
);

// Helper function: Get enrollment count
export function getEnrollmentCount(courseId: number): Promise<number> {
  return new Promise((resolve, reject) => {
    enrollmentClient.GetEnrollmentCount(
      { course_id: courseId },
      (err: any, response: any) => {
        if (err) {
          console.error(`gRPC GetEnrollmentCount error for course ${courseId}:`, err);
          reject(err);
        } else {
          resolve(response.enrolled_count);
        }
      }
    );
  });
}

// Helper function: Check capacity
export function checkCapacity(courseId: number): Promise<{
  hasCapacity: boolean;
  currentCount: number;
  maxCapacity: number;
}> {
  return new Promise((resolve, reject) => {
    enrollmentClient.CheckCapacity(
      { course_id: courseId },
      (err: any, response: any) => {
        if (err) {
          console.error(`gRPC CheckCapacity error for course ${courseId}:`, err);
          reject(err);
        } else {
          resolve({
            hasCapacity: response.has_capacity,
            currentCount: response.current_count,
            maxCapacity: response.max_capacity
          });
        }
      }
    );
  });
}

// Helper function: Get course enrollments
export function getCourseEnrollments(courseId: number): Promise<{
  students: Array<{
    studentId: number;
    email: string;
    enrolledAt: string;
  }>;
  totalEnrolled: number;
}> {
  return new Promise((resolve, reject) => {
    enrollmentClient.GetCourseEnrollments(
      { course_id: courseId },
      (err: any, response: any) => {
        if (err) {
          console.error(`gRPC GetCourseEnrollments error for course ${courseId}:`, err);
          reject(err);
        } else {
          resolve({
            students: response.students.map((s: any) => ({
              studentId: s.student_id,
              email: s.email,
              enrolledAt: s.enrolled_at
            })),
            totalEnrolled: response.total_enrolled
          });
        }
      }
    );
  });
}