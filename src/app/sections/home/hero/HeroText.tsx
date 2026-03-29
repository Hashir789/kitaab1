import WaitList from "./WaitList";
import styles from "./herotext.module.css";
import Motion from "@/components/secondary/motion/Motion";

export default function HeroText() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <Motion
      as="section"
      className={styles.leftPortion}
      aria-labelledby="hero-heading"
      itemScope
      itemType="https://schema.org/WebPageElement"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className={styles.leftContent}>
        <div className={styles.contentWrapper}>
          <Motion
            as="h1"
            id="hero-heading"
            className={styles.titleLine1}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            Be your own
          </Motion>
          <Motion
            as="h2"
            className={styles.titleLine2}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            Accountant
          </Motion>
          <Motion
            as="p"
            className={styles.subtitle}
            itemProp="description"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            Track your deeds, reflect, grow, and improve every day — with{" "}
            <span className={styles.kitaabSpan}>Kitaab</span>.
          </Motion>
          <Motion
            className={styles.buttonGroupContainer}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            <WaitList />
          </Motion>
        </div>
      </div>
    </Motion>
  );
}
