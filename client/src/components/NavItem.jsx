function NavItem({ icon, color }) {
  return (
    <div className={`p-3 m-1 md:p-5 md:m-2 ${color} rounded-lg text-center`}>
      {icon}
    </div>
  );
}

export default NavItem;