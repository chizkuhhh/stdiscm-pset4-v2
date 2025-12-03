import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';
import { prismaRead } from './prisma';

const PROTO_PATH = path.join(__dirname, '../proto/enrollment.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const enrollmentProto = grpc.loadPackageDefinition(packageDefinition).enrollment as any;

// gRPC service implementation
const enrollmentService = {
  // Get enrollment count for a course
  GetEnrollmentCount: async (call: any, callback: any) => {
    try {
      const { course_id } = call.request;

      const count = await prismaRead.enrollments.count({
        where: { courseId: course_id }
      });

      callback(null, {
        course_id,
        enrolled_count: count
      });
    } catch (err) {
      console.error('GetEnrollmentCount error:', err);
      callback({
        code: grpc.status.INTERNAL,
        message: 'Failed to get enrollment count'
      });
    }
  },

  // Check if course has capacity
  CheckCapacity: async (call: any, callback: any) => {
    try {
      const { course_id } = call.request;

      // Get course to check capacity
      const course = await prismaRead.courses.findUnique({
        where: { id: course_id }
      });

      if (!course) {
        return callback({
          code: grpc.status.NOT_FOUND,
          message: 'Course not found'
        });
      }

      // Get current enrollment count
      const currentCount = await prismaRead.enrollments.count({
        where: { courseId: course_id }
      });

      const hasCapacity = course.capacity 
        ? currentCount < course.capacity 
        : true; // No limit if capacity is null

      callback(null, {
        course_id,
        has_capacity: hasCapacity,
        current_count: currentCount,
        max_capacity: course.capacity || 0
      });
    } catch (err) {
      console.error('CheckCapacity error:', err);
      callback({
        code: grpc.status.INTERNAL,
        message: 'Failed to check capacity'
      });
    }
  },

  // Get all enrollments for a course
  GetCourseEnrollments: async (call: any, callback: any) => {
    try {
      const { course_id } = call.request;

      const enrollments = await prismaRead.enrollments.findMany({
        where: { courseId: course_id },
        include: {
          student: {
            select: {
              id: true,
              email: true
            }
          }
        },
        orderBy: {
          createdAt: 'asc'
        }
      });

      callback(null, {
        course_id,
        students: enrollments.map(e => ({
          student_id: e.student.id,
          email: e.student.email,
          enrolled_at: e.createdAt.toISOString()
        })),
        total_enrolled: enrollments.length
      });
    } catch (err) {
      console.error('GetCourseEnrollments error:', err);
      callback({
        code: grpc.status.INTERNAL,
        message: 'Failed to get course enrollments'
      });
    }
  }
};

export function startGrpcServer() {
  const server = new grpc.Server();

  server.addService(enrollmentProto.EnrollmentService.service, enrollmentService);

  server.bindAsync(
    '0.0.0.0:50051',
    grpc.ServerCredentials.createInsecure(),
    (err, port) => {
      if (err) {
        console.error('Failed to start gRPC server:', err);
        return;
      }
      console.log(`gRPC Enrollment Service running on port ${port}`);
    }
  );
}