import { HiLink ,HiOutlineQuestionMarkCircle } from "react-icons/hi";

import NavItem from "./NavItem";
import logo from "../assets/loomidoku_tilted.png";

function Header() {
  return (
    <header className="bg-zinc-700 p-4 md:p-8 flex justify-between items-center">
      <div className="flex items-center">
        <img src={logo} alt="Loomidoku logo" className="w-20 h-20 mr-4" />
        <h1 className="invisible sm:text-3xl sm:visible md:text-5xl">Loomidoku</h1>
      </div>

      <div className="flex text-xl">
        <NavItem icon={<HiOutlineQuestionMarkCircle className="text-3xl"/>} color="zinc-800" />
        <NavItem icon={<HiLink className="text-3xl"/>} color="red-500" />
        <NavItem icon={<HiLink className="text-3xl"/>} color="cyan-400" />
      </div>
    </header>
  );
}

export default Header;