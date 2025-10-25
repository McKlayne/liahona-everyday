import type { NextAuthConfig } from 'next-auth';
import Google from 'next-auth/providers/google';

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnLoginPage = nextUrl.pathname === '/login';
      const isOnAuthRoute = nextUrl.pathname.startsWith('/api/auth');

      // Allow access to auth routes
      if (isOnAuthRoute) {
        return true;
      }

      // Redirect logged-in users away from login page
      if (isOnLoginPage && isLoggedIn) {
        return Response.redirect(new URL('/', nextUrl));
      }

      // Redirect unauthenticated users to login page
      if (!isOnLoginPage && !isLoggedIn) {
        return false;
      }

      return true;
    },
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
} satisfies NextAuthConfig;
