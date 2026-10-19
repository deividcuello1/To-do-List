export interface ResponseGetData<T> {
  success: boolean;
  message?: string;
  data: {
    result: T[];
    rowsCount: number;
    pageCount: number;
    pageSize: number;
    currentPage: number;
  };
}
