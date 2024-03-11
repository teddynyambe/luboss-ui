import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import { User } from "next-auth";
import { API_URI } from "@/components/constants";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        // Check if credentials are undefined
        if (!credentials || !credentials.username || !credentials.password) {
          return null; // or throw new Error("Missing credentials");
        }
        const res = await fetch(API_URI + "/api/login", {
          method: "POST",
          body: JSON.stringify({
            username: credentials.username,
            password: credentials.password,
          }),
          headers: { "Content-Type": "application/json" },
        });
        const user: User = await res.json();
        if (res.ok && user.token) {
          return user;
        } else {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      // Called whenever a JWT is created. If a user object is available, its details are used to populate the token.


      if (user) {


        token.accessToken = user.token;

        token.role = user.role;
        token.username = user.username;
        token.token = user.token;
        token.member = user.member;
      }
      return token;
    },
    session: async ({ session, token }) => {
      // Called whenever a session is checked. Here you can adjust the session object.
      if (token) {

        session.user.token = token.accessToken; // Assign the accessToken from the JWT to the session's user object.
        session.user.role = token.role; // Also include the user's role in the session.
        session.user.username = token.username;
        session.user.token = token.token;
        session.user.member = {
          first_name: token.member?.first_name,
          last_name: token.member?.last_name,
          member_id: token.member?.member_id,
        }
      }
      return session;
    },
  },

  // callbacks: {
  //   jwt: async ({ token, user }) => {
  //     if (user) {
  //       token.accessToken = user.token ?? "";
  //       token.userRole = user.role ?? "";
  //     }
  //     return token;
  //   }
  // },
  // session: async ({ session, token }) => {
  //   var accessToke = session.accessToken;
  //   var userRole = session.userRole;
  //   session.accessToken = accessToke;
  //   session.userRole = userRole;
  //   return session;
  // },
};

export const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }


// import NextAuth from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";

// export const authOptions = ({
// providers: [
//   CredentialsProvider({
//     name: "Credentials",
//     credentials: {
//       username: { label: "Username", type: "text" },
//       password: { label: "Password", type: "password" },
//     },
//     async authorize(credentials, req) {
//       // Check if credentials are undefined
//       if (!credentials || !credentials.username || !credentials.password) {
//         return null; // or throw new Error("Missing credentials");
//       }
//       const res = await fetch("http://localhost:8000/api/login", {
//         method: "POST",
//         body: JSON.stringify({
//           username: credentials.username,
//           password: credentials.password,
//         }),
//         headers: { "Content-Type": "application/json" },
//       });
//       const user = await res.json();

//       // Check if user is authenticated successfully
//       if (res.ok && user.token) {
//         return {
//           id: user.username, // Use a unique identifier
//           name: user.username,
//           email: "", // Optional: Return email if available
//           role: user.role,
//           token: user.token,
//         };
//       }
//       // Return null if user data could not be retrieved
//       return null;
//     },
//   }),
// ],
//   // callbacks: {
//   //   jwt: async ({ token, user }) => {
//   //     // Initial sign in
//   //     if (user) {
//   //       token.accessToken = user.token;
//   //       token.userRole = user.role;
//   //     }
//   //     return token;
//   //   },
//   //   session: async ({ session, token }) => {
//   //     var accessToke = session.accessToken;
//   //     var userRole = session.userRole;
//   //     session.accessToken = accessToke;
//   //     session.userRole = userRole;
//   //     return session;
//   //   },
//   // },
//   // session: {
//   //   strategy: "jwt",
//   // },
//   // Add other NextAuth options here as needed
// });

// export const handler = NextAuth(authOptions);
// export { handler as GET, handler as POST } 
