import React, { useState , useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
      labels: {
        boxWidth: 50,
        color: 'white',
        font : {weight : 'bold'}
      }
    },
    title: {
      display: true,
      font : {weight: 'bold' , size: 14},
      color: '#FFFFFF'
    },
  },
  scales: {
      yAxes:{
          ticks:{
              color: 'white',
              fontSize: 12,
              font: {
                weight: 'bold'
              }
          }
      },
      xAxes: {
          ticks:{
              color: 'white',
              fontSize: 12,
              font: {
                weight: 'bold'
              }
          }
      },
  }
};





const BarChart = (props) => {
    const [data , setData] = useState({labels: '' , datasets:[]})
    useEffect(()=>{
      if(props.stat){
        setData({labels: props.stat.data.x , datasets: [{ label: props.stat.heading, data:props.stat.data.y , borderWidth: 3 , borderColor: 'rgb(216,0,12)',backgroundColor: 'rgba(255, 99, 132, 0.5)',width:'4px', }]   } )
      }
    },[props.stat])

    
  return <Line options={options} data={data}   />;
}

export default BarChart