import ChartDataLabels from 'chartjs-plugin-datalabels';

export default class ChartData {
  static create(genres, moviesByGenres) {
    return (
      {
        plugins: [ChartDataLabels],
        type: `horizontalBar`,
        data: {
          labels: genres,
          datasets: [{
            data: moviesByGenres.map((it) => it.count),
            backgroundColor: `#ffe800`,
            hoverBackgroundColor: `#ffe800`,
            anchor: `start`,
            barThickness: 24
          }]
        },
        options: {
          plugins: {
            datalabels: {
              font: {
                size: 20
              },
              color: `#ffffff`,
              anchor: `start`,
              align: `start`,
              offset: 40,
            }
          },
          scales: {
            yAxes: [{
              ticks: {
                fontColor: `#ffffff`,
                padding: 100,
                fontSize: 20
              },
              gridLines: {
                display: false,
                drawBorder: false
              },
            }],
            xAxes: [{
              ticks: {
                display: false,
                beginAtZero: true
              },
              gridLines: {
                display: false,
                drawBorder: false
              },
            }],
          },
          legend: {
            display: false
          },
          tooltips: {
            enabled: false
          }
        }
      }
    );
  }
}
