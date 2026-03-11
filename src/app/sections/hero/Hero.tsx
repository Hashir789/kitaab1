import HeroText from "./HeroText";
import styles from "./hero.module.css";
import HeroRightPortion from "./HeroRightPortion";

export default function Hero() {
  return (
    <div className={styles.container}>
      <HeroText />
      <HeroRightPortion />
    </div>
  );
}