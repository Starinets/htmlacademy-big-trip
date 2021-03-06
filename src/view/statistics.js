import Abstract from './abstract';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {getDatesDifference} from './../utils/date';
import {PointKind, PointType, pointKindToTypeMap} from './../constants';

const BAR_HEIGHT = 55;
const INCREMENT_TRANSPORT_VALUE = 1;
const CHART_BACKGROUND_COLOR = `#f2f2f2`;
const LEGEND_DISPLAY = false;
const TOOLTIPS_ENABLED = false;

const ChartOption = {
  MONEY: {
    text: `MONEY`,
    formatter: (value) => `€ ${value}`,
  },
  TRANSPORT: {
    text: `TRANSPORT`,
    formatter: (value) => `${value}x`,
  },
  TIME_SPEND: {
    text: `TIME SPEND`,
    formatter: (value) => `${getDatesDifference(0, value)}`,
  }
};

const ChartDataset = {
  BACKGROUND_COLOR: `#ffffff`,
  HOVER_BACKGROUND_COLOR: `#ffffff`,
  ANCHOR: `start`,
  BAR_THICKNESS: 50,
  MIN_BAR_LENGTH: 50,
};
const ChartDataLabel = {
  FONT_SIZE: 13,
  COLOR: `#000000`,
  ANCHOR: `end`,
  ALIGN: `start`,
};
const ChartTitle = {
  DISPLAY: true,
  FONT_COLOR: `#000000`,
  FONT_SIZE: 23,
  POSITION: `left`,
};
const chartScales = {
  yAxes: [{
    ticks: {
      fontColor: `#000000`,
      padding: 5,
      fontSize: 13,
    },
    gridLines: {
      display: false,
      drawBorder: false,
    },
  }],
  xAxes: [{
    ticks: {
      display: false,
      beginAtZero: true,
    },
    gridLines: {
      display: false,
      drawBorder: false,
    },
  }],
};

const pointTypeToChartLabel = {
  [PointType.TAXI]: `🚕 Taxi`,
  [PointType.BUS]: `🚌 Bus`,
  [PointType.TRAIN]: `🚂 Train`,
  [PointType.SHIP]: `🛳️ Ship`,
  [PointType.TRANSPORT]: `🚆 Transport`,
  [PointType.DRIVE]: `🚗 Drive`,
  [PointType.FLIGHT]: `✈️ Flight`,
  [PointType.CHECK_IN]: `🏨 Check in`,
  [PointType.SIGHTSEEING]: `🏛️ Sightseeing`,
  [PointType.RESTAURANT]: `🍴 Restaurant`,
};

const transportTypeSet = new Set(pointKindToTypeMap[PointKind.TRANSFER]);

const getPointTypePriceTotals = (points) => {
  const pointTypeTotalsMap = points.reduce((stats, point) => {
    const {type, price} = point;

    return Object.assign({}, stats, {
      [type]: {
        type,
        price: stats[type] ? stats[type].price + price : price,
      },
    });
  }, {});

  return Object.values(pointTypeTotalsMap);
};

const getPointTypeDurationTotals = (points) => {
  const pointTypeTotalsMap = points.reduce((stats, point) => {
    const {type, startTime, endTime} = point;

    const time = endTime - startTime;

    return Object.assign({}, stats, {
      [type]: {
        type,
        time: stats[type] ? stats[type].time + time : time,
      },
    });
  }, {});

  return Object.values(pointTypeTotalsMap);
};

const getPointTypeTransportTotals = (points) => {
  const pointTypeTotalsMap = points.reduce((stats, point) => {
    const {type} = point;
    const isTransportType = transportTypeSet.has(type);

    return isTransportType
      ? Object.assign({}, stats, {
        [type]: {
          type,
          totals: stats[type]
            ? stats[type].totals + INCREMENT_TRANSPORT_VALUE
            : INCREMENT_TRANSPORT_VALUE,
        },
      })
      : stats;
  }, {});

  return Object.values(pointTypeTotalsMap);
};

const getPointTypeLabels = (pointTypes) =>
  pointTypes.map((pointType) =>
    pointTypeToChartLabel[pointType].toUpperCase()
  );

