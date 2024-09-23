import React, { PureComponent } from 'react';
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer , PieChart, Pie} from 'recharts';

const data = [
  {
    name: 'Page A',
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: 'Page B',
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: 'Page C',
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: 'Page D',
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: 'Page E',
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: 'Page F',
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: 'Page G',
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];

export class MensualChart extends PureComponent {

  render() {
    return (
      <ResponsiveContainer width="50%" height="100%">
        <BarChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="pv" fill="#c13ffe" activeBar={<Rectangle fill="#be32ff" stroke="purple" />} />
          <Bar dataKey="uv" fill="#4b5563" activeBar={<Rectangle fill="#454d58" stroke="gray" />} />
        </BarChart>
      </ResponsiveContainer>
    );
  }
}

const date = [
    { name: 'Group A', value: 400 },
    { name: 'Group B', value: 300 },
    { name: 'Group C', value: 300 },
    { name: 'Group D1', value: 200 },
  ];
  
//   const COLORS = ['#c13ffe', '#a33bda', '#8d3dd9', '#7836b9', '#662e9e', '#552887', '#442170', '#381c5d', '#4c2880', '#5e3b99', '#734dba'];

  
  export class PieCharts extends PureComponent {

    render() {
        return (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart width={400} height={400}>
              <Pie
                dataKey="value"
                isAnimationActive={false}
                data={date}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#c13ffe"
                label
              />
              <Pie dataKey="value" data={date} cx={500} cy={200} innerRadius={40} outerRadius={80} fill="#82ca9d" />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        );
    }
  }

  
//   const RADIAN = Math.PI / 180;
//   const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
//     const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
//     const x = cx + radius * Math.cos(-midAngle * RADIAN);
//     const y = cy + radius * Math.sin(-midAngle * RADIAN);
  
//     return (
//       <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
//         {`${(percent * 100).toFixed(0)}%`}
//       </text>
//     );
//   };
//   export class PieCharts extends PureComponent {
  
//     render() {
//       return (
//         <ResponsiveContainer width="100%" height="100%">
//           <PieChart width={400} height={400}>
//             <Pie
//               data={date}
//               cx="50%"
//               cy="50%"
//               labelLine={false}
//               label={renderCustomizedLabel}
//               outerRadius={80}
//               fill="#8884d8"
//               dataKey="value"
//             >
//               {date.map((entry, index) => (
//                 <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//               ))}
//             </Pie>
//           </PieChart>
//         </ResponsiveContainer>
//       );
//     }
// }