import { NextResponse } from 'next/server';
import {  getServerSession } from 'next-auth';
import {prisma} from '../../global_variables';
import { authOptions } from '../../global_variables';
// const prisma = new PrismaClient();// need to change location
export const POST = async function (req: any, res: any) {    
    try {
        const data = await getServerSession(authOptions);
        let email=data?.user?.email||"";
        let name=data?.user?.name||"";
        let image=data?.user?.image||"";
        prisma.users.findMany({where:{mail:email}}).then((exist_user)=>{
            console.log(exist_user,'exist')
            if(exist_user.length===0){
                prisma.users.create({data:{name:name,image:image,mail:email}})
                .then((res:any)=>{
                    console.log(res,"res")
                })
                // return the status from here using await
            }
            if(exist_user.length>0){
                // implement user update
                exist_user.forEach((user: { id: number; name: string; image: string;mail:string })=>{
                    prisma.users.update({where:{id:user.id},data:{name:user.name,image:user.image}})
                })
                
                
            }
        })
        
        
        return NextResponse.json({ "status": true })
    } catch (error) {
        // console.error(error);
        return NextResponse.json({ message: 'Internal server error' });
    }
};

