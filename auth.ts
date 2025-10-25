import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { verifyCredentials } from './lib/users';

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  debug: process.env.NODE_ENV === 'development',
  session: {
    strategy: 'jwt',
  },
  providers: [
    ...authConfig.providers,
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

        // Return user object that will be stored in JWT
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account, profile }) {
      // Initial sign in
      if (user) {
        token.id = (user.id || token.sub) as string;
      }

      // Capture profile picture from OAuth providers
      if (account?.provider === 'google' && profile) {
        token.picture = (profile as any).picture;
      } else if (user?.image) {
        token.picture = user.image;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token.id || token.sub) as string;
        session.user.image = token.picture as string | undefined;
      }
      return session;
    },
  },
});
