import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from "next-auth/providers/credentials";
import { AuthOptions } from 'next-auth';
import { PrismaClient } from '@prisma/client';
export const prisma = new PrismaClient();
export const authOptions: AuthOptions = {
    secret: process.env.AUTH_SECRET,
    pages:{
      "signIn":"/"
    },
    providers: [
      CredentialsProvider({
        // The name to display on the sign in form (e.g. 'Sign in with...')
        name: 'credentials',
        // The credentials is used to generate a suitable form on the sign in page.
        // You can specify whatever fields you are expecting to be submitted.
        // e.g. domain, username, password, 2FA token, etc.
        // You can pass any HTML attribute to the <input> tag through the object.
        
        credentials: {
          email: {
            label: 'email',
            type: 'email',
            placeholder: 'jsmith@example.com',
          },
          password: { label: 'Password', type: 'password' }
        },
        async authorize(credentials, req) {
          const payload = {
            email: credentials!.email,
            password: credentials!.password,
          };
          const res = await fetch(`${process.env.NEXTAUTH_URL}/api/login`, {
            method: 'POST',
            body: JSON.stringify(payload)
          }).then((loggin)=>{
            return loggin
          },(error)=>{return error});
          const out=await res.json();
          if(out.login!=false){
           
            return {id:`${out.login.id}`,name:out.login.name,email:out.login.mail,image:out.login.image}
          }
          else{
            return null;
          }
          
        },
      }),
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT || "",
        clientSecret: process.env.GOOGLE_SECRET || "",
        authorization: {
          params: {
            prompt: "consent",
            access_type: "offline",
            response_type: "code"
          }
        }
      }),
    ],
  
    session: {
      strategy: 'jwt',
    },
  };