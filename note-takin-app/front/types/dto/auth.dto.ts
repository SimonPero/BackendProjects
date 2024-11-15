export type AuthDto = {
    success: boolean;
    user: {
        id: number,
        email: string,
    };
    debug: {
        cookieHeader:string
    };
  };
  