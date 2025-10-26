import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import Apple from 'next-auth/providers/apple';
import Credentials from 'next-auth/providers/credentials';
import { verifyCredentials } from './lib/users';

// Debug logging for environment variables
console.log('[AUTH] Initializing NextAuth with environment:');
console.log('[AUTH] NEXTAUTH_URL:', process.env.NEXTAUTH_URL || 'not set');
console.log('[AUTH] GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID ? `${process.env.GOOGLE_CLIENT_ID.substring(0, 20)}...` : 'not set');
console.log('[AUTH] NODE_ENV:', process.env.NODE_ENV);

export const { auth, signIn, signOut, handlers } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Apple({
      clientId: process.env.APPLE_CLIENT_ID,
      clientSecret: process.env.APPLE_CLIENT_SECRET,
    }),
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await verifyCredentials(
          credentials.email as string,
          credentials.password as string
        );

        if (!user) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        };
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log('[AUTH] signIn callback triggered');
      console.log('[AUTH] Provider:', account?.provider);
      console.log('[AUTH] User email:', user?.email);

      if (account?.provider === 'google') {
        console.log('[AUTH] Google OAuth sign in attempt');
        console.log('[AUTH] Account type:', account.type);
        console.log('[AUTH] Has access token:', !!account.access_token);
      }

      return true;
    },
    async jwt({ token, user, account }) {
      // First time JWT callback is run, user object is available
      if (account && user) {
        console.log('[AUTH] JWT callback - new login');
        console.log('[AUTH] Provider:', account.provider);
        token.id = (user.id || token.sub) as string;
      }
      return token;
    },
    async session({ session, token }) {
      // Add user ID to session
      if (session.user && token.sub) {
        session.user.id = (token.id || token.sub) as string;
      }
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnLoginPage = nextUrl.pathname === '/login';
      const isOnWelcomePage = nextUrl.pathname === '/welcome';
      const isOnPublicPage = isOnLoginPage || isOnWelcomePage;
      const isOnAuthRoute = nextUrl.pathname.startsWith('/api/auth');
      const isOnRegisterRoute = nextUrl.pathname === '/api/register';
      const isOnInitRoute = nextUrl.pathname === '/api/init';

      // Allow access to auth routes, register route, and init route
      if (isOnAuthRoute || isOnRegisterRoute || isOnInitRoute) {
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
});
