import { Line } from "react-chartjs-2";
import "chartjs-plugin-streaming";

export default function Chart() {

    return (
        <Line
            data={{
                datasets: [
                    {
                        label: "Dataset 1",

                        borderColor: "rgb(255, 99, 132)",

                        backgroundColor: "rgba(255, 99, 132, 0.5)",

                        lineTension: 0,

                        borderDash: [8, 4],
                    },
                    {
                        label: "Dataset 2",

                        borderColor: "rgb(54, 162, 235)",

                        backgroundColor: "rgba(54, 162, 235, 0.5)",
                    },
                ],
            }}
            options={{
                scales: {
                    xAxes: [
                        {
                            realtime: {
                                onRefresh: (chart) => {
                                    chart.data.datasets.forEach((dataset) => {
                                        dataset.data.push({
                                            x: Date.now(),
                                            y: Math.random(),
                                        });
                                    });
                                },

                                delay: 2000,
                            },
                        },
                    ],
                },
            }}
        />
    );
}
