"use client";

import { useEffect, useRef } from "react";
import { useAppSelector } from "@/store/hooks";
import { PrayerChartProps, PrayerFilter, PrayerStatus, PrayerData, PrayerType } from "./prayerchart.interface";

function mapFilterToPrayerType(filter: PrayerFilter): PrayerType | null {
  if (filter === "All") return null;
  if (filter === "Fajr") return "Fajar";
  return filter as PrayerType;
}

export default function PrayerChart({ filter }: PrayerChartProps) {
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
      const monthlyPrayerData = await fetch("/monthlyPrayer.json").then((res) => res.json());

      const Highcharts = (await import("highcharts")).default;
      await import("highcharts/modules/variable-pie");
      await import("highcharts/modules/exporting");
      await import("highcharts/modules/export-data");
      await import("highcharts/modules/accessibility");

      const statusCounts: Record<PrayerStatus, number> = {
        "prayed on time": 0,
        "prayed in time": 0,
        "prayed late": 0,
        "never prayed": 0,
      };

      const selectedPrayer = mapFilterToPrayerType(filter);

      monthlyPrayerData.days.forEach(
        (day: { day: number; prayers: Record<PrayerType, PrayerStatus> }) => {
          const prayersToCount: PrayerType[] =
            selectedPrayer !== null
              ? [selectedPrayer]
              : (Object.keys(day.prayers) as PrayerType[]);

          prayersToCount.forEach((prayer) => {
            const status = day.prayers[prayer] as PrayerStatus;
            statusCounts[status]++;
          });
        }
      );

      const chartData: PrayerData[] = [
        {
          name: "Prayed in Time",
          y: statusCounts["prayed in time"],
          z: 100,
        },
        {
          name: "Prayed on Time",
          y: statusCounts["prayed on time"],
          z: 100,
        },
        {
          name: "Prayed Late",
          y: statusCounts["prayed late"],
          z: 100,
        },
        {
          name: "Never Prayed",
          y: statusCounts["never prayed"],
          z: 100,
        },
      ];

      const container = chartContainerRef.current;
      if (container) {
        
        const containerHeight = container.offsetHeight;
        const borderRadius = Math.max(1, containerHeight * 0.02);
        const chartSize = isBelow710Ref.current ? "60%" : "100%";

        const chartOptions = {
        chart: {
          type: "variablepie",
          backgroundColor: "transparent",
          width: null,
          height: null,
        },
        title: {
          text: undefined,
        },
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
          headerFormat: '',
          pointFormatter: function(this: any) {
            const total = this.series.data.reduce((sum: number, point: any) => sum + point.y, 0);
            const percentage = total > 0 ? ((this.y / total) * 100).toFixed(1) : 0;
            return '<span style="color:' + this.color + '">\u25CF</span> <b>' + 
              this.name + '</b><br/>' +
              'Count: <b>' + this.y + '</b><br/>' +
              'Percentage (%): <b>' + percentage + '</b>';
          }
        },
        plotOptions: {
          variablepie: {
            size: chartSize,
            borderWidth: 4,
            borderColor: "#f8f9fa",
            borderRadius: borderRadius,
            dataLabels: {
              enabled: true,
              useHTML: true,
              format: '<span style="color: rgb(80, 80, 80);">{point.name}</span>',
              color: "rgb(80, 80, 80)",
              style: {
                textOverflow: "none",
                whiteSpace: "nowrap",
                color: "rgb(80, 80, 80)",
              },
              distance: 20,
              connectorPadding: 5,
              connectorWidth: 1,
            },
          },
        },
        series: [
          {
            minPointSize: 10,
            innerSize: "30%",
            zMin: 0,
            name: "prayers",
            data: chartData,
            borderColor: "#f8f9fa",
            colors: [
              "rgb(150, 150, 150)",
              "rgb(116, 116, 116)",
              "rgb(83, 83, 83)",
              "rgb(50, 50, 50)",
            ],
            dataLabels: {
              enabled: true,
              useHTML: true,
              format: '<span style="color: rgb(80, 80, 80);">{point.name}</span>',
              color: "rgb(80, 80, 80)",
              style: {
                textOverflow: "none",
                color: "rgb(80, 80, 80)",
              },
              distance: 20,
              connectorPadding: 5,
              connectorWidth: 1,
            },
          },
        ],
        credits: {
          enabled: false,
        },
        exporting: {
          enabled: false,
        },
        };
        chartInstanceRef.current = Highcharts.chart(container, chartOptions);
        
        setTimeout(() => {
          if (chartInstanceRef.current) {
            chartInstanceRef.current.reflow();
          }
        }, 0);
      }
    };

    loadHighcharts();

    const handleResize = () => {
      if (chartInstanceRef.current && chartContainerRef.current) {
        const containerHeight = chartContainerRef.current.offsetHeight;
        const borderRadius = Math.max(1, containerHeight * 0.02);
        const chartSize = isBelow710Ref.current ? "60%" : "100%";
        
        if (chartInstanceRef.current.options.plotOptions?.variablepie) {
          chartInstanceRef.current.options.plotOptions.variablepie.borderRadius = borderRadius;
          chartInstanceRef.current.options.plotOptions.variablepie.size = chartSize;
          
          if (chartInstanceRef.current.series && chartInstanceRef.current.series[0]) {
            chartInstanceRef.current.series[0].update({
              borderRadius: borderRadius,
            }, true);
          }
        }
        chartInstanceRef.current.reflow();
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [filter]);

  useEffect(() => {
    if (chartInstanceRef.current && chartContainerRef.current) {
      const containerHeight = chartContainerRef.current.offsetHeight;
      const borderRadius = Math.max(1, containerHeight * 0.02);
      const chartSize = isBelow710 ? "60%" : "100%";
      
      if (chartInstanceRef.current.options.plotOptions?.variablepie) {
        chartInstanceRef.current.options.plotOptions.variablepie.borderRadius = borderRadius;
        chartInstanceRef.current.options.plotOptions.variablepie.size = chartSize;
        
        if (chartInstanceRef.current.series && chartInstanceRef.current.series[0]) {
          chartInstanceRef.current.series[0].update({
            borderRadius: borderRadius,
          }, true);
        }
      }
      chartInstanceRef.current.reflow();
    }
  }, [isBelow710]);

  return (
    <div
      ref={chartContainerRef}
      style={{
        width: "100%",
        height: "100%",
        border: "1px solid #f8f9fa",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    />
  );
}
