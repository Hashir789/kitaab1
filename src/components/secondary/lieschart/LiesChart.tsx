"use client";

import { useEffect, useRef } from "react";
import styles from "./lieschart.module.css";
import { useAppSelector } from "@/store/hooks";

interface LiesData {
  month: string;
  days: Array<{
    day: number;
    lies: number;
  }>;
}

const HEIGHT_DIVISOR_DESKTOP = 1.8;
const HEIGHT_DIVISOR_MOBILE = 1.5;

const calculateChartHeight = (containerWidth: number, isBelow710: boolean): number => {
  const heightDivisor = isBelow710 ? HEIGHT_DIVISOR_MOBILE : HEIGHT_DIVISOR_DESKTOP;
  const calculatedHeight = containerWidth / heightDivisor;
  return Math.min(calculatedHeight, 350);
};

const setupCustomAnimations = (Highcharts: any) => {
  const animateSVGPath = (svgElem: any, animation: any, callback?: () => void) => {
    const length = svgElem.element.getTotalLength();
    svgElem.attr({
      'stroke-dasharray': length,
      'stroke-dashoffset': length,
      opacity: 1
    });
    svgElem.animate({ 'stroke-dashoffset': 0 }, animation, callback);
  };

  Highcharts.seriesTypes.areaspline.prototype.animate = function (init: boolean) {
    if (!init) {
      animateSVGPath(this.graph, Highcharts.animObject(this.options.animation));
    }
  };

  Highcharts.addEvent(Highcharts.Axis, 'afterRender', function (this: any) {
    const animation = Highcharts.animObject(this.chart.renderer.globalAnimation);
    const initAttrs = { opacity: 0, rotation: -3, scaleY: 0.9 };
    const animateAttrs = { opacity: 1, rotation: 0, scaleY: 1 };

    this.axisGroup.attr(initAttrs).animate(animateAttrs, animation);

    const labelInit = this.horiz
      ? { opacity: 0, rotation: 3, scaleY: 0.5 }
      : { opacity: 0, rotation: 3, scaleX: -0.5 };
    const labelAnimate = this.horiz
      ? { opacity: 1, rotation: 0, scaleY: 1 }
      : { opacity: 1, rotation: 0, scaleX: 1 };

    this.labelGroup.attr(labelInit).animate(labelAnimate, animation);

    if (this.plotLinesAndBands) {
      this.plotLinesAndBands.forEach((plotLine: any) => {
        plotLine.label.attr({ opacity: 0 });
        animateSVGPath(
          plotLine.svgElem,
          Highcharts.animObject(plotLine.options.animation),
          () => plotLine.label.animate({ opacity: 1 })
        );
      });
    }
  });
};

