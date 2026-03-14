"use client";

import Link from "next/link";
import { useAppSelector } from "@/store/hooks";
import styles from "./herorightportion.module.css";
import { useState, useEffect, useRef } from "react";
import { IoCaretDownOutline } from "react-icons/io5";
import LiesChart from "@/components/secondary/lieschart/LiesChart";
import ButtonGroup from "@/components/secondary/buttongroup/ButtonGroup";
import PrayerChart, { PrayerFilter } from "@/components/secondary/prayerchart/PrayerChart";

type PrayerLabel = PrayerFilter;

export default function HeroRightPortion() {
  const [slide, setSlide] = useState(true);
  const [fullWidth, setFullWidth] = useState(100);
  const [skipTimer, setSkipTimer] = useState(false);
  const rightButtonGroupRef = useRef<HTMLDivElement>(null);
  const isBelow710 = useAppSelector((state) => state.ui.isBelow710);
  const prayerDropdownShellRef = useRef<HTMLDivElement | null>(null);
  const [isPrayerDropdownOpen, setIsPrayerDropdownOpen] = useState(false);
  const [selectedPrayer, setSelectedPrayer] = useState<PrayerLabel>("All");
  const skipTimerRef = useRef(skipTimer);
  
  useEffect(() => {
    skipTimerRef.current = skipTimer;
  }, [skipTimer]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (skipTimerRef.current) return;
      setSlide((prev) => !prev);
      setIsPrayerDropdownOpen(false);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (isBelow710 && rightButtonGroupRef.current) {
        const groupWidth = rightButtonGroupRef.current.offsetWidth;
        const computed = (groupWidth - 64) / 2;
        setFullWidth(computed);
      } else {
        setFullWidth(100);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isBelow710]);

  const prayerButtonWidth = isBelow710 ? fullWidth : 100;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!isPrayerDropdownOpen) return;
      if (!prayerDropdownShellRef.current) return;
      if (prayerDropdownShellRef.current.contains(event.target as Node)) return;
      setIsPrayerDropdownOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isPrayerDropdownOpen]);

  return (
    <section
      className={styles.rightPortion}
      onMouseEnter={() => setSkipTimer(true)}
      onMouseLeave={() => setSkipTimer(false)}
      aria-label="Prayer tracking summary for the month"
      itemScope
      itemType="https://schema.org/WebPageElement"
    >
      <div className={styles.squareContainer}>
        <div className={styles.chartSliderContainer}>
          <div
            className={styles.chartSliderContent}
            style={{ "--chart-slider-left": slide ? "-100%" : "0%" } as React.CSSProperties}
          >
            <LiesChart />
            <PrayerChart filter={selectedPrayer} />
          </div>
        </div>
      </div>
      <div className={styles.bottomStrip}>
        <div className={styles.sliderShell} ref={prayerDropdownShellRef}>
          <div className={styles.sliderContainer}>
            <div
              className={styles.sliderContent}
              style={{ "--slider-left": slide ? "-100%" : "0%" } as React.CSSProperties}
            >
              <ButtonGroup
                buttonWidth={isBelow710 ? 2 * fullWidth + 12 : 212}
                buttonHeight={30}
                activeIndex={-1}
                fontSize={14}
              >
                <Link href="#">False Speaking</Link>
              </ButtonGroup>
              <ButtonGroup
                buttonWidth={prayerButtonWidth}
                buttonHeight={30}
                activeIndex={1}
                fontSize={14}
              >
                <Link href="">Namaz</Link>
                <Link 
                  href="" 
                  className={styles.prayerLink}
                  onClick={(e) => {
                    e.preventDefault();
                    setIsPrayerDropdownOpen((prev) => !prev);
                  }}
                >
                  {selectedPrayer}
                  <IoCaretDownOutline className={`${styles.prayerIcon} ${isPrayerDropdownOpen ? styles.prayerIconRotated : ""}`} />
                </Link>
              </ButtonGroup>
            </div>
          </div>
          {isPrayerDropdownOpen && (
            <div
              className={styles.prayerDropdown}
              style={{ width: prayerButtonWidth }}
            >
              {["All", "Fajr", "Zuhr", "Asr", "Maghrib", "Isha"].map((option) => (
                <button
                  key={option}
                  type="button"
                  className={styles.prayerDropdownItem}
                  onClick={() => {
                    setSelectedPrayer(option as PrayerLabel);
                    setIsPrayerDropdownOpen(false);
                  }}
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className={styles.sliderIndicator}>
          <div className={styles.sliderDotsContainer}>
            <div
              className={styles.sliderDot}
              style={{ "--dot-left": slide ? "0px" : "14px" } as React.CSSProperties}
            />
            <div className={styles.dotHoleFirst}></div>
            <button className={styles.dotBorderFirst} onClick={() => setSlide(true)}></button>
            <div className={styles.dotHoleSecond}></div>
            <button className={styles.dotBorderSecond} onClick={() => setSlide(false)}></button>
          </div>
        </div>
        <div ref={rightButtonGroupRef} className={styles.rightButtonGroup}>
          <ButtonGroup
            buttonWidth={isBelow710 ? fullWidth : 100}
            buttonHeight={30}
            activeIndex={slide ? 0 : 1}
            fontSize={14}
          >
            <button onClick={() => setSlide(true)}>Hasanaat</button>
            <button onClick={() => setSlide(false)}>Sayyiaat</button>
          </ButtonGroup>
        </div>
        <div className={styles.sliderIndicatorMob}>
          <div className={styles.sliderDotsContainer}>
            <div
              className={styles.sliderDot}
              style={{ "--dot-left": slide ? "0px" : "14px" } as React.CSSProperties}
            />
            <div className={styles.dotHoleFirst}></div>
            <button className={styles.dotBorderFirst} onClick={() => setSlide(true)}></button>
            <div className={styles.dotHoleSecond}></div>
            <button className={styles.dotBorderSecond} onClick={() => setSlide(false)}></button>
          </div>
        </div>
      </div>
    </section>
  );
}
