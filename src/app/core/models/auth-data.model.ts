export interface AuthData {
  email: string;
  password: string;
}

export interface TokenPayload {
  id: string;
  role: string;
  expiresIn: number;
}
