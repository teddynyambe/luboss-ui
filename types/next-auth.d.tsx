// next-auth.d.ts or a similar file
import "next-auth";

declare module "next-auth" {
  /**
   * Extends the built-in session types to include custom properties like token.
   */
  interface Session {
    accessToken?: string;
    userRole?: string;
  }

  /**
   * If needed, extend the User model used within the JWT callback.
   */
  interface User {
    token?: string;
    role?: string;
    username?: string;
    member: {
      first_name: string;
      last_name: string;
      member_id: string;
    };
  }

  /**
   * Extends JWT callback type to include custom properties.
   */
  interface JWT {
    accessToken?: string;
    userRole?: string;
    username?: string;
  }
}
