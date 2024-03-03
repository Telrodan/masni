export interface Log {
  _id?: string;
  level: string;
  message: string;
  timestamp: Date;
  meta: {
    user?: string;
    module: string;
    stack?: string;
    itemId?: string;
  };
}
