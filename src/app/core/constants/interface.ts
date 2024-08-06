export interface ApiResponse<T = {}> {
    StatusCode?: number;
    StatusText: string;
    Message?: string;
    Data: T;
    ExtraData: T;
  }
  