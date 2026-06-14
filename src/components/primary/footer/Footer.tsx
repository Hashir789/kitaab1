import Link from "next/link";
import Image from "next/image";
import styles from "./footer.module.css";
import Tooltip from "@/components/secondary/tooltip/Tooltip";
import { footerLegalItems, footerNavigationItems, footerSocialAria, footerText } from "@/constants/placeholders";
import { FaTwitter, FaFacebook, FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa";

export default function Footer() {
  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        <div className={styles.rowA}>
          <div className={styles.columnA}>
            <Tooltip text={footerText.TOOLTIP} position="right">
              <Link
                href="/"
                className={styles.logo}
                aria-label={footerText.LOGO_ARIA}
                title={footerText.LOGO_TITLE}
                itemProp="url"
              >
                <Image
                  src="/kitaab-logo.png"
                  alt={footerText.LOGO_ALT}
                  width={180}
                  height={60}
                  className={styles.logo}
                />
              </Link>
            </Tooltip>
            <p>{footerText.DESCRIPTION_PREFIX}<i>{footerText.DESCRIPTION_CONCEPT}</i>{footerText.DESCRIPTION_MIDDLE}<strong>{footerText.DESCRIPTION_APP_NAME}</strong>{footerText.DESCRIPTION_SUFFIX}</p>
          </div>
          <div className={styles.columnB}>
            <h3>{footerText.NAVIGATION}</h3>
            <ul className={styles.navList}>
              {footerNavigationItems.map((item) => (<li key={item.label}>
                <Link href={item.link} className={styles.navLink}>
                  {item.label}
                </Link>
              </li>))}
            </ul>
          </div>
          <div className={styles.columnC}>
            <h3>{footerText.LEGAL}</h3>
            <ul className={styles.navList}>
              {footerLegalItems.map((item) => (<li key={item.label}>
                <Link href={item.link} className={styles.navLink}>
                  {item.label}
                </Link>
              </li>))}
            </ul>
          </div>
          <div className={styles.columnD}>
            <h3>{footerText.CONTACT}</h3>
            <div className={styles.contactInfo}>
              <p className={styles.contactItem}>
                <a href="mailto:support@kitaab.me" className={styles.contactLink}>
                  {footerText.EMAIL}
                </a>
              </p>
              <p className={styles.contactItem}>
                <a href="tel:+923338701145" className={styles.contactLink}>
                  {footerText.PHONE}
                </a>
              </p>
            </div>
            <div className={styles.socialMedia}>
              <a
                href="https://twitter.com/kitaab"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
                aria-label={footerSocialAria.TWITTER}
              >
                <FaTwitter />
              </a>
              <a
                href="https://facebook.com/kitaab"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
                aria-label={footerSocialAria.FACEBOOK}
              >
                <FaFacebook />
              </a>
              <a
                href="https://instagram.com/kitaab"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
                aria-label={footerSocialAria.INSTAGRAM}
              >
                <FaInstagram />
              </a>
              <a
                href="https://linkedin.com/company/kitaab"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
                aria-label={footerSocialAria.LINKEDIN}
              >
                <FaLinkedin />
              </a>
              <a
                href="https://youtube.com/@kitaab"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
                aria-label={footerSocialAria.YOUTUBE}
              >
                <FaYoutube />
              </a>
            </div>
          </div>
        </div>
        <div className={styles.copyright}>
          © {new Date().getFullYear()}{footerText.COPYRIGHT_SUFFIX}
        </div>
      </div>
    </div>
  );
}
