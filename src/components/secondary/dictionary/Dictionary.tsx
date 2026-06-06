import styles from "./dictionary.module.css";
import { DictionaryProps } from "./dictionary.interface";

export default function Dictionary({
  word,
  origin,
  meaning,
  pluralOf,
  className,
  pronunciation,
  darkMode = false,
}: DictionaryProps) {
  const wordId = `word-${word.toLowerCase().replace(/\s+/g, "-")}`;
  
  return (
    <article 
      className={`${styles.container} ${darkMode ? styles.darkMode : ""} ${className || ""}`}
      itemScope
      itemType="https://schema.org/DefinedTerm"
      aria-labelledby={wordId}
    >
      <h2 id={wordId} className={styles.word} itemProp="name">
        {word}
      </h2>
      
      <div className={styles.entriesContainer}>
        {pronunciation && (
          <div className={styles.entry}>
            <span className={styles.label}>Pronunciation</span>
            <span 
              className={`${styles.value} ${styles.pronunciationValue}`}
              itemProp="pronunciation"
            >
              {pronunciation}
            </span>
          </div>
        )}
        
        {origin && (
          <div className={styles.entry}>
            <span className={styles.label}>Origin</span>
            <span className={styles.value} itemProp="inDefinedTermSet" itemScope itemType="https://schema.org/DefinedTermSet">
              <meta itemProp="name" content={origin} />
              <span>{origin}</span>
            </span>
          </div>
        )}
        
        {pluralOf && (
          <div className={styles.entry}>
            <span className={styles.label}>Plural of</span>
            <span className={styles.value} itemProp="relatedTerm">
              {pluralOf}
            </span>
          </div>
        )}
        
        <div className={styles.entry}>
          <span className={styles.label}>Meaning</span>
          <div className={styles.meaning} itemProp="description">
            {meaning}
          </div>
        </div>
      </div>
      
      <meta itemProp="termCode" content={word} />
      {origin && <meta itemProp="inLanguage" content={origin === "Arabic" ? "ar" : "en"} />}
    </article>
  );
}
