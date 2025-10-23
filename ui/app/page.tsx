import Image from "next/image";

export default function Home() {
  return (
   <div>
    <h1 className="p-4 pb-20 font-serif text-center text-5xl">News/Article Summarizer</h1>
    <div>
      <form className="pl-20 space-x-20">
        <div className="text-2xl inline-block">Enter URL :</div>
        <div className="inline-block"><input
        required 
        name="url"
        placeholder="Enter Valid URL"
        /></div>
      <div className="inline-block"><button type ="submit">Summarize</button></div>
      </form>
    </div>
   </div>
  );
}
