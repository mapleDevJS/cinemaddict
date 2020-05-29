import ChartDataLabels from 'chartjs-plugin-datalabels';

const Color = {
  BACKGROUND: `#ffe800`,
  HOVER: `#ffe800`,
  FONT: `#ffffff`,
  LABEL: `#ffffff`
};

const Chart = {
  TYPE: `horizontalBar`,
  POSITION: `start`
};

const Size = {
  BAR: 24,
  OFFSET: 40,
  FONT: 20
};

const Axe = {
  PADDING: 100
};

export default class ChartData {
  static create(genres, moviesByGenres) {
    return (
      {
        plugins: [ChartDataLabels],
        type: Chart.TYPE,
        data: {
          labels: genres,
          datasets: [{
            data: moviesByGenres.map((it) => it.count),
            backgroundColor: Color.BACKGROUND,
            hoverBackgroundColor: Color.HOVER,
            anchor: Chart.POSITION,
            barThickness: Size.BAR
          }]
        },
        options: {
          plugins: {
            datalabels: {
              font: {
                size: Size.FONT
              },
              color: Color.LABEL,
              anchor: Chart.POSITION,
              align: Chart.POSITION,
              offset: Size.OFFSET,
            }
          },
          scales: {
            yAxes: [{
              ticks: {
                fontColor: Color.FONT,
                padding: Axe.PADDING,
                fontSize: Size.FONT
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
