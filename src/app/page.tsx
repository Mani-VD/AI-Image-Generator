
"use client";
import { useSession, signIn, signOut } from 'next-auth/react';
import { useState } from 'react';
import { Button, CircularProgress, FormControlLabel, Input, Radio, RadioGroup, Toolbar, Typography } from "@mui/material";
import Image from "next/image";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import AppBar from '@mui/material/AppBar';
import GoogleButton from 'react-google-button';
import { useQRCode } from 'next-qrcode';
import Dropzone from "react-dropzone";
function Home() {
  const { data, status } = useSession();
  const { Canvas } = useQRCode();
  // console.log(data, status, 'auth vals')
  const [inputValue, setInputValue] = useState('');
  const [outputValue, setoutputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [operationSelection, setoperationSelection] = useState({ 'value': "txt2img" })
  if (status === 'loading') {
    return <CircularProgress style={{ "height": "150px", "width": "150px", marginTop: "20%", marginLeft: "45%" }} />
  }

  else if (status === 'authenticated') {

    fetch("/api/registeruser", { body: JSON.stringify({}), method: "POST" }).then(res => {
      // console.log(res, 'resss')
    });
    const toDataURL = async (url: any) => {
      const blob = await fetch(url).then(res => res.blob());
      return URL.createObjectURL(blob);
    }
    const downloadURL = async () => {
      const a = document.createElement("a");
      a.href = await toDataURL(outputValue);
      a.download = "AI-Image.png";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }

    const getBase64 = (file: any) => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setInputValue(`${reader.result}`)
      };
      reader.onerror = reject;

    });

    const handleSubmit = async (event: any, operation: "img2txt" | "txt2img") => {
      event.preventDefault();
      // console.log(event.target.files[0],"filess")
      // getBase64(event.target.files[0]).then((b64)=>{
      //   console.log(b64,"666")
      // })

      setLoading(true);
      // console.log(inputValue, "inp")
      const response = await fetch('/api/stablediffusion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ value: inputValue, operation: operation }),
      });
      // console.log(response, 'resp')
      if (response.ok) {

        const data = await response.json();
        // console.log(data, "dat")
        setoutputValue((operation === "txt2img") ? data.output[0] : (operation === "img2txt") ? data.output : "");
      } else {
        // console.error('Error:', response.statusText);
      }
      setLoading(false);
    };
    const src_meth = function () {
      return data.user?.image + `?w=50` || ""
    }
    const handleError = () => {
      // Handle login errors here
      // console.log('Google login failed');
    };
    return (
      <div>
        <AppBar position="sticky">
          <Toolbar>
            <Image alt="Your profile" style={{ "borderRadius": "50%" }} width={50} height={50} src={src_meth()} />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, padding: "5px" }}>{data.user?.name}</Typography>
            <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
              Text to image converter
            </Typography>
            <Button color="inherit" onClick={() => signOut()}>Logout</Button>
          </Toolbar>
          <Toolbar style={{ "backgroundColor": "rgb(220,220,220)", color: 'black' }}>
            <RadioGroup
              row

              aria-labelledby="demo-controlled-radio-buttons-group"
              name="controlled-radio-buttons-group"
              value={operationSelection.value}
              onChange={(ev) => { setInputValue(""); setoutputValue(""); setoperationSelection({ value: ev.target.value }) }}

            >
              <FormControlLabel value="txt2img" control={<Radio />} label="Text to Image" />
              <FormControlLabel value="img2txt" control={<Radio />} label="Image to Text" />
            </RadioGroup>
          </Toolbar>
        </AppBar>

        <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">

          {(operationSelection.value === "txt2img") ? (
            <>
              <div className="relative py-3 sm:max-w-xl sm:mx-auto">

                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-green-500 to-cyan-400 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
                <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
                  <form onSubmit={(ev) => { handleSubmit(ev, 'txt2img') }} className="max-w-md mx-auto space-y-4">
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      className="w-full px-5 py-3 text-gray-700 bg-gray-200 rounded"
                      placeholder="Enter a prompt..."
                    />

                    <button type="submit" className="w-full px-3 py-4 text-white bg-gradient-to-r from-cyan-400 via-green-500 to-cyan-400 rounded-md focus:outline-none" disabled={loading}>
                      Submit
                    </button>
                    {outputValue && !loading && (
                      <button type='button' onClick={downloadURL} className='w-full px-3 py-4 text-white bg-gradient-to-r from-blue-400 via-yellow-500 to-green-400 rounded-md focus:outline-none"' >Download</button>
                    )}
                  </form>
                </div>

              </div>
              {outputValue && !loading && (

                <div style={{display:"flex",flexDirection:"column",alignItems: "center",
                justifyContent: "center"}} className="mt-12">
                  <Image src={outputValue} width={200} height={200} alt="Generated image" className="rounded-xl shadow-lg" /><br/>
                  <span>Scan the QR Code to download the picture on your mobile</span>
                  <Canvas
                    text={outputValue}
                    options={{
                      errorCorrectionLevel: 'M',
                      margin: 3,
                      scale: 4,
                      width: 200,
                      color: {
                        dark: '#030a00',
                        light: '#ffffff',
                      },
                    }}
                  />
                </div>


              )}
            </>) :
            (operationSelection.value === "img2txt") ? (
              <>
                <div className="relative py-3 sm:max-w-xl sm:mx-auto" onDragOver={(e)=>{e.preventDefault();}} onDrop={(ev) => { ev.preventDefault();getBase64(ev.dataTransfer.items[0].getAsFile()); }}>

                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-green-500 to-cyan-400 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
                  <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
                    <form  onSubmit={(ev) => { handleSubmit(ev, 'img2txt') }} className="max-w-md mx-auto space-y-4">
                      {/* <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        className="w-full px-5 py-3 text-gray-700 bg-gray-200 rounded"
                        placeholder="Enter a prompt..."
                      /> */}
                      <input type="file" id="imageUpload" value="" accept='image/*'
                        onChange={(event: any) => {

                          getBase64(event.target.files[0]);

                        }} hidden={true} />

                      <label style={{ cursor: "pointer" }} className="w-full px-3 py-4 text-white bg-gradient-to-r from-cyan-400 via-green-500 to-cyan-400 rounded-md focus:outline-none" htmlFor='imageUpload'>
                        Upload Image

                      </label>
                      {(inputValue.length > 0) ? (<Image height={200} width={200} alt="Uploaded Image" src={inputValue} style={{ "height": "200px", "width": "200px" }} />) : (<></>)}

                      <button type="submit" className="w-full px-3 py-4 text-white bg-gradient-to-r from-cyan-400 via-green-500 to-cyan-400 rounded-md focus:outline-none" disabled={loading}>
                        Submit
                      </button>

                    </form>
                  </div>

                </div>
                {outputValue.length > 0 && !loading && (

                  <div style={{display:"flex",flexDirection:"column",alignItems: "center",
                  justifyContent: "center"}} className="mt-12">
                    <Typography style={{ "fontWeight": "bolder", "color": "green", fontSize: "20px", "fontStyle": "italic" }} className="rounded-xl shadow-lg">{outputValue}<ContentCopyIcon className='copyIcon' onClick={() => { navigator.clipboard.writeText(outputValue) }} style={{ "cursor": "pointer", "fontSize": "35px", "paddingLeft": "10px" }}></ContentCopyIcon></Typography><br/>
                    Scan the QR code the get the text to your phone.
                    <Canvas
                    text={outputValue}
                    options={{
                      errorCorrectionLevel: 'M',
                      margin: 3,
                      scale: 4,
                      width: 200,
                      color: {
                        dark: '#030a00',
                        light: '#ffffff',
                      },
                    }}
                  />
                  </div>


                )}
              </>) : (<></>)}

          {loading && (
            <div className="mt-12 flex justify-center">
              <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
            </div>
          )}

          <style jsx>{`
          .loader {
            animation: spin 1s linear infinite;
            border-top-color: #3498db;
          }
  
          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}</style>
        </div>
      </div>
    );
  }


  else if (status === "unauthenticated") {
    return (


      <div>
        <div style={{marginTop:"40vh"}}>
          <form >
            <div className='lg-una' onClick={() => signIn('google')}>
              <label className="sign" htmlFor="Sign in">Sign in with:</label>
              <GoogleButton
                className="btn_ggl" > 
                
                Sign in With Google</GoogleButton>
                {/* Optionally, you can customize the button appearance and behavior */}
            </div>
          </form>
        </div>

      </div>

      // <div className="g_id_signin">
      //   <Button onClick={() => signIn('google')} variant="contained" >Sign in with Google</Button>
      //   {/* startIcon={<SendIcon />} */}
      //   {/* <button onClick={() => signIn('google')}>sign in with gooogle</button> */}
      // </div>
    );

  }



}

// function Home(){
//   return (<div style={{backgroundColor:"red"}}>HI</div>)
// }

export default Home;