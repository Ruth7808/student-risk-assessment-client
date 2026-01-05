// src/features/students/api/types.ts
export interface IStudent {
  _id?: string;
  firstName: string;
  lastNameInitial: string;
  className: string;
  teacherId: string; 
  schoolId: string;  
  studentCode: string;
  isCompleted: boolean;
  completedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}
