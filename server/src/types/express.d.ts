export {};

declare global {
  namespace Express {
    interface Request {
      user?: {
        idUser: number;
        f_name: string;
        role: string;
      };
    }
  }
}