export default function LiesChart() {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartInstanceRef = useRef<any>(null);
  const isBelow710 = useAppSelector((state) => state.ui.isBelow710);
  const isBelow710Ref = useRef(isBelow710);

  useEffect(() => {
    isBelow710Ref.current = isBelow710;
  }, [isBelow710]);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const loadHighcharts = async () => {
      const monthlyLiesData: LiesData = await fetch("/monthlyLies.json").then((res) => res.json());
      const Highcharts = (await import("highcharts")).default;
      await import("highcharts/modules/exporting");
      await import("highcharts/modules/export-data");
      await import("highcharts/modules/accessibility");

      const [year, month] = monthlyLiesData.month.split('-').map(Number);
      const firstDay = new Date(Date.UTC(year, month - 1, 1)).getTime();
      const lastDay = new Date(Date.UTC(year, month - 1, monthlyLiesData.days.length)).getTime();
      const nextMonth = month === 12 ? 1 : month + 1;
      const nextYear = month === 12 ? year + 1 : year;
      const nextMonthFirst = new Date(Date.UTC(nextYear, nextMonth - 1, 1)).getTime();
      
      const data = monthlyLiesData.days.map((day) => {
        const date = new Date(Date.UTC(year, month - 1, day.day));
        return [date.getTime(), day.lies];
      });

      const yAxisMax = Math.max(...monthlyLiesData.days.map((day) => day.lies)) + 2;
      const container = chartContainerRef.current!;
      const chartHeight = calculateChartHeight(container.offsetWidth, isBelow710Ref.current);

      setupCustomAnimations(Highcharts);

      chartInstanceRef.current = Highcharts.chart(container, {
        chart: {
          type: 'areaspline',
          backgroundColor: 'transparent',
          height: chartHeight,
          spacingTop: 100,
          spacingRight: 0,
          spacingBottom: 0,
          spacingLeft: 0
        },
        credits: { enabled: false },
        exporting: { enabled: false },
        title: { text: '' },
        subtitle: { text: '' },
        xAxis: {
          type: 'datetime' as const,
          min: firstDay,
          max: nextMonthFirst,
          labels: {
            formatter: function(this: any) {
              const date = new Date(this.value);
              const isCurrentMonth = date.getUTCMonth() === month - 1 && date.getUTCFullYear() === year;
              const isNextMonthFirst = date.getUTCDate() === 1 && 
                ((month === 12 && date.getUTCMonth() === 0 && date.getUTCFullYear() === year + 1) ||
                 (month < 12 && date.getUTCMonth() === month && date.getUTCFullYear() === year));
              
              if (isCurrentMonth || isNextMonthFirst) {
                return Highcharts.dateFormat('%e %b', this.value);
              }
              return '';
            },
            style: {
              fontFamily: '"Google Sans Flex", system-ui, sans-serif',
              fontSize: '12px',
              color: '#3c3c3c'
            }
          },
          tickPositioner: function(): number[] {
            const positions: number[] = [];
            const lastDay = monthlyLiesData.days.length;
            const tickDays = [2, 9, 16, 23];
            
            tickDays.forEach(day => {
              if (day <= lastDay) {
                const tickDate = new Date(Date.UTC(year, month - 1, day));
                positions.push(tickDate.getTime());
              }
            });
            
            const nextMonth = month === 12 ? 1 : month + 1;
            const nextYear = month === 12 ? year + 1 : year;
            const marchFirst = new Date(Date.UTC(nextYear, nextMonth - 1, 1));
            positions.push(marchFirst.getTime());
            
            return positions;
          },
          startOnTick: false,
          endOnTick: false,
          minPadding: 0,
          maxPadding: 0,
          gridLineColor: '#e6e6e6',
          lineColor: '#e6e6e6',
          tickColor: '#e6e6e6'
        },
        yAxis: {
          title: { text: '' },
          min: 0,
          max: yAxisMax,
          endOnTick: false,
          allowDecimals: false,
          labels: {
            style: {
              fontFamily: '"Google Sans Flex", system-ui, sans-serif',
              fontSize: '12px',
              color: '#3c3c3c'
            }
          },
          gridLineColor: '#e6e6e6'
        },
        legend: { enabled: false },
        tooltip: {
          backgroundColor: 'rgb(240, 240, 240)',
          borderColor: 'rgb(230, 230, 230)',
          borderRadius: 10,
          borderWidth: 1,
          shadow: {
            color: 'rgba(0, 0, 0, 0.12)',
            offsetX: 0,
            offsetY: 4,
            opacity: 1,
            width: 10
          },
          style: {
            fontFamily: '"Google Sans Flex", system-ui, sans-serif',
            fontSize: '14px',
            color: 'rgb(100, 100, 100)',
            fontWeight: '600'
          },
          pointFormatter: function(this: any) {
            return '<span style="color:#535353">\u25CF</span> <b>False Speakings</b><br/>' +
              'Count: <b>' + this.y + '</b><br/>';
          }
        },
        plotOptions: {
          areaspline: {
            animation: { duration: 1000 },
            marker: {
              enabled: false,
              lineColor: '#434343',
              fillColor: '#535353',
              states: {
                hover: {
                  enabled: true,
                  fillColor: '#535353',
                  lineColor: '#535353',
                  lineWidth: 2,
                  radius: 5
                }
              }
            },
            lineWidth: 2,
            lineColor: '#535353',
            fillColor: {
              linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
              stops: [
                [0, 'rgb(80, 80, 80)'],
                [0.5, 'rgb(160, 160, 160)'],
                [0.75, 'rgb(200, 200, 200)'],
                [1, 'rgba(240, 240, 240)']
              ]
            },
            states: {
              hover: { lineWidth: 2 }
            },
            threshold: null
          }
        },
        series: [{
          type: 'areaspline',
          name: 'Number of Lies',
          color: '#535353',
          data: data,
          animation: { duration: 1000 },
          turboThreshold: 0,
          marker: {
            lineColor: '#535353',
            fillColor: '#535353'
          }
        }]
      });

      setTimeout(() => chartInstanceRef.current?.reflow(), 0);
    };

    loadHighcharts();

    const handleResize = () => {
      if (!chartInstanceRef.current || !chartContainerRef.current) return;
      const newHeight = calculateChartHeight(chartContainerRef.current.offsetWidth, isBelow710Ref.current);
      if (chartInstanceRef.current.chartHeight !== newHeight) {
        chartInstanceRef.current.setSize(null, newHeight);
      }
      chartInstanceRef.current.reflow();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chartInstanceRef.current?.destroy();
    };
  }, []);

  useEffect(() => {
    if (!chartInstanceRef.current || !chartContainerRef.current) return;
    const newHeight = calculateChartHeight(chartContainerRef.current.offsetWidth, isBelow710);
    if (chartInstanceRef.current.chartHeight !== newHeight) {
      chartInstanceRef.current.setSize(null, newHeight);
    }
    chartInstanceRef.current.reflow();
  }, [isBelow710]);

  return <div ref={chartContainerRef} className={styles.chartContainer} />;
}
