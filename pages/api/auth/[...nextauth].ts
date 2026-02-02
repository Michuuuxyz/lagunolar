import NextAuth, { NextAuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";

export const authOptions: NextAuthOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "identify guilds email",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile && account.access_token) {
        const discordProfile = profile as any;
        token.accessToken = account.access_token;
        token.id = discordProfile.id;
        token.username = discordProfile.username;
        token.discriminator = discordProfile.discriminator;
        token.avatar = discordProfile.avatar;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && token.accessToken) {
        session.user = {
          ...session.user,
          id: token.id as string,
          username: token.username as string,
          discriminator: token.discriminator as string,
          avatar: token.avatar as string | null,
        };
        session.accessToken = token.accessToken as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
