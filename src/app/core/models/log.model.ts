export interface Log {
  level: string;
  message: string;
  timestamp: Date;
  meta: {
    user?: string;
    module: string;
  };
}
