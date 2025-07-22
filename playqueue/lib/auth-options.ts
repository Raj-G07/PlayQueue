import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials"; 
import { NextAuthOptions, Session } from "next-auth"; 
import { JWT } from "next-auth/jwt";
import { CredentialsSchema } from "./schema/credentials.schema";
import prisma from "@/lib/db";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [  
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
        clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
    CredentialsProvider({
       name: "Credentials",
       credentials: {
         email: { label: "Email", type: "email", placeholder: "Email" },
         password: { label: "Password", type: "password", placeholder: "Password" },
        },
         async authorize(credentials) {
            if(!credentials?.email || !credentials?.password) {
              return null;
            }
            const validation = CredentialsSchema.safeParse({
              email: credentials.email,
              password: credentials.password,
         })
         if(!validation.success) {
            throw new Error("Invalid credentials");
         }
         try{
             const user = await prisma.user.findUnique({
               where: { email: credentials.email },
             });
                if (!user) {
                const hashedPassword = await bcrypt.hash(credentials.password, 10);
                const newUser = await prisma.user.create({  
                    data: {
                        email: credentials.email,
                        password: hashedPassword,
                        provider:"Credentials",
                    },
                });
                return newUser;
             }
             if(!user.password) {
                const hashedPassword = await bcrypt.hash(credentials.password, 10);
                const updatedUser = await prisma.user.update({
                    where: { email: credentials.email },
                    data: { password: hashedPassword, provider: "Credentials" },
                });
                return updatedUser;
             }
             const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
             if (!isPasswordValid) {
                throw new Error("Invalid credentials");
             }
                return user;
         }catch(e){
            console.error("Error during authorization:", e);
            throw new Error("Internal Server Error");   
         }
        }
}),
],
 pages: {
    signIn: "/auth",
},
    secret: process.env.NEXTAUTH_SECRET,
    session:{
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    callbacks:{
        async jwt({ token, account, profile }) {
            if (account && profile) {
                token.email = profile.email as string;
                token.id = account.access_token as string;
            }
            return token;
        },
        async session({ session, token }:{
            session: Session,
            token: JWT,
        }) {
           try{
            const user = await prisma.user.findUnique({
                where: { email: token.email as string },    
            });
            if (user) {
                session.user = {
                    id: user.id,
                    email: user.email,
                    name: user.name || "",
                    provider: user.provider || "Credentials",
                };
            }} catch(e){
                console.error("Error fetching user in session callback:", e);   
                throw new Error("Internal Server Error");
            }
            return session;
        },
        async signIn({ account, profile }){
            try{
            if (account?.provider === "google") {
                const user = await prisma.user.findUnique({
                    where: { email: profile?.email as string },
                });
                if (!user) {
                    await prisma.user.create({
                        data: {
                            email: profile?.email as string,
                            name: profile?.name as string,
                            provider: "Google",
                        },
                    });
                }
            }
                return true;
            } catch(e){
                console.error("Error during signIn callback:", e);
                throw new Error("Internal Server Error");
            }
            }
        }
        } satisfies NextAuthOptions
