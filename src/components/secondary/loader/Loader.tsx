import styles from "./loader.module.css";
import type { LoaderProps } from "./loader.interface";

export default function Loader({ className, helperText, style }: LoaderProps) {
  return (
    <div
      className={`${styles.loader} ${className ?? ""}`}
      style={style}
      role={helperText ? "status" : undefined}
      aria-live={helperText ? "polite" : undefined}
    >
      <span className={styles.spinner} aria-hidden="true" />
      {helperText ? <p className={styles.helperText}>{helperText}</p> : null}
    </div>
  );
}