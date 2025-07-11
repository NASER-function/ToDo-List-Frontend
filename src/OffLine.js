import { Button } from '@mui/material';
import imageOffline from './img/offline-icon.png'
export default function OffLine(){
    function HandleReload(){
        window.location.reload()
    }
    return (
      <div className="OfflineCon">
        <div style={{ flexDirection: "row", display: "flex" }}>
          <img
            style={{ width: "50px", height: "50px", marginRight: "5px" }}
            src={imageOffline}
            alt="Offline"
          />

          <h1> OffLine Now</h1>
        </div>
        <ul>
          <li>Check The Connection</li>
          <li>Checking The Proxy And The Firewall</li>
          <li>Running Windows Network Diagnostics</li>
        </ul>
        <Button onClick={HandleReload} color="primary" variant="contained">Reload</Button>
        <p style={{position:"absolute",bottom:'10px',left:"5px"}} >Best regards, Naser Elkhawaja 💜</p>
      </div>
    );
}