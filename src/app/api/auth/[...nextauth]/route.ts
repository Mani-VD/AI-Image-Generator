import NextAuth from 'next-auth';
import { authOptions } from '../../../global_variables';
// console.log(process.env,"env")

// export default NextAuth(authOptions);
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
