import { NextResponse } from 'next/server';
import Replicate from 'replicate';

export const POST = async function(req: any, res: any) {
  // console.log(typeof req,typeof res,'types')
  let req_val=await req.json();
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }
  // console.log(req,"valll")
  const { value,operation } = req_val;
  

  try {
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });
    let output:any;
    const engine:`${string}/${string}` | `${string}/${string}:${string}`=(operation==="txt2img")?"stability-ai/stable-diffusion:db21e45d3f7023abc2a46ee38a23973f6dce16bb082a930b0c49861f96d1e5bf":(operation==="img2txt")?"salesforce/blip:2e1dddc8621f72155f24cf2e0adbde548458d3cab9f00c0139eea840d0ac4746":`""/""`;
    const options=(operation==="txt2img")?{
      input: {
        prompt: value,
        image_dimensions: "512x512",
        num_inference_steps: 12,
        num_outputs: 1,
        guideance_scale: 3.5,
        scheduler: "K_EULER",
      },
    }:(operation==="img2txt")?{
      input: {
        image:value
      }
    }:{input:{}};
    
     output = await replicate.run(
      engine,
    options
    );
    // console.log(output,'ot')
    return NextResponse.json({output:output})
  
  } catch (error) {
    // console.error(error);
    NextResponse.json({ message: 'Internal server error' });
  }
};

