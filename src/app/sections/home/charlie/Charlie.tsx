import styles from "./charlie.module.css";
import Ayah from "@/components/secondary/ayah/Ayah";
import Motion from "@/components/secondary/motion/Motion";
import Dictionary from "@/components/secondary/dictionary/Dictionary";
import { BiSolidQuoteAltLeft, BiSolidQuoteAltRight } from "react-icons/bi";

export default function LandingBeta() {
  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <Motion
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ amount: 0.8 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className={styles.card}
        >
          <Dictionary
            word="Hasanaat"
            pronunciation="/ha-sa-naat/"
            origin="Arabic"
            pluralOf="Hasanah"
            meaning="Good deeds; righteous or virtuous actions."
          />
        </Motion>
        <Motion
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ amount: 0.8 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          className={`${styles.card} ${styles.darkCard}`}
          reverse={true}
        >
          <Dictionary
            word="Sayyi'aat"
            pronunciation="/say-yi-aat/"
            origin="Arabic"
            pluralOf="Sayyi'ah"
            meaning="Bad deeds; sinful or wrongful actions."
            darkMode={true}
          />
        </Motion>
        <Motion
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ amount: 0.8 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          className={styles.card}
        >
          <div className={styles.cardContent}>
            <blockquote className={styles.quote}>
              <BiSolidQuoteAltLeft aria-hidden="true" className={styles.quoteIconLeft} />
              <p>With dedicated <i>Hasanaat</i> and <i>Sayyi'aat</i> sections, <strong>Kitaab</strong> doesn't limit you to tracking prayers only; you can record any kind of good or bad deeds.</p>
              <BiSolidQuoteAltRight aria-hidden="true" className={styles.quoteIconRight} />
            </blockquote>
          </div>
        </Motion>
      </div>
      <div className={styles.right}>
        <Motion
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ amount: 0.8 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className={styles.rightCard}
        >
          <Ayah
            arabicText="ﮱ ﯓ ﯔ ﯕ"
            translation="Indeed, good deeds remove bad deeds."
            chapter={11}
            verse={114}
            font="p234-v1"
          />
        </Motion>
      </div>
    </div>
  );
}
