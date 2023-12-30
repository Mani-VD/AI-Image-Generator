import Link from "next/link";

export default function NotFound() {
    return (
        <div className="global">
            <div style={{ "width": "50vw", height: "50vh", marginLeft: "25vw", 'marginTop': "25vh",'paddingLeft':"10%","backgroundColor":"red",color:"white",borderRadius:"15px","fontSize":"25px","paddingTop":"10%" }}>
                <h2>There is no such page.</h2>
                <p>You have landed on a page which you are not looking for.</p>
                <Link style={{"backgroundColor":"green","color":"white"}} href="/">Return Home</Link>
            </div>

        </div>
    );
}