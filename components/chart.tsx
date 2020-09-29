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
        padding: "10px",
      }}
    >
      <Update
        onUpdate={(n: number) => {
          if (chart.current !== null) {
            chart.current.chartInstance.data.datasets[0].data.push({
              x: Date.now(),
              y: n,
            });
            // chart.current.chartInstance.update({
            //   preservation: true,
            // });
          }
        }}
      ></Update>
      <Line
        ref={chart}
        width={500}
        height={250}
        data={{
          datasets: [
            {
              backgroundColor: theme.button,
              borderColor: theme.chartBorder,
            },
          ],
        }}
        options={{
          animation: {
            duration: 0, // general animation time
          },
          hover: {
            animationDuration: 0, // duration of animations when hovering an item
          },
          responsiveAnimationDuration: 0, // animation duration after a resize
          title: {
            display: false,
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

                  refresh: 100,
                  delay: 100,
                  duration: 4000,
                  frameRate: 30,
                },
                display: false,
              },
            ],
            yAxes: [
              {
                display: false,
                ticks: {
                  display: false,
                  min: -1,
                  max: 8,
                  stepSize: 1.0,
                },
              },
            ],
          },
        }}
      />
    </div>
  );
}
