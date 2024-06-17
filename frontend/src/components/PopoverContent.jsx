import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, } from '@nextui-org/react'
import React from 'react'
import { FaTrash } from "react-icons/fa";

export default function ContentPopOver({isOpen, onOpenChange, name, id, onDelete}) {
  return (
    // <PopoverContent className="w-[240px] flex flex-col p-5 justify-center items-center gap-5">
    //     <p className='text-center'>
    //     ¿Estas seguro que deseas eliminar el objeto <em className='font-bold'>{name}</em>? 
    //     </p>
    //    <div className='flex gap-2'>
    //    <Button className='font-bold' color='danger' size='sm' onClick={()=> onDelete(id)}>Si</Button>
    //    {/* <Button color='primary' size='sm'>No</Button> */}
    //    </div>
    // </PopoverContent>
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1"><FaTrash/></ModalHeader>
              <ModalBody>
                <p className='text-center'> 
                ¿Estas seguro que deseas eliminar el objeto <em className='font-bold'>{name}</em>? 
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancelar
                </Button>
                <Button color="primary" onPress={()=>{try {
                  onDelete(id)
                } catch (error) {
                  console.log(error.message)
                }finally{
                  onClose();
                }}}>
                  Eliminar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>  
  )
}
