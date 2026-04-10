"use client";

import styles from "./datepicker.module.css";
import { FaRegCalendarAlt } from "react-icons/fa";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { BiChevronLeft, BiChevronRight, BiChevronsLeft, BiChevronsRight } from "react-icons/bi";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

type DatePickerProps = {
  id: string;
  label: string;
  value: string;
  maxDate?: Date;
  isError?: boolean;
  ariaLabel?: string;
  required?: boolean;
  helperText?: string;
  placeholder?: string;
  onChange: (value: string) => void;
};

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function formatDDMMYYYY(date: Date) {
  return `${pad2(date.getDate())}-${pad2(date.getMonth() + 1)}-${date.getFullYear()}`;
}

function parseDDMMYYYY(value: string): Date | null {
  const m = /^(\d{2})-(\d{2})-(\d{4})$/.exec(value.trim());
  if (!m) return null;
  const dd = Number(m[1]);
  const mm = Number(m[2]);
  const yyyy = Number(m[3]);
  if (!Number.isFinite(dd) || !Number.isFinite(mm) || !Number.isFinite(yyyy)) return null;
  const d = new Date(yyyy, mm - 1, dd);
  
  if (d.getFullYear() !== yyyy || d.getMonth() !== mm - 1 || d.getDate() !== dd) return null;
  return d;
}

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function daysInMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
}

