import { Link, useLocation } from "react-router-dom";

function BottomBar() {
  const location = useLocation();
  const currentPath = location.pathname;
  const menuItems = [
    { label: "Home", name: "Home", icon: "home", path: "/" },
    { label: "About", name: "About", icon: "info", path: "/about" },
    {
      label: "Post a video",
      name: "Post a video",
      icon: "add",
      path: "/create-video",
    },
    {
      label: "Analytics",
      name: "Analytics",
      icon: "analytics",
      path: "/analytics",
    },
  ];

  return (
    <section className="bottombar">
      <div className="bottombar_container">
        {menuItems.map((link) => {
          return (
            <Link
              to={link.path}
              key={link.label}
              className={`bottombar_link ${
                currentPath === link.path
                  ? "bg-violet-500 text-white"
                  : "hover:bg-violet-800 hover:text-white"
              }`}
            >
              <i className="material-icons">{link.icon}</i>

              <p className="text-subtle-medium  max-sm:hidden">
                {link.label.split(/\s+/)[0]}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export default BottomBar;
