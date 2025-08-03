import type { JWT } from "next-auth/jwt";
import type { Session, User } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb"; 

export const authOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_ID!,
      clientSecret: process.env.FACEBOOK_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt" as const,
  },
  callbacks: {
    async jwt({ token, user}: { token: JWT; user?: User}) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ token, session }: { token: JWT; session: Session}) {
      // Attach MongoDB _id to session

      if (token?.id && session.user) {
        session.user.id = token.id as string;
        console.log('hellow', session.user.id);
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};