import NextAuth, { AuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
// console.log(process.env,"env")
export const authOptions:AuthOptions = {
 providers: [
  GoogleProvider({
   clientId: process.env.GOOGLE_CLIENT || "",
   clientSecret: process.env.GOOGLE_SECRET || "",
  }),
 ],
 session: {
  strategy: 'jwt'
 },
};
// export default NextAuth(authOptions);
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
