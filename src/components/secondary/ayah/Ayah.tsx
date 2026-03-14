import { ReactNode } from "react";
import styles from "./ayah.module.css";

interface AyahProps {
  verse: number;
  font?: string;
  chapter: number;
  arabicText: string;
  className?: string;
  translation: string | ReactNode;
}

export default function Ayah({
  verse,
  chapter,
  className,
  arabicText,
  translation,
  font = "p283-v1"
}: AyahProps) {
  const citationUrl = `https://quran.com/${chapter}/${verse}`;

  return (
    <section
      className={`${styles.ayahCard} ${className || ""}`}
      itemScope
      itemType="https://schema.org/Quotation"
      aria-labelledby="ayah-heading"
    >
      <blockquote
        className={styles.ayah}
        data-font-scale="3"
        data-font={font}
        lang="ar"
        dir="rtl"
        itemProp="text"
        cite={citationUrl}
        aria-label="Qur'anic verse in Arabic"
      >
        {arabicText}
      </blockquote>
      <p className={styles.translation} itemProp="translation">
        {translation}
      </p>
      <cite className={styles.ayahReference} itemProp="citation">
        <span itemProp="name">Al Qur'an</span>{" "}
        <span itemProp="chapterNumber">{chapter}</span>:
        <span itemProp="verseNumber">{verse}</span>
      </cite>
      <div itemProp="author" itemScope itemType="https://schema.org/Organization">
        <meta itemProp="name" content="Al Qur'an" />
      </div>
    </section>
  );
}
