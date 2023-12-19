import { NextResponse } from 'next/server';
import { PrismaClient } from "@prisma/client";
import { AuthOptions, getServerSession } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

export const POST = async function (req: any, res: any) {
    const authOptions: AuthOptions = {
        secret: process.env.AUTH_SECRET,
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
    const prisma = new PrismaClient();// need to change location
    try {
        const data = await getServerSession(authOptions);
        let email=data?.user?.email||"";
        let name=data?.user?.name||"";
        let image=data?.user?.image||"";
        prisma.users.findMany({where:{mail:email}}).then((exist_user)=>{
            console.log(exist_user,'exist')
            if(exist_user.length===0){
                prisma.users.create({data:{name:name,image:image,mail:email}}) // return the status from here using await
            }
            if(exist_user.length>0){
                // implement user update
                
            }
        })
        
        
        return NextResponse.json({ "status": true })
    } catch (error) {
        // console.error(error);
        return NextResponse.json({ message: 'Internal server error' });
    }
};

