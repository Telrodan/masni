export interface Log {
  level: string;
  message: string;
  timestamp: Date;
  meta: {
    user?: string;
    email?: string;
    module: string;
  };
}
