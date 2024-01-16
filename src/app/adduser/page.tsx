"use client"
import { Alert, AlertColor, Box, Button, Grid, Input, Paper, TextField, styled } from "@mui/material";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";

const AddUser = function () {
    var alertColor: AlertColor | undefined = "info";
    const [alertContent, setAlertContent] = useState({ "show": false, "content": "", alertColor: alertColor })
    const [userData, setUserData] = useState({ "email": "", "password": "", "name": "" })
    const router = useRouter();
    const addUserToDb = (ev: any) => {
        fetch("/api/registeruser", { body: JSON.stringify({ "add_user": true, "data": userData }), method: "POST" }).then(async res => {
            const resp = await res.json();
            console.log(resp, "resssppp")
            if (resp.status === 200 && resp.message === "add_user_failure") {
                alertContent.show = true;
                alertContent.content = resp.info;
                alertColor = "error";
                setAlertContent({ ...alertContent })
            }
            else if (resp.status === 200 && resp.message === "add_user_success") {
                alertContent.show = true;
                alertContent.content = resp.info;
                alertColor = "success";
                setAlertContent({ ...alertContent })
                

            }

        });
    }
    return <>
        {alertContent.show && <Alert severity={alertContent.alertColor} onClose={() => { alertContent.show = false; setAlertContent({ ...alertContent }) }} >
            {alertContent.content}
        </Alert>}
        <Box sx={{ p: 2, border: '1px solid rgb(220,220,220)', marginTop: "30vh", width: "30vw", marginLeft: "35vw", borderRadius: "15px" }}>
            <h2 className="text-center font-bold">Add User</h2>
            <form >
                <Grid container spacing={2}>
                    <Grid item xs={12}>

                        <TextField error={userData.name.trim().length > 100 || userData.name.trim().length < 2} style={{ "width": "100%" }} type="text" multiline={false} value={userData.name} placeholder="Name" onChange={(ev) => { userData.name = ev.target.value; setUserData({ ...userData }) }} />

                    </Grid>
                    <Grid item xs={12}>
                        <TextField style={{ "width": "100%" }} error={userData.email.trim().length > 100 || userData.email.trim().length < 2} type="email" multiline={false} value={userData.email} placeholder="Email" onChange={(ev) => { userData.email = ev.target.value; setUserData({ ...userData }) }} />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField style={{ "width": "100%" }} error={userData.password.trim().length > 100 || userData.password.trim().length < 2} type="password" multiline={false} value={userData.password} placeholder="Password" onChange={(ev) => { userData.password = ev.target.value; setUserData({ ...userData }) }} />
                    </Grid>
                    <Grid item xs={6}>
                        <Button variant="contained" onClick={addUserToDb} className="w-full" color="success" type="button">Add User</Button>
                    </Grid>
                    <Grid item xs={6}>
                        <Button variant="contained" className="w-full" color="error" type="button" onClick={() => { setUserData({ "email": "", "password": "", "name": "" }) }}>Cancel</Button>
                    </Grid>
                </Grid>

            </form>
        </Box>
    </>
}
export default AddUser;