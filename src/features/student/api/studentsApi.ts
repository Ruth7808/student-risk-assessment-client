// src/features/students/api/studentsApi.ts
import { baseApi } from "../../../services/api/baseApi";
import type { IStudent } from "./types";

export type CreateStudentRequest = Omit<
  IStudent,
  "isCompleted" | "completedAt" | "createdAt" | "updatedAt"
> & {
  teacherId: string;
  schoolId: string;
};

export type UpdateStudentRequest = Partial<
  Omit<IStudent, "teacherId" | "schoolId" | "studentCode" | "createdAt" | "updatedAt">
> & {
  id: string;
};

export type StudentResponse = { student: IStudent };
export type StudentsResponse = { students: IStudent[] };
export type MessageResponse = { message: string; student?: IStudent };

export const studentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // POST /students
    createStudent: builder.mutation<StudentResponse, CreateStudentRequest>({
      query: (body) => ({
        url: "/students",
        method: "POST",
        body,
      }),
      invalidatesTags: (_res, _err, arg) => [
        { type: "Students", id: "LIST" },
        { type: "StudentsByTeacher", id: arg.teacherId },
        { type: "StudentsBySchool", id: arg.schoolId },
      ],
    }),

    // GET /students/teacher/:teacherId
    getStudentsByTeacher: builder.query<StudentsResponse, { teacherId: string }>({
      query: ({ teacherId }) => ({
        url: `/students/teacher/${teacherId}`,
        method: "GET",
      }),
      providesTags: (result, _err, { teacherId }) => [
        { type: "StudentsByTeacher", id: teacherId },
        ...(result?.students.map((student) => ({
          type: "Student" as const,
          id: student._id || student._id,
        })) || []),
      ],
    }),

    // GET /students/school/:schoolId
    getStudentsBySchool: builder.query<StudentsResponse, { schoolId: string }>({
      query: ({ schoolId }) => ({
        url: `/students/school/${schoolId}`,
        method: "GET",
      }),
      providesTags: (result, _err, { schoolId }) => [
        { type: "StudentsBySchool", id: schoolId },
        ...(result?.students.map((student) => ({
          type: "Student" as const,
          id: student._id || student._id,
        })) || []),
      ],
    }),

    // GET /students/code/:code
    getStudentByCode: builder.query<StudentResponse, { code: string }>({
      query: ({ code }) => ({
        url: `/students/code/${encodeURIComponent(code)}`,
        method: "GET",
      }),
      providesTags: (result) =>
        result?.student
          ? [{ type: "Student", id: result.student._id || result.student._id }]
          : [],
    }),

    // PUT /students/:id
    updateStudent: builder.mutation<StudentResponse, UpdateStudentRequest>({
      query: ({ id, ...body }) => ({
        url: `/students/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, _err, arg) => {
        const student = result?.student;
        const tags = [
          { type: "Student" as const, id: arg.id },
          { type: "Students" as const, id: "LIST" },
        ];

        if (student?.teacherId) {
          tags.push({ 
            type: "StudentsByTeacher" as const, 
            id: String(student.teacherId) 
          });
        }

        if (student?.schoolId) {
          tags.push({ 
            type: "StudentsBySchool" as const, 
            id: String(student.schoolId) 
          });
        }

        return tags;
      },
    }),

    // DELETE /students/:id
    deleteStudent: builder.mutation<
      MessageResponse, 
      { id: string; teacherId?: string; schoolId?: string }
    >({
      query: ({ id }) => ({
        url: `/students/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_res, _err, arg) => {
        const tags = [
          { type: "Student" as const, id: arg.id },
          { type: "Students" as const, id: "LIST" },
        ];

        if (arg.teacherId) {
          tags.push({ type: "StudentsByTeacher" as const, id: arg.teacherId });
        }

        if (arg.schoolId) {
          tags.push({ type: "StudentsBySchool" as const, id: arg.schoolId });
        }

        return tags;
      },
    }),

    // PATCH /students/:id/complete
    markStudentCompleted: builder.mutation<StudentResponse, { id: string }>({
      query: ({ id }) => ({
        url: `/students/${id}/complete`,
        method: "PATCH",
      }),
      invalidatesTags: (result, _err, arg) => {
        const student = result?.student;
        const tags = [
          { type: "Student" as const, id: arg.id },
          { type: "Students" as const, id: "LIST" },
        ];

        if (student?.teacherId) {
          tags.push({ 
            type: "StudentsByTeacher" as const, 
            id: String(student.teacherId) 
          });
        }

        if (student?.schoolId) {
          tags.push({ 
            type: "StudentsBySchool" as const, 
            id: String(student.schoolId) 
          });
        }

        return tags;
      },
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateStudentMutation,
  useGetStudentsByTeacherQuery,
  useGetStudentsBySchoolQuery,
  useGetStudentByCodeQuery,
  useUpdateStudentMutation,
  useDeleteStudentMutation,
  useMarkStudentCompletedMutation,
} = studentsApi;