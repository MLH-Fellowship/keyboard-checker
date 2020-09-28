import { Line } from "react-chartjs-2";
import "chartjs-plugin-streaming";
import { useKeyTracker } from "../pages/index";
import { useRef } from "react";

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
    return (
        <div>
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
                height={500}
                data={{
                    datasets: [
                        {
                            borderColor: "rgb(255, 99, 132)",
                            backgroundColor: "rgba(255, 99, 132, 0.5)",
                        },
                    ],
                }}
                options={{
                    title: {
                        display: true,
                        text: "Keys pressed frequency time chart",
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
                                        chart.data.datasets.forEach(
                                            (dataset) => {
                                                const data = dataset.data;
                                                data.push({
                                                    x: Date.now(),
                                                    y: data.length == 0 ? 0 : data[data.length-1],
                                                });
                                            }
                                        );
                                    },

                                    delay: 0,
                                },
                                time: {
                                    unit: "millisecond",
                                },
                                gridLines: {
                                    drawOnChartArea: false,
                                },
                                scaleLabel: {
                                    display: true,
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
                                    drawOnChartArea: false,
                                },
                                scaleLabel: {
                                    display: true,
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
