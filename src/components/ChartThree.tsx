import { ApexOptions } from 'apexcharts';
import React, { useState } from 'react';
import ReactApexChart from 'react-apexcharts';

interface ChartThreeState {
  series: number[];
}

const options: ApexOptions = {
  chart: {
    type: 'donut',
  },
  colors: ['#CB3CFF', '#1A4CD3'],
  labels: ['iOS', 'Android'],
  legend: {
    show: false,
    position: 'bottom',
  },

  plotOptions: {
    pie: {
      donut: {
        size: '85%',
        background: 'transparent',
        labels: {
          show: true,
          name: {
            show: true,
            fontSize: '22px',
            fontFamily: 'Satoshi, sans-serif',
            color: undefined,
            offsetY: -10,
          },
          value: {
            show: true,
            fontSize: '16px',
            fontFamily: 'Satoshi, sans-serif',
            color: undefined,
            offsetY: 16,
            formatter: function (val) {
              return val + '%';
            },
          },
          total: {
            show: true,
            showAlways: true,
            label: 'Users by devices',
            fontSize: '16px',
            fontFamily: 'Satoshi, sans-serif',
            color: '#637381',
            formatter: function (w) {
              return w.globals.seriesTotals.reduce((a, b) => {
                return a + b;
              }, 0);
            },
          },
        },
      },
      startAngle: -90,
      endAngle: 90,
      // offsetY: 10
    },
  },
  dataLabels: {
    enabled: false,
  },
  responsive: [
    {
      breakpoint: 2600,
      options: {
        chart: {
          width: 380,
        },
      },
    },
    {
      breakpoint: 640,
      options: {
        chart: {
          width: 200,
        },
      },
    },
  ],
};

const ChartThree: React.FC = () => {
  const [state, setState] = useState<ChartThreeState>({
    series: [15624, 5546],
  });

  return (
    <div className="col-span-12 rounded-sm border border-strokedark bg-tertiary px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-5">
      <div className="mb-3 justify-between gap-4 sm:flex">
        <div>
          <h5 className="text-xl font-semibold text-white dark:text-white">
           Users by devices
          </h5>
        </div>
      </div>

      <div className="mb-2">
        <div id="chartThree" className="mx-auto flex justify-center">
          <ReactApexChart
            options={options}
            series={state.series}
            type="donut"
          />
        </div>
      </div>

      <div className="-mx-8 flex flex-wrap items-center justify-center gap-y-3">
        <div className="w-full px-8 sm:w-1/2">
          <div className="flex w-full items-center">
            <span className="mr-2 block h-3 w-full max-w-3 rounded-full bg-[#CB3CFF]"></span>
            <p className="flex w-full justify-between text-sm font-medium text-white dark:text-white">
              <span> iOS </span>
              <span> 15,624 </span>
            </p>
          </div>
        </div>
        <div className="w-full px-8 sm:w-1/2">
          <div className="flex w-full items-center">
            <span className="mr-2 block h-3 w-full max-w-3 rounded-full bg-[#1A4CD3]"></span>
            <p className="flex w-full justify-between text-sm font-medium text-white dark:text-white">
              <span> Android </span>
              <span> 5,546 </span>
            </p>
          </div>
        </div>
   
      </div>
    </div>
  );
};

export default ChartThree;
