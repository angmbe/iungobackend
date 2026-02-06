export class ApiResponse<T> {
  success: boolean;
  message: string;
  content: T;
}