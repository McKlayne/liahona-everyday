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
      const isOnWelcomePage = nextUrl.pathname === '/welcome';
      const isOnPublicPage = isOnLoginPage || isOnWelcomePage;
      const isOnAuthRoute = nextUrl.pathname.startsWith('/api/auth');
      const isOnRegisterRoute = nextUrl.pathname === '/api/register';

      // Allow access to auth routes and register route
      if (isOnAuthRoute || isOnRegisterRoute) {
        return true;
      }

      // Allow access to public pages (welcome and login)
      if (isOnPublicPage) {
        return true;
      }

      // Redirect unauthenticated users to welcome page
      if (!isLoggedIn) {
        return Response.redirect(new URL('/welcome', nextUrl));
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
