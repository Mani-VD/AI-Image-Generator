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
  const { value } = req_val;
  

  try {
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    const output:any = await replicate.run(
      "stability-ai/stable-diffusion:db21e45d3f7023abc2a46ee38a23973f6dce16bb082a930b0c49861f96d1e5bf",
      {
        input: {
          prompt: value,
          image_dimensions: "512x512",
          num_inference_steps: 12,
          num_outputs: 1,
          guideance_scale: 3.5,
          scheduler: "K_EULER",
        },
      },
    );
    // console.log(output,'ot')
    return NextResponse.json({output:output})
  
  } catch (error) {
    // console.error(error);
    NextResponse.json({ message: 'Internal server error' });
  }
};

