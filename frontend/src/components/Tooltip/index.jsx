import Tippy from "@tippyjs/react";
import { Children } from "react";
import "tippy.js/dist/tippy.css";

export default function TippyTooltip({ children, text }) {
  return <Tippy content={<span>{text}</span>}>{children}</Tippy>;
}