const generateChart = (ctx, chartLabels, chartValues, options) => {
  const {text, formatter} = options;

  ctx.height = BAR_HEIGHT * chartLabels.length;

  return new Chart(
      ctx,
      {
        plugins: [ChartDataLabels],
        type: `horizontalBar`,
        data: {
          labels: chartLabels,
          datasets: [{
            data: chartValues,
            backgroundColor: ChartDataset.BACKGROUND_COLOR,
            hoverBackgroundColor: ChartDataset.HOVER_BACKGROUND_COLOR,
            anchor: ChartDataset.ANCHOR,
            barThickness: ChartDataset.BAR_THICKNESS,
            minBarLength: ChartDataset.MIN_BAR_LENGTH,
          }],
        },
        options: {
          plugins: {
            datalabels: {
              font: {
                size: ChartDataLabel.FONT_SIZE,
              },
              color: ChartDataLabel.COLOR,
              anchor: ChartDataLabel.ANCHOR,
              align: ChartDataLabel.ALIGN,
              formatter,
            },
          },
          title: {
            display: ChartTitle.DISPLAY,
            text,
            fontColor: ChartTitle.FONT_COLOR,
            fontSize: ChartTitle.FONT_SIZE,
            position: ChartTitle.POSITION,
          },
          scales: chartScales,
          legend: {
            display: LEGEND_DISPLAY,
          },
          tooltips: {
            enabled: TOOLTIPS_ENABLED,
          },
        },
      }
  );
};

const makeStatsSorter = (value) => (a, b) => b[value] - a[value];

const generateMoneyChart = (ctx, points) => {
  const pointTotals = getPointTypePriceTotals(points);
  const sortedTotals = pointTotals.sort(makeStatsSorter(`price`));
  const chartLabels = getPointTypeLabels(sortedTotals.map((total) => total.type));
  const chartValues = sortedTotals.map((total) => total.price);

  generateChart(ctx, chartLabels, chartValues, ChartOption.MONEY);
};

const generateTransportChart = (ctx, points) => {
  const pointTotals = getPointTypeTransportTotals(points);
  const sortedTotals = pointTotals.sort(makeStatsSorter(`totals`));
  const chartLabels = getPointTypeLabels(sortedTotals.map((total) => total.type));
  const chartValues = sortedTotals.map((total) => total.totals);

  generateChart(ctx, chartLabels, chartValues, ChartOption.TRANSPORT);
};

const generateTimeSpendChart = (ctx, points) => {
  const pointTotals = getPointTypeDurationTotals(points);
  const sortedTotals = pointTotals.sort(makeStatsSorter(`time`));
  const chartLabels = getPointTypeLabels(sortedTotals.map((total) => total.type));
  const chartValues = sortedTotals.map((total) => total.time);

  generateChart(ctx, chartLabels, chartValues, ChartOption.TIME_SPEND);
};


const createStatisticsTemplate = () => {
  return (
    `<section class="statistics">
      <h2 class="visually-hidden">Trip statistics</h2>

      <div class="statistics__item statistics__item--money">
        <canvas class="statistics__chart  statistics__chart--money" width="900"></canvas>
      </div>

      <div class="statistics__item statistics__item--transport">
        <canvas class="statistics__chart  statistics__chart--transport" width="900"></canvas>
      </div>

      <div class="statistics__item statistics__item--time-spend">
        <canvas class="statistics__chart  statistics__chart--time" width="900"></canvas>
      </div>
    </section>`
  );
};

export default class Statistics extends Abstract {
  constructor(points) {
    super();
    this._points = points;

    this._generate();
  }

  _getTemplate() {
    return createStatisticsTemplate();
  }

  _generate() {
    const element = this.getElement();

    const moneyChart = element.querySelector(`.statistics__chart--money`);
    const transportChart = element.querySelector(`.statistics__chart--transport`);
    const timeSpendChart = element.querySelector(`.statistics__chart--time`);

    moneyChart.style.backgroundColor = CHART_BACKGROUND_COLOR;
    transportChart.style.backgroundColor = CHART_BACKGROUND_COLOR;
    timeSpendChart.style.backgroundColor = CHART_BACKGROUND_COLOR;

    generateMoneyChart(moneyChart, this._points);
    generateTransportChart(transportChart, this._points);
    generateTimeSpendChart(timeSpendChart, this._points);
  }
}
