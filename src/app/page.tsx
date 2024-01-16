// "use client"
// import * as React from 'react';
// import Box from '@mui/material/Box';
// import Drawer from '@mui/material/Drawer';
// import Button from '@mui/material/Button';
// import List from '@mui/material/List';
// import Divider from '@mui/material/Divider';
// import ListItem from '@mui/material/ListItem';
// import ListItemButton from '@mui/material/ListItemButton';
// import ListItemIcon from '@mui/material/ListItemIcon';
// import ListItemText from '@mui/material/ListItemText';
// import InboxIcon from '@mui/icons-material/MoveToInbox';
// import MailIcon from '@mui/icons-material/Mail';
// import { AppBar, Toolbar } from '@mui/material';

// type Anchor = 'top' | 'left' | 'bottom' | 'right';

// export default function TemporaryDrawer() {
//   const [state, setState] = React.useState({
//     top: false,
//     left: false,
//     bottom: false,
//     right: false,
//   });

//   const toggleDrawer =
//     (anchor: Anchor, open: boolean) =>
//     (event: React.KeyboardEvent | React.MouseEvent) => {
//       if (
//         event.type === 'keydown' &&
//         ((event as React.KeyboardEvent).key === 'Tab' ||
//           (event as React.KeyboardEvent).key === 'Shift')
//       ) {
//         return;
//       }

//       setState({ left:open,right:false,top:false,bottom:false });
//     };

//   const list = (anchor: Anchor) => (
//     <Box
//       sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
//       role="presentation"
//       onClick={toggleDrawer(anchor, false)}
//       onKeyDown={toggleDrawer(anchor, false)}
//     >
//       <List>
//         {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
//           <ListItem key={text} disablePadding>
//             <ListItemButton>
//               <ListItemIcon>
//                 {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
//               </ListItemIcon>
//               <ListItemText primary={text} />
//             </ListItemButton>
//           </ListItem>
//         ))}
//       </List>
//       <Divider />
//       <List>
//         {['All mail', 'Trash', 'Spam'].map((text, index) => (
//           <ListItem key={text} disablePadding>
//             <ListItemButton>
//               <ListItemIcon>
//                 {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
//               </ListItemIcon>
//               <ListItemText primary={text} />
//             </ListItemButton>
//           </ListItem>
//         ))}
//       </List>
//     </Box>
//   );

//   return (
//     <div>
//       <AppBar position='sticky'>
//         <Toolbar>
//           HIi
//         </Toolbar>
//       </AppBar>
//       {(['left', 'right', 'top', 'bottom'] as const).map((anchor) => (
//         <>
//         <Button onClick={toggleDrawer(anchor, true)}>{anchor}</Button>
//         <React.Fragment key={anchor}>

//           <Drawer
//             anchor={anchor}
//             open={state[anchor]}
//             onClose={toggleDrawer(anchor, false)}
//           >
//             {list(anchor)}
//           </Drawer>
//         </React.Fragment>
//         </>
//       ))}
//     </div>
//   );
// }