function addMonths(d: Date, delta: number) {
  return new Date(d.getFullYear(), d.getMonth() + delta, 1);
}

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export default function DatePicker({
  id,
  label,
  required = false,
  value,
  onChange,
  helperText,
  isError = false,
  placeholder = "DD-MM-YYYY",
  ariaLabel,
  maxDate,
}: DatePickerProps) {
  const shellRef = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);
  const [yearMode, setYearMode] = useState(false);

  const selectedDate = useMemo(() => parseDDMMYYYY(value), [value]);
  const [viewMonth, setViewMonth] = useState<Date>(() => selectedDate ?? startOfMonth(new Date()));

  useEffect(() => {
    if (selectedDate) setViewMonth(startOfMonth(selectedDate));
  }, [selectedDate]);

  useIsomorphicLayoutEffect(() => {
    if (!open) return;
    setYearMode(false);
    if (selectedDate) setViewMonth(startOfMonth(selectedDate));
  }, [open, selectedDate]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!shellRef.current) return;
      if (shellRef.current.contains(e.target as Node)) return;
      setOpen(false);
      setYearMode(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  const monthStart = startOfMonth(viewMonth);
  const firstWeekday = monthStart.getDay();
  const totalDays = daysInMonth(viewMonth);
  const monthLabel = viewMonth.toLocaleString(undefined, { month: "long", year: "numeric" });
  const viewYear = viewMonth.getFullYear();
  const yearPanelStart = viewYear - 5;
  const yearPanelEnd = viewYear + 6;
  const yearPanelRangeLabel = `${yearPanelStart} \u2013 ${yearPanelEnd}`;

  const maxDay = useMemo(() => {
    if (!maxDate) return null;
    return startOfDay(maxDate);
  }, [maxDate]);

  const today = useMemo(() => startOfDay(new Date()), []);
  const todayDisabled = !!maxDay && today.getTime() > maxDay.getTime();

  const cells: Array<{ day: number | null; date: Date | null }> = [];
  for (let i = 0; i < firstWeekday; i++) cells.push({ day: null, date: null });
  for (let day = 1; day <= totalDays; day++) {
    const d = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), day);
    cells.push({ day, date: d });
  }
  while (cells.length % 7 !== 0) cells.push({ day: null, date: null });

  const isSelected = (d: Date) =>
    !!selectedDate &&
    d.getFullYear() === selectedDate.getFullYear() &&
    d.getMonth() === selectedDate.getMonth() &&
    d.getDate() === selectedDate.getDate();

  const selectedYear = selectedDate?.getFullYear() ?? null;
  const maxCalendarYear = maxDay?.getFullYear() ?? null;
  const yearModeForwardDisabled =
    maxCalendarYear !== null && yearPanelEnd >= maxCalendarYear;

  return (
    <div ref={shellRef} className={styles.field}>
      <div className={styles.topRow}>
        <label htmlFor={id} className={styles.label}>
          {label}
          {required ? <span className={styles.requiredMark}>*</span> : null}
        </label>
        {helperText ? (
          <span className={isError ? `${styles.helperText} ${styles.helperTextError}` : styles.helperText}>
            {helperText}
          </span>
        ) : (
          <span aria-hidden="true" />
        )}
      </div>

      <button
        id={id}
        type="button"
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label={ariaLabel ?? label}
        onClick={() => setOpen((o) => !o)}
        className={`${styles.trigger} ${isError ? styles.triggerError : ""}`}
      >
        <span className={!value ? styles.placeholder : undefined}>{value || placeholder}</span>
        <FaRegCalendarAlt className={styles.calendarIcon} aria-hidden="true" />
      </button>

      {open ? (
        <div className={styles.popover} role="dialog" aria-label={`${label} calendar`}>
          {yearMode ? (
            <div className={styles.header}>
              <div className={styles.navGroup}>
                <button
                  type="button"
                  className={styles.navBtn}
                  onClick={() => setViewMonth((m) => addMonths(m, -12 * 12))}
                  aria-label="Back 12 years"
                >
                  <BiChevronsLeft className={styles.navIcon} aria-hidden="true" />
                </button>
              </div>
              <button
                type="button"
                className={styles.monthLabelBtn}
                onClick={() => setYearMode(false)}
                aria-label={`Back to calendar, years ${yearPanelStart} to ${yearPanelEnd}`}
              >
                {yearPanelRangeLabel}
              </button>
              <div className={styles.navGroup}>
                <button
                  type="button"
                  className={`${styles.navBtn} ${yearModeForwardDisabled ? styles.disabled : ""}`}
                  disabled={yearModeForwardDisabled}
                  onClick={() => setViewMonth((m) => addMonths(m, 12 * 12))}
                  aria-label="Forward 12 years"
                >
                  <BiChevronsRight className={styles.navIcon} aria-hidden="true" />
                </button>
              </div>
            </div>
          ) : (
            <div className={styles.header}>
              <div className={styles.navGroup}>
                <button
                  type="button"
                  className={styles.navBtn}
                  onClick={() => setViewMonth((m) => addMonths(m, -12))}
                  aria-label="Previous year"
                >
                  <BiChevronsLeft className={styles.navIcon} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  className={styles.navBtn}
                  onClick={() => setViewMonth((m) => addMonths(m, -1))}
                  aria-label="Previous month"
                >
                  <BiChevronLeft className={styles.navIcon} aria-hidden="true" />
                </button>
              </div>
              <button
                type="button"
                className={styles.monthLabelBtn}
                onClick={() => setYearMode(true)}
                aria-label="Pick year"
              >
                {monthLabel}
              </button>
              <div className={styles.navGroup}>
                <button
                  type="button"
                  className={styles.navBtn}
                  onClick={() => setViewMonth((m) => addMonths(m, 1))}
                  aria-label="Next month"
                >
                  <BiChevronRight className={styles.navIcon} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  className={styles.navBtn}
                  onClick={() => setViewMonth((m) => addMonths(m, 12))}
                  aria-label="Next year"
                >
                  <BiChevronsRight className={styles.navIcon} aria-hidden="true" />
                </button>
              </div>
            </div>
          )}
          {yearMode ? (
            <div className={styles.yearPanel} aria-label="Year picker">
              <div className={styles.yearGrid}>
                {Array.from({ length: 12 }).map((_, i) => {
                  const y = yearPanelStart + i;
                  const isSelectedYear = selectedYear !== null && y === selectedYear;
                  const isDisabled =
                    maxCalendarYear !== null && y > maxCalendarYear;
                  const buttonDisabled = isDisabled && !isSelectedYear;
                  return (
                    <button
                      key={y}
                      type="button"
                      className={`${styles.yearBtn} ${isSelectedYear ? styles.yearBtnActive : ""} ${buttonDisabled ? styles.disabled : ""}`}
                      disabled={buttonDisabled}
                      onClick={() => {
                        setViewMonth(new Date(y, viewMonth.getMonth(), 1));
                        setYearMode(false);
                      }}
                    >
                      {y}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <>
              <div className={styles.weekRow} aria-hidden="true">
                {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((w) => (
                  <div key={w} className={styles.weekCell}>
                    {w}
                  </div>
                ))}
              </div>
              <div className={styles.grid}>
                {cells.map((c, idx) => {
                  if (!c.date) return <div key={idx} className={styles.cellEmpty} />;
                  const selected = isSelected(c.date);
                  const isDisabled = !!maxDay && c.date.getTime() > maxDay.getTime();
                  return (
                    <button
                      key={idx}
                      type="button"
                      className={`${styles.dayBtn} ${selected ? styles.daySelected : ""} ${isDisabled ? styles.disabled : ""}`}
                      disabled={isDisabled}
                      onClick={() => {
                        onChange(formatDDMMYYYY(c.date as Date));
                        setOpen(false);
                      }}
                    >
                      {c.day}
                    </button>
                  );
                })}
              </div>
              <div className={styles.footer}>
                <button
                  type="button"
                  className={`${styles.todayBtn} ${todayDisabled ? styles.disabled : ""}`}
                  disabled={todayDisabled}
                  onClick={() => {
                    onChange(formatDDMMYYYY(today));
                    setOpen(false);
                  }}
                >
                  Today
                </button>
              </div>
            </>
          )}
        </div>
      ) : null}
    </div>
  );
}