import Image from "next/image";
import styles from "./page.module.css";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";

export default function Home() {
  return (
    <div>
     <SimpleEditor/>
    </div>
  );
}
