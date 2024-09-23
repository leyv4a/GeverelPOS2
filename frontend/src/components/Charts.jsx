import React, { PureComponent } from "react";
import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Label,
} from "recharts";

// const data = [
//   {
//     name: 'Page A',
//     uv: 4000,
//     amt: 2400,
//   },
//   {
//     name: 'Page B',
//     uv: 3000,
//     amt: 2210,
//   },
//   {
//     name: 'Page C',
//     uv: 2000,
//     amt: 2290,
//   },
//   {
//     name: 'Page D',
//     uv: 2780,
//     amt: 2000,
//   },
//   {
//     name: 'Page E',
//     uv: 1890,
//     amt: 2181,
//   },
//   {
//     name: 'Page F',
//     uv: 2390,
//     amt: 2500,
//   },
//   {
//     name: 'Page G',
//     uv: 3490,
//     amt: 2100,
//   },
// ];

export class MensualChart extends PureComponent {
  render() {
    const { data } = this.props;
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
          <XAxis dataKey="dia" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar
            dataKey="ventas"
            fill="#c13ffe"
            activeBar={<Rectangle fill="#be32ff" stroke="purple" />}
          />
          {/* <Bar dataKey="uv" fill="#4b5563" activeBar={<Rectangle fill="#454d58" stroke="gray" />} /> */}
        </BarChart>
      </ResponsiveContainer>
    );
  }
}


//   const COLORS = ['#c13ffe', '#a33bda', '#8d3dd9', '#7836b9', '#662e9e', '#552887', '#442170', '#381c5d', '#4c2880', '#5e3b99', '#734dba'];
const RADIAN = Math.PI / 180;
export class PieCharts extends PureComponent {
  renderLabel = ({ Producto, TotalVendidoMes }) => {
    // return `${Producto}: ${TotalVendidoMes.toFixed(2)}`; // Personaliza aquí la etiqueta
    return `${Producto.charAt(0).toUpperCase() +Producto.slice(1)}` // Personaliza aquí la etiqueta 
  };

  renderLabel2 = ({ cx, cy, midAngle, innerRadius, outerRadius, total_ventas, index }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${total_ventas}`}
    </text>
  );
};

  render() {
    const { data, data2 } = this.props;
    return (
      <ResponsiveContainer width="100%" height="100%">
          <h2 className="w-1/2 text-center text-2xl font-bold text-[#c13ffe] inline-block align-top">Productos mas vendidos</h2>
          <h2 className="w-1/2 text-center text-2xl font-bold text-[#c13ffe] inline-block align-top">Dias con mas ventas</h2>
        <PieChart width={400} height={400}>
          <Pie
            dataKey="TotalVendidoMes"
            data={data}
            cx="30%"
            cy="50%"
            outerRadius={80}
            fill="#c13ffe"
            label={this.renderLabel}
            legendType="square"
          />
          <Pie
            dataKey="total_ventas"
            data={data2}
            cx="70%"
            cy="50%"
            innerRadius={40}
            outerRadius={80}
            fill="#c13ffe"
            label={this.renderLabel2}
            labelLine={false} 
          />
          <Tooltip content={<CustomTooltip dataKey="TotalVendidoMes" />} cursor={{ fill: 'transparent' }} />
        </PieChart>
      </ResponsiveContainer>
    );
  }
}
const obtenerDia = (numero) =>{
  switch(numero){
      case 1:
          return "Lunes";
      case 2:
          return "Martes";
      case 3:
          return "Miercoles";
      case 4:
          return "Jueves";
      case 5:
          return "Viernes";
      case 6:
          return "Sabado";
      case 7:
          return "Domingo";
  }
}

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    let unidad = data.Unidad == 'kg' ? 'Kg' : '';
    if (data.Producto) {
      // Para el primer Pie
      return (
        <div style={{ backgroundColor: '#fff', padding: '10px', border: '1px solid #ccc' }}>
          <p>Producto: <span className="capitalize">{data.Producto }</span></p> 
          <p>Total Vendido: {data.TotalVendidoMes+ unidad }</p>
        </div>
      );
    } else if (data.dia_semana !== undefined) {
      // Para el segundo Pie
      return (
        <div style={{ backgroundColor: '#fff', padding: '10px', border: '1px solid #ccc' }}>
          <p>{`Dia : ${obtenerDia(parseFloat(data.dia_semana))}`}</p>
          <p>{`Ventas: ${data.total_ventas}`}</p>
        </div>
      );
    }
  }

  return null;
};

