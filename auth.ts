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
      // On initial sign in, user object is available
      if (user) {
        // For credentials provider, user.id is set by authorize()
        // For OAuth, token.sub is automatically set by NextAuth
        token.id = (user.id || token.sub || user.email) as string;

        // Capture profile picture
        if (account?.provider === 'google' && profile) {
          token.picture = (profile as any).picture;
        } else if (user.image) {
          token.picture = user.image;
        }
      }

      return token;
    },
    async session({ session, token }) {
      // Add custom fields to session
      if (session.user) {
        // Use token.id if available, fallback to token.sub, then email
        session.user.id = (token.id || token.sub || token.email) as string;

        // Add profile picture if available
        if (token.picture) {
          session.user.image = token.picture as string;
        }
      }

      return session;
    },
  },
});
