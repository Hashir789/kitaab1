import HomeGate from "./HomeGate";
import style from "./page.module.css";
import Hero from "./sections/home/hero/Hero";
import Beta from "./sections/home/beta/Beta";
import Charlie from "./sections/home/charlie/Charlie";

export default function Home() {
  return (
    <HomeGate>
      <div className={style.body}>
        <Hero />
        <Beta />
        <Charlie />
      </div>
    </HomeGate>
  );
}