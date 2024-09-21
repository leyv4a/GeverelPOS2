import React from 'react'
import {MensualChart, PieCharts} from '../components/Charts'
import {Card, CardHeader, CardBody} from "@nextui-org/card";

export default function Panel() {
  return (
    <div className='px-5 w-full min-h-screen h-screen my-auto flex flex-col items-center justify-center bg-slate-100'>
      <div className='w-full h-[10%] text-3xl flex items-center'>
        Registro Mensual 2024-09
      </div>
      <div className='w-full h-[20%] py-3 flex md:gap-8 gap-2'>
        <Chart text={'1234'} type={'cash'} head={'Ganancias brutas'}/> 
        <Chart text={'1234'} type={'cash'} head={'Ganancias totales'}/> 
        <Chart text={'1234'} type={'cash'} head={'Ganancias netas'}/> 
        <Chart text={'50'} type={'porcentaje'} head={'Margen'}/>
      </div>
      <div className='w-full h-[60%] flex gap-2'>
        <MensualChart/>
        <div className='w-[50%] h-full flex flex-col gap-2'>
          <div className='flex gap-2 h-[70%] w-full'>
            <div className='w-full h-full'><PieCharts/></div>
            <div className='w-full h-full'><PieCharts/></div>
          </div>
          <div className='w-full h-[30%]'>TOP</div>
        </div>
      </div>
      <div className='w-full h-[20%] bg-purple-500'>
        20
      </div>
    </div>
  )
}

const Chart = ({text, head, type}) => {
  const renderContent = () => {
    switch (type) {
      case 'porcentaje':
        return <p>{text}%</p>;
      case 'cash':
        return <p>${parseFloat(text).toFixed(2)}</p>;
      default:
        return <p>{text}</p>;
    }
  };

  return (
    <Card className='h-full w-[30%]'>
      <CardHeader className='w-full'>
        <h3 className='w-full text-center capitalize font-bold '>{head}</h3>
      </CardHeader>
      <CardBody>
        <div className='flex justify-center items-center w-full h-full'>
         {renderContent()}
        </div>
      </CardBody>
    </Card>
  )
}


