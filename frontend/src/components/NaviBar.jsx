import React from "react";
import { Link } from "react-router-dom";

export default function LinkBar({ items }) {
  return (
   <div className="border-b border-[#dbdbdb] w-full py-1 ">
     <nav className="p-3 max-h-[4rem] w-fit  bg-[#f4f4f5] flex items-center gap-5 mx-2 rounded-lg">
      {/* <IoSettings size={30} />  */}
      {items.map((item, key) => (
        <Link
          key={key}
          to={item.to}
          className={`flex gap-2 items-center hover:bg-[#ffffff] text-[#9a9aa0] p-3 rounded-lg ${
            item.isActive ? "bg-[#ffffff] text-[#141416]" : ""
          }`}
        >
          {item.icon}
          <div className="flex flex-col items-start">
            <span className="leading-none text-sm">{item.name}</span>
            <small className="leading-none text-xs text-default-500">
              {item.desc}
            </small>
          </div>
        </Link>
      ))}
    </nav>
    </div>
  );
}
