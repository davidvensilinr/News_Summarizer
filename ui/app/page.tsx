'use client'
import Image from "next/image";
import { useState } from "react";
export default function Home() {
  const [text,setText]=useState("");
  const [result,setResult]=useState(null);
  const handleSubmit = async (e)=>{
    e.preventDefault();
    try{
      console.log(JSON.stringify({url: text}))
      const response = await fetch("http://127.0.0.1:8000/analyse", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({url: text})
      });
      const data = await response.json();
      setResult(data);

    }
    catch(error){
      console.error("Error",error);
    }
  }

  return (
   <div>
    <h1 className="p-4 pb-20 font-serif text-center text-5xl">News/Article Summarizer</h1>
    <div>
      <form className="pl-20 space-x-20" onSubmit={handleSubmit}>
        <div className="text-2xl inline-block">Enter URL :</div>
        <div className="inline-block"><input
        required 
        name="url"
        type="url"
        placeholder="Enter Valid URL"
        onChange={(e)=>setText(e.target.value)}
        /></div>
      <div className="inline-block"><button type ="submit">Summarize</button></div>
      {
        result&&(
          <div>
            <p>{result.summary}</p>
          </div>
        )
      }
      </form>
    </div>
   </div>
  );
}
