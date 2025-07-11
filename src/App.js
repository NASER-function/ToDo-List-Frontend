import './App.css';
import ToDoListApp from "./ToDoListApp";
// import "./index.css";

import {  ThemeContextProvider } from "./ConText/ThemeConText";

import { useEffect, useState } from 'react';
import OffLine from './OffLine';






export default function App() {
  const[IsOnLine,SetIsOnLine]=useState(navigator.onLine)

  useEffect(()=>{
    const handleOnLine = () => SetIsOnLine(true);
    const handleOffLine = () => SetIsOnLine(false);

    window.addEventListener("online", handleOnLine)
    window.addEventListener("offLine", handleOffLine)

    return()=>{
      window.removeEventListener("online", handleOnLine);
      window.removeEventListener("offLine", handleOffLine);
    }
  })
 
  return (
    <div className="App">
      
        <ThemeContextProvider>
          <ToDoListApp />
          {/* {IsOnLine ? <ToDoListApp /> : <OffLine />} */}
        </ThemeContextProvider>
      
    </div>
  );
}