"use client";
import { useSession, signIn, signOut, getSession } from 'next-auth/react';
import { FormEvent, useState } from 'react';
import { Box, Button, CircularProgress, Divider, Drawer, FormControlLabel, Input, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Radio, RadioGroup, Toolbar, Typography } from "@mui/material";
import Image from "next/image";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import AppBar from '@mui/material/AppBar';
import GoogleIcon from '@mui/icons-material/Google';
import { useQRCode } from 'next-qrcode';
import { useRouter } from 'next/navigation';
import React from 'react';
function Home() {
  const { data, status } = useSession();
  getSession().then((ses) => { console.log(ses, "sess") })
  const router = useRouter();
  const { Canvas } = useQRCode();
  // console.log(data, status, 'auth vals')
  const [inputValue, setInputValue] = useState('');
  const [outputValue, setoutputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [operationSelection, setoperationSelection] = useState({ 'value': "txt2img" })
  const [state, setState] = React.useState({

    left: false,
  });
  const handleCredentialLogin = async (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    const data = new FormData(ev.currentTarget);
    const email = data.get("email"), password = data.get("password");
    if (email!.toString().trim().length > 0 && password!.toString().trim().length > 0) {
      console.log(data.get("email"), data.get("password"), "daa");
      signIn("credentials", { email, password });
    }


  }

  if (status === 'loading') {
    return <CircularProgress style={{ "height": "150px", "width": "150px", marginTop: "20%", marginLeft: "45%" }} />
  }

  if (status === 'authenticated') {

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
      return data.user?.image || ""
    }

    const toggleDrawer = (event: React.KeyboardEvent | React.MouseEvent | any, open: boolean) => {
      console.log('tooggg')
      if (
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return;
      }

      setState({ left: open });

    }

    const menuList = [
      { text: "Add User", icon: "account", action: (ev: any) => { router.push("/signup"); toggleDrawer(ev, false) } },
      { text: "Logout", icon: "logout", action: (ev: any) => { signOut(); toggleDrawer(ev, false) } }
    ]

    const list = () => (
      <Box
        sx={{ width: 250 }}
        role="presentation"
        onKeyDown={(event) => { toggleDrawer(event, false) }}
      >
        <List>
          {menuList.map((obj, index) => (
            <ListItem key={index} disablePadding>
              <ListItemButton onClick={obj.action}>

                <ListItemText primary={obj.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

      </Box>
    );


    return (
      <Box>
        <React.Fragment key={"left"}>
          <Drawer
            anchor={"left"}
            open={state.left}
            onClose={(event) => toggleDrawer(event, false)}
          >
            {list()}
          </Drawer>
        </React.Fragment>
        <AppBar position="sticky">
          <Toolbar>
            <Image onClick={(event) => { toggleDrawer(event, true) }} alt="Your profile" style={{ "borderRadius": "50%", "cursor": "pointer" }} width={50} height={50} src={src_meth()} />
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

                <div style={{
                  display: "flex", flexDirection: "column", alignItems: "center",
                  justifyContent: "center"
                }} className="mt-12">
                  <Image src={outputValue} width={200} height={200} alt="Generated image" className="rounded-xl shadow-lg" /><br />
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
                <div className="relative py-3 sm:max-w-xl sm:mx-auto" onDragOver={(e) => { e.preventDefault(); }} onDrop={(ev) => { ev.preventDefault(); getBase64(ev.dataTransfer.items[0].getAsFile()); }}>

                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-green-500 to-cyan-400 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
                  <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
                    <form onSubmit={(ev) => { handleSubmit(ev, 'img2txt') }} className="max-w-md mx-auto space-y-4">
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

                  <div style={{
                    display: "flex", flexDirection: "column", alignItems: "center",
                    justifyContent: "center"
                  }} className="mt-12">
                    <Typography style={{ "fontWeight": "bolder", "color": "green", fontSize: "20px", "fontStyle": "italic" }} className="rounded-xl shadow-lg">{outputValue}<ContentCopyIcon className='copyIcon' onClick={() => { navigator.clipboard.writeText(outputValue) }} style={{ "cursor": "pointer", "fontSize": "35px", "paddingLeft": "10px" }}></ContentCopyIcon></Typography><br />
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
      </Box>
    );
  }


  else if (status === "unauthenticated") {
    //  router.push("/api/auth/signin")
    return (


      <div>
        <div style={{ marginTop: "30vh",marginLeft:"40vw" }}  className="w-full max-w-xs bg-green-500 rounded">
          <form onSubmit={(e) => { handleCredentialLogin(e) }} className="bg-green shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <div className="mb-4">
              <label className="block text-700 text-sm font-bold mb-2" style={{"color":"white"}} htmlFor="username">
                Username/Email
              </label>
              <input type="email" name="email" placeholder="Email" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
            </div>
            <div className="mb-4">
              <label className="block text-700 text-sm font-bold mb-2" style={{"color":"white"}} htmlFor="password">
                Password
              </label>
              <input type="password" name="password" placeholder="Password" className="shadow appearance-none border  rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" />
            </div>
            <div className="flex items-center justify-between">
              <button className="bg-blue-500 hover:bg-blue-700 w-full text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                Sign In
              </button>
            </div>

            
          </form>
          <div className='text-center rounded' style={{ "color": "white",backgroundColor:"red",width:"80%",marginLeft:"10%" }} onClick={() => signIn('google')}>
              <span> <GoogleIcon  /> Sign in With Google</span>
            </div><br/>
            <button className="bg-blue-500 hover:bg-blue-700 ml-8 text-white font-bold py-2 px-4 w-4/5 rounded" type='button' onClick={() => { router.push("/signup") }}>Sign Up</button>
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