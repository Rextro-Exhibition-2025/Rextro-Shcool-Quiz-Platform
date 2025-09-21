import NextAuth, { AuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import jwt from 'jsonwebtoken';
export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Get allowed admin emails from environment variables
      const adminEmailsEnv = process.env.ADMIN_EMAILS || 'admin@school.edu,teacher@school.edu';
      const adminEmails = adminEmailsEnv.split(',').map(email => email.trim());

      // Check if user email is in admin list
      if (account?.provider === 'google' && user.email) {
        return adminEmails.includes(user.email);
      }
      return false;
    }, async jwt({ token, user, account }) {
      const accessToken = jwt.sign(
        {
          email: token.email,
        },

        process.env.NEXTAUTH_SECRET as string,
        { expiresIn: '15m' }
      );
      token.accessToken = accessToken;

      return token;
    },
    async session({ session, token }) {
      session.token = token.accessToken as string;
      return session;
    }

  },
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },
  session: {
    strategy: 'jwt',
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
