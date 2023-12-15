function Header() {
  return (
    <>
      <div className="bg-zinc-700 h-[10%] w-screen flex justify-between">
        <div className="flex h-full items-center p-10">
          <h1 className="font-russo text-white text-4xl">Loomidoku</h1>
        </div>

        <div className="flex h-full items-center p-10">
          <div className="bg-zinc-800 rounded-lg h-10 w-10 text-center">
            ?
          </div>
        </div>
      </div>
    </>
  )
}

export default Header
