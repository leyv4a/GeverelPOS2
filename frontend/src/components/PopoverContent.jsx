import { Button, PopoverContent } from '@nextui-org/react'
import React from 'react'

export default function ContentPopOver({name, id, onDelete}) {
  return (
    <PopoverContent className="w-[240px] flex flex-col p-5 justify-center items-center gap-5">
        <p className='text-center'>
        ¿Estas seguro que deseas eliminar el objeto <em className='font-bold'>{name}</em>? 
        </p>
       <div className='flex gap-2'>
       <Button className='font-bold' color='danger' size='sm' onClick={()=> onDelete(id)}>Si</Button>
       {/* <Button color='primary' size='sm'>No</Button> */}
       </div>
    </PopoverContent>
  )
}
