import React from "react";
import { Link, useLocation } from "react-router-dom";

function Sidebar() {
  const location = useLocation();
  const currentPath = location.pathname;

  const menuItems = [
    { name: "Home", icon: "home", path: "/" },
    { name: "About", icon: "info", path: "/about" },
    { name: "Post a video", icon: "add", path: "/create-video" },
    { name: "Analytics", icon: "analytics", path: "/analytics" },
  ];

  return (
    <section className="custom-scrollbar leftsidebar bg-gray-900">
      <div className="flex flex-1 flex-col gap-6 w-full px-6">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`leftsidebar_link ${
              currentPath === item.path
                ? "bg-violet-500 text-white"
                : "hover:bg-violet-800 hover:text-white"
            }`}
          >
            <i className="material-icons text-white">{item.icon}</i>
            <p className="max-lg:hidden text-white">{item.name}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default Sidebar;

// {
//   sidebarLinks.map((link) => {
//     const isActive =
//       (pathname.includes(link.route) && link.route.length > 1) ||
//       pathname === link.route;

//     if (link.route === "/profile") link.route = `${link.route}/${userId}`;
//     return (
//       <Link
//         href={link.route}
//         key={link.label}
//         className={`leftsidebar_link ${isActive && "bg-primary-500"}`}
//       >
//         <Image src={link.imgURL} alt="link image" width={24} height={24} />
//         <p className="text-light-1 max-lg:hidden">{link.label}</p>
//       </Link>
//     );
//   });
// }
