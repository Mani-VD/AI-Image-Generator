import NextAuth, { AuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
// console.log(process.env,"env")
 const authOptions:AuthOptions = {
    secret: process.env.AUTH_SECRET,
 providers: [
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
  strategy: 'jwt'
 },
};
// export default NextAuth(authOptions);
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
