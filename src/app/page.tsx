"use client";

import style from "./page.module.css";
import Hero from "./sections/hero/Hero";

export default function Home() {
  return (
    <div className={style.body}>
      <Hero />
      <div className={style.placeholder}></div>
    </div>
  );
}