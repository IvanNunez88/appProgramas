// Misma forma que ApiResponse<T> del backend
export interface ApiResponse<T> {
  status: boolean;
  value: T | null;
  msg: string;
}
