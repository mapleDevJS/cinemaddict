import ChartDataLabels from 'chartjs-plugin-datalabels';

const Color = {
  BACKGROUND: `#ffe800`,
  HOVER: `#ffe800`,
  FONT: `#ffffff`,
  LABEL: `#ffffff`
};

const CHART = {
  TYPE: `horizontalBar`,
  POSITION: `start`
};

const SIZE = {
  BAR: 24,
  OFFSET: 40,
  FONT: 20
};

const AXE_PADDING = 100;

export default class ChartData {
  static create(genres, moviesByGenres) {
    return (
      {
        plugins: [ChartDataLabels],
        type: CHART.TYPE,
        data: {
          labels: genres,
          datasets: [{
            data: moviesByGenres.map((it) => it.count),
            backgroundColor: Color.BACKGROUND,
            hoverBackgroundColor: Color.HOVER,
            anchor: CHART.POSITION,
            barThickness: SIZE.BAR
          }]
        },
        options: {
          plugins: {
            datalabels: {
              font: {
                size: SIZE.FONT
              },
              color: Color.LABEL,
              anchor: CHART.POSITION,
              align: CHART.POSITION,
              offset: SIZE.OFFSET,
            }
          },
          scales: {
            yAxes: [{
              ticks: {
                fontColor: Color.FONT,
                padding: AXE_PADDING,
                fontSize: SIZE.FONT
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
