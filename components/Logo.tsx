import Link from "next/link";
import React from "react";

function Logo() {
  return (
    <Link
      href={"/"}
      className="font-bold text-3xl bg-gradient-to-r from-indigo-400 to-cyan-400 text-transparent bg-clip-text hover:cursor-pointer"
    >
      <img
        className="h-8 w-auto"
        src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fstatic.wixstatic.com%2Fmedia%2F953520_1caed37639fc4f3c8f07141b5332599c~mv2.png%2Fv1%2Ffill%2Fw_2500%2Ch_760%2Cal_c%2F953520_1caed37639fc4f3c8f07141b5332599c~mv2.png&f=1&nofb=1&ipt=b63e4a94f182fedf58b8a25d02dd8801dd028ed5015116d0ed53309ad202ac94&ipo=images"
        alt="Latlong"
      />
    </Link>
  );
}

export default Logo;
