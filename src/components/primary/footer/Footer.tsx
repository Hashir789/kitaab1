import Link from "next/link";
import Image from "next/image";
import styles from "./footer.module.css";
import Tooltip from "@/components/secondary/tooltip/Tooltip";
import { FaTwitter, FaFacebook, FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa";

export default function Footer() {
  const navigations = [
    { label: 'Home', link: '/' },
    { label: 'Features', link: '/features' },
    { label: 'About', link: '/about' },
    { label: 'Contact', link: '/contact' }
  ];
  const legal = [
    { label: 'Sitemap', link: '/' },
    { label: 'Privacy Policy', link: '/' },
    { label: 'Terms of Service', link: '/' },
    { label: 'Cookie Policy', link: '/' },
  ]
  return (
    <div className={styles.container}>
      <div className={styles.rowA}>
        <div className={styles.columnA}>
          <Tooltip text="Be Your Own Accountant" position="right">
            <Link
              href="/"
              className={styles.logo}
              aria-label="Kitaab Islamic Deed Tracker home"
              title="Kitaab – Islamic Deed Tracker Home"
              itemProp="url"
            >
              <Image
                src="/kitaab-logo.png"
                alt="Kitaab – Islamic Deed Tracker logo"
                width={180}
                height={60}
                className={styles.logo}
              />
            </Link>
          </Tooltip>
          <p>Inspired by the concept of <i>Amaal Naama</i>, Book of Deeds, <strong>Kitaab</strong> is a personal deed tracking app that helps you track your deeds, reflect clearly, grow consistently, and improve every day.</p>
        </div>
        <div className={styles.columnB}>
          <h3>Navigation</h3>
          <ul className={styles.navList}>
            {navigations.map((item, _) => (<li>
              <Link href={item.link} className={styles.navLink}>
                {item.label}
              </Link>
            </li>))}
          </ul>
        </div>
        <div className={styles.columnC}>
          <h3>Legal</h3>
          <ul className={styles.navList}>
            {legal.map((item, _) => (<li>
              <Link href={item.link} className={styles.navLink}>
                {item.label}
              </Link>
            </li>))}
          </ul>
        </div>
        <div className={styles.columnD}>
          <h3>Contact</h3>
          <div className={styles.contactInfo}>
            <p className={styles.contactItem}>
              <a href="mailto:support@kitaab.me" className={styles.contactLink}>
                support@kitaab.me
              </a>
            </p>
            <p className={styles.contactItem}>
              <a href="tel:+923338701145" className={styles.contactLink}>
                +92 333 8701145
              </a>
            </p>
          </div>
          <div className={styles.socialMedia}>
            <a
              href="https://twitter.com/kitaab"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
              aria-label="Follow us on Twitter"
            >
              <FaTwitter />
            </a>
            <a
              href="https://facebook.com/kitaab"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
              aria-label="Follow us on Facebook"
            >
              <FaFacebook />
            </a>
            <a
              href="https://instagram.com/kitaab"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
              aria-label="Follow us on Instagram"
            >
              <FaInstagram />
            </a>
            <a
              href="https://linkedin.com/company/kitaab"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
              aria-label="Follow us on LinkedIn"
            >
              <FaLinkedin />
            </a>
            <a
              href="https://youtube.com/@kitaab"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
              aria-label="Follow us on YouTube"
            >
              <FaYoutube />
            </a>
          </div>
        </div>
      </div>
      <div className={styles.copyright}>
        © {new Date().getFullYear()} Kitaab. All rights reserved.
      </div>
    </div>
  );
}
