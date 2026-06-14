import styles from "./charlie.module.css";
import Ayah from "@/components/secondary/ayah/Ayah";
import Motion from "@/components/secondary/motion/Motion";
import { homeCharlieText } from "@/constants/placeholders";
import Dictionary from "@/components/secondary/dictionary/Dictionary";
import { BiSolidQuoteAltLeft, BiSolidQuoteAltRight } from "react-icons/bi";

export default function LandingBeta() {
  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        <div className={styles.left}>
          <Motion
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ amount: 0.8 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className={styles.card}
          >
            <Dictionary
              word={homeCharlieText.HASANAAT}
              pronunciation={homeCharlieText.HASANAAT_PRONUNCIATION}
              origin={homeCharlieText.DICTIONARY_ORIGIN}
              pluralOf={homeCharlieText.HASANAAT_PLURAL_OF}
              meaning={homeCharlieText.HASANAAT_MEANING}
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
              word={homeCharlieText.SAYYIAAT}
              pronunciation={homeCharlieText.SAYYIAAT_PRONUNCIATION}
              origin={homeCharlieText.DICTIONARY_ORIGIN}
              pluralOf={homeCharlieText.SAYYIAAT_PLURAL_OF}
              meaning={homeCharlieText.SAYYIAAT_MEANING}
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
                <p>{homeCharlieText.QUOTE_PREFIX}<i>{homeCharlieText.HASANAAT}</i>{homeCharlieText.QUOTE_MIDDLE}<i>{homeCharlieText.SAYYIAAT}</i>{homeCharlieText.QUOTE_AFTER_SECTIONS}<strong>{homeCharlieText.QUOTE_APP_NAME}</strong>{homeCharlieText.QUOTE_SUFFIX}</p>
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
              arabicText={homeCharlieText.AYAH_ARABIC}
              translation={homeCharlieText.AYAH_TRANSLATION}
              chapter={11}
              verse={114}
              font="p234-v1"
            />
          </Motion>
        </div>
      </div>
    </div>
  );
}
