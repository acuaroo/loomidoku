function NavItem({ icon, color }) {
  return (
    <div className={`p-5 m-2 bg-${color} rounded-lg text-center`}>
      {icon}
    </div>
  );
}

export default NavItem;