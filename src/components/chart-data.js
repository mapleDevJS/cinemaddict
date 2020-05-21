import ChartDataLabels from 'chartjs-plugin-datalabels';

export default class ChartData {
  constructor(moviesModel) {
    this._films = moviesModel.films;
  }

  getChartData() {
    const BAR_HEIGHT = 50;
    const chartData = this._getFilmsAmountByGenre(this._films);

    const genresCtx = this._getGenresCtx();
    genresCtx.height = BAR_HEIGHT * chartData.length;

    return (
      {
        plugins: [ChartDataLabels],
        type: `horizontalBar`,
        data: {
          labels: chartData.map((it) => it.genre),
          datasets: [{
            data: chartData.map((it) => it.count),
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
