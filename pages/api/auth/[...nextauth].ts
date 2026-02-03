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
      try {
        if (account && profile && account.access_token) {
          const discordProfile = profile as any;
          token.accessToken = account.access_token;
          token.id = discordProfile.id;
          // Discord username global (não usa discriminator desde 2023)
          token.username = discordProfile.global_name || discordProfile.username;
          token.avatar = discordProfile.avatar;
          token.email = discordProfile.email;
        }
      } catch (error) {
        console.error("[NextAuth] Erro no callback JWT:", error);
      }
      return token;
    },
    async session({ session, token }) {
      try {
        if (token && token.accessToken) {
          session.user = {
            ...session.user,
            id: token.id as string,
            username: token.username as string,
            avatar: token.avatar as string | null,
            email: token.email as string,
          };
          session.accessToken = token.accessToken as string;
        }
      } catch (error) {
        console.error("[NextAuth] Erro no callback session:", error);
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
