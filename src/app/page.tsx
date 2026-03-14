import style from "./page.module.css";
import Hero from "./sections/home/hero/Hero";
import Beta from "./sections/home/beta/Beta";

export default function Home() {
  return (
    <div className={style.body}>
      <Hero />
      <Beta />
    </div>
  );
}