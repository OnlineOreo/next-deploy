import Button from "./Components/Button";
import SearchBtn from "./Components/SearchBtn";
export default function Home() {
  return (
    <>
      <div className="w-screen h-screen flex items-center justify-center">
          <div>
            <strong>Mannu Rawat</strong><br></br>
            <span>Software Developer</span>
            <h2 className="mb-2">This is my test website to host in vercel</h2>
            <Button/>
            <SearchBtn/>
          </div>
      </div>
    </>
  );
}
