import styles from "./beta.module.css";
import Ayah from "@/components/secondary/ayah/Ayah";
import { homeBetaText } from "@/constants/placeholders";
import Motion from "@/components/secondary/motion/Motion";
import { BiSolidQuoteAltLeft, BiSolidQuoteAltRight } from "react-icons/bi";

export default function Beta() {
  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        <Motion
          className={styles.left}
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ amount: 0.8 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <Ayah
            arabicText={homeBetaText.AYAH_ARABIC}
            translation={
              <>
                {homeBetaText.AYAH_TRANSLATION_PREFIX}<strong>{homeBetaText.AYAH_TRANSLATION_KEYWORD}</strong>{homeBetaText.AYAH_TRANSLATION_SUFFIX}
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
          <p>{homeBetaText.QUOTE_INTRO}</p>
          <p className={styles.margin}>
            {homeBetaText.QUOTE_BODY_PREFIX}<i>{homeBetaText.QUOTE_BODY_CONCEPT}</i>{homeBetaText.QUOTE_BODY_MIDDLE}<strong>{homeBetaText.QUOTE_BODY_APP_NAME}</strong>{homeBetaText.QUOTE_BODY_SUFFIX}
          </p>
          <BiSolidQuoteAltRight aria-hidden="true" className={styles.quoteIconRight} />
        </Motion>
      </div>
    </div>
  );
}