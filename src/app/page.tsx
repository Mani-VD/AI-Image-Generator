
"use client";
import { useSession, signIn, signOut } from 'next-auth/react';
import { useState } from 'react';
import { Button, CircularProgress, Toolbar, Typography } from "@mui/material";
import Image from "next/image";
import AppBar from '@mui/material/AppBar';
function Home() {
  const { data, status } = useSession();
  console.log(data, status, 'auth vals')
  const [inputValue, setInputValue] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);

  if (status === 'loading') {
    return <CircularProgress style={{"height":"150px","width":"150px",marginTop:"20%",marginLeft:"45%"}} />
  }

  else if (status === 'authenticated') {
   fetch("/api/registeruser",{body:JSON.stringify({}),method:"POST"}).then(res =>{
    console.log(res,'resss')
   });
    const toDataURL = async (url: any) => {
      const blob = await fetch(url).then(res => res.blob());
      return URL.createObjectURL(blob);
    }
    const downloadURL = async () => {
      const a = document.createElement("a");
      a.href = await toDataURL(imageUrl);
      a.download = "AI-Image.png";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
    const handleSubmit = async (event: any) => {
      event.preventDefault();
      setLoading(true);
      // console.log(inputValue, "inp")
      const response = await fetch('/api/stablediffusion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ value: inputValue }),
      });
      // console.log(response, 'resp')
      if (response.ok) {

        const data = await response.json();
        // console.log(data, "dat")
        setImageUrl(data.output[0]);
      } else {
        console.error('Error:', response.statusText);
      }
      setLoading(false);
    };
    const src_meth=function(){
      return data.user?.image+`?w=50` || ""
    }
    return (
      <div>
         <AppBar position="fixed">
            <Toolbar>
             <Image alt="Your profile" style={{"borderRadius":"50%"}} width={50} height={50}   src={src_meth()}/>
             <Typography variant="h6"  component="div" sx={{ flexGrow: 1,padding:"5px" }}>{data.user?.name}</Typography>
              <Typography  variant="h5" component="div" sx={{ flexGrow: 1 }}>
                Text to image converter
              </Typography>
              <Button color="inherit" onClick={() => signOut()}>Logout</Button>
            </Toolbar>
          </AppBar>
      <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
        
         
          <div className="relative py-3 sm:max-w-xl sm:mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-green-500 to-cyan-400 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
            <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
              <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
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
                {imageUrl && !loading && (
                  <button type='button' onClick={downloadURL} className='w-full px-3 py-4 text-white bg-gradient-to-r from-blue-400 via-yellow-500 to-green-400 rounded-md focus:outline-none"' >Download</button>
                )}
              </form>
            </div>
          </div>
          {loading && (
            <div className="mt-12 flex justify-center">
              <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
            </div>
          )}
          {imageUrl && !loading && (

            <div className="mt-12 flex justify-center">
              <Image src={imageUrl} alt="Generated image" className="rounded-xl shadow-lg" />
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
        <Button onClick={() => signIn('google')} variant="contained">Google login</Button>
        {/* <button onClick={() => signIn('google')}>sign in with gooogle</button> */}
      </div>
    );
  }



}

// function Home(){
//   return (<div style={{backgroundColor:"red"}}>HI</div>)
// }

export default Home;