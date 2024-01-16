import { NextResponse } from 'next/server';
import {  getServerSession } from 'next-auth';
import {prisma} from '../../global_variables';
import { authOptions } from '../../global_variables';
// const prisma = new PrismaClient();// need to change location
export const POST = async function (req: any, res: any) {    
    const response={status:400,message:"",info:""}
    try {
        const input=await req.json();
        if(input.add_user===false){
            const data = await getServerSession(authOptions);
            let email=data?.user?.email||"";
            let name=data?.user?.name||"";
            let image=data?.user?.image||"";
            await prisma.users.findMany({where:{mail:email}}).then((exist_user)=>{
                if(exist_user.length===0){
                    prisma.users.create({data:{name:name,image:image,mail:email}})
                    .then((res:any)=>{
                        response.status=200;
                        response.message="add_user_success";
                    })
                    // return the status from here using await
                }
                else if(exist_user.length>0){
                    // implement user update
                    exist_user.forEach((user: { id: number; name: string; image: string;mail:string })=>{
                        prisma.users.update({where:{id:user.id},data:{name:user.name,image:user.image}})
                    })
                    response.status=200;
                    response.message="update_user_success";
                    response.info="User successfully updated";
                    
                }
            })
        }
        else if(input.add_user===true){
            await prisma.users.findMany({where:{mail:input.data.email}}).then(async (exist_user)=>{
                if(exist_user.length===0){
                    await prisma.users.create({data:{name:input.data.name,mail:input.data.email,image:"",password:input.data.password}})
                    .then((res:any)=>{
                        response.status=200;
                        response.message="add_user_success";
                        response.info="User successfully added";
                        
                    })
                    // return the status from here using await
                }
                if(exist_user.length>0){
                    response.status=200;
                    response.message="add_user_failure";
                    response.info="User Exists";
                    
                    
                }
            })
        }
  
        
        
        return NextResponse.json(response)
    } catch (error) {
        return NextResponse.json({ message: 'Internal server error' });
    }
};

