import { HiOutlineExternalLink, HiOutlineQuestionMarkCircle } from "react-icons/hi";

function Header() {
  return (
    <>
      <div className="font-russo text-white bg-zinc-700 h-[10%] w-screen flex justify-between">
        <div className="flex h-full items-center p-8">
          <h1 className="text-xl sm:text-2xl md:text-4xl">Testing</h1>
        </div>

        <div className="flex h-full items-center p-8 text-xl">
          <div className="p-4 m-2 bg-zinc-800 rounded-lg text-center">
            <HiOutlineQuestionMarkCircle className="text-2xl"/>
          </div>
          <div className="p-4 m-2 bg-red-500 rounded-lg text-center">
            <HiOutlineExternalLink />
          </div>
          <div className="p-4 m-2 bg-cyan-400 rounded-lg text-center">
            <HiOutlineExternalLink/>
          </div>
        </div>
      </div>
    </>
  )
}

export default Header
