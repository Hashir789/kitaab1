import styles from "./beta.module.css";
import Ayah from "@/components/secondary/ayah/Ayah";
import Motion from "@/components/secondary/motion/Motion";
import { BiSolidQuoteAltLeft, BiSolidQuoteAltRight } from "react-icons/bi";

export default function Beta() {
  return (
    <div className={styles.container}>
      <Motion
        className={styles.left}
        initial={{ opacity: 0, x: -40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ amount: 0.8 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <Ayah
          arabicText="ﮭ ﮮ ﮯ ﮰ ﮱ ﯓ ﯔ"
          translation={
            <>
              Read your <strong>kitaab</strong>. You yourself are sufficient as your accountant today.
            </>
          }
          chapter={17}
          verse={14}
          className={styles.ayahCardWhite}
        />
      </Motion>
      <Motion
        className={styles.right}
        initial={{ opacity: 0, x: 40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ amount: 0.8 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
      >
        <BiSolidQuoteAltLeft aria-hidden="true" className={styles.quoteIconLeft} />
        <p>Every day, you make choices, but most go unrecorded. Without tracking them, improvement becomes unclear.</p>
        <p className={styles.margin}>
          Inspired by the concept of <i>Amaal Naama</i>, Book of Deeds, <strong>Kitaab</strong> is a personal deed tracking app that helps you track your deeds, reflect clearly, grow consistently, and improve every day.
        </p>
        <BiSolidQuoteAltRight aria-hidden="true" className={styles.quoteIconRight} />
      </Motion>
    </div>
  );
}