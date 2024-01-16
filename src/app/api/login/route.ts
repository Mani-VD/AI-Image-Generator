import { NextResponse } from 'next/server';
import {prisma} from '../../global_variables';
export const POST = async function (req: any, res: any) {
const req_val=await req.json();
console.log(req_val,'treeeee');
const out=await prisma.users.findMany({where:{mail:req_val.email,password:req_val.password}}).then((exist_user)=>{
    return exist_user;
},(error)=>{    
   return error
});
console.log(out,"ott")
if(out.length>0){
    return NextResponse.json({login:out[0]})
}
else{
    return NextResponse.json({"login":false});
}

}