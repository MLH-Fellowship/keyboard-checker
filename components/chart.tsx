import { Line } from "react-chartjs-2";
import "chartjs-plugin-streaming";
import { useKeyTracker } from "../pages/index";
import { useRef, useContext } from "react";
import { ThemeContext } from "../util/theme";

interface UpdateProps {
  onUpdate: (n: number) => void;
}
function Update({ onUpdate }: UpdateProps) {
  const kt = useKeyTracker();
  onUpdate(kt.isPressed.size);
  return <div />;
}

export default function Chart() {
  const chart = useRef<any>(null);
  const theme = useContext(ThemeContext);
  return (
    <div
      style={{
        width: "50%",
      }}
    >
      <Update
        onUpdate={(n: number) => {
          if (chart.current !== null) {
            console.log(chart.current);
            chart.current.chartInstance.data.datasets[0].data.push({
              x: Date.now(),
              y: n,
            });
            // chart.current.chartInstance.update({
            //     preservation: true,
            // });
          }
        }}
      ></Update>
      <Line
        ref={chart}
        width={1000}
        height={800}
        data={{
          datasets: [
            {
              backgroundColor: theme.button,
              borderColor: theme.chartBorder,
            },
          ],
        }}
        options={{
          title: {
            display: true,
            text: "Key Tracker Time Chart",
            fontColor: theme.headline,
            fontSize: 20,
            fontStyle: "bold",
          },
          legend: {
            display: false,
          },
          scales: {
            xAxes: [
              {
                type: "realtime",
                realtime: {
                  onRefresh: (chart) => {
                    chart.data.datasets.forEach((dataset) => {
                      const data = dataset.data;
                      data.push({
                        x: Date.now(),
                        y: data.length == 0 ? 0 : data[data.length - 1],
                      });
                    });
                  },

                  delay: 0,
                },
                time: {
                  unit: "millisecond",
                },
                ticks: {
                  fontColor: theme.background, // A hack to hide x-axis labels, by setting them to background color.
                  fontSize: 4,
                },
                gridLines: {
                  color: theme.headline,
                  drawOnChartArea: false,
                  drawTicks: false,
                },
                scaleLabel: {
                  display: true,
                  fontColor: theme.headline,
                  fontSize: 16,
                  labelString: "time",
                },
              },
            ],
            yAxes: [
              {
                ticks: {
                  display: false,
                  min: 0,
                  max: 7,
                  stepSize: 1.0,
                },
                gridLines: {
                  color: theme.headline,
                  drawOnChartArea: false,
                },
                scaleLabel: {
                  display: true,
                  fontColor: theme.headline,
                  fontSize: 16,
                  labelString: "# of buttons pressed",
                },
              },
            ],
          },
        }}
      />
    </div>
  );
}
