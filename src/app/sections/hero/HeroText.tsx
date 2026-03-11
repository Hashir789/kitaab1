"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import styles from "./herotext.module.css";
import ButtonGroup from "@/components/secondary/buttongroup/ButtonGroup";

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
    <motion.section
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
          <motion.h1
            id="hero-heading"
            className={styles.titleLine1}
            variants={itemVariants}
          >
            Be your own
          </motion.h1>
          <motion.h2
            className={styles.titleLine2}
            variants={itemVariants}
          >
            Accountant
          </motion.h2>
          <motion.p
            className={styles.subtitle}
            itemProp="description"
            variants={itemVariants}
          >
            Track your deeds, reflect, grow, and improve every day — with{" "}
            <span className={styles.kitaabSpan}>Kitaab</span>.
          </motion.p>
          <motion.div
            className={styles.buttonGroupContainer}
            variants={itemVariants}
          >
            <ButtonGroup
              buttonWidth={150}
              buttonHeight={35}
              activeIndex={0}
            >
              <Link href="/features">Explore Kitaab</Link>
              <Link href="/contact">Learn More</Link>
            </ButtonGroup>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
