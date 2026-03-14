import styles from "./beta.module.css";
import Motion from "@/components/secondary/motion/Motion";
import { BiSolidQuoteAltLeft, BiSolidQuoteAltRight } from "react-icons/bi";

export default function Beta() {
  return (
    <div className={styles.container}>
      <Motion
        className={styles.left}
        initial={{ opacity: 0, x: -40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <p
          className={styles.ayah}
          data-font-scale="3"
          data-font="p283-v1"
        >
          ﮭ ﮮ ﮯ ﮰ ﮱ ﯓ ﯔ
        </p>
        <p className={styles.translation}>
          Read your <strong>kitaab</strong>. You yourself are sufficient as your accountant today.
        </p>
        <p className={styles.ayahReference}>Al Qur'an 17:14</p>
      </Motion>
      <Motion
        className={styles.right}
        initial={{ opacity: 0, x: 40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.8 }}
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