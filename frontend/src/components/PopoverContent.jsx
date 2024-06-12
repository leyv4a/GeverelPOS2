import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, } from '@nextui-org/react'
import React from 'react'

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
              <ModalHeader className="flex flex-col gap-1">Modal Title</ModalHeader>
              <ModalBody>
                <p> 
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Nullam pulvinar risus non risus hendrerit venenatis.
                  Pellentesque sit amet hendrerit risus, sed porttitor quam.
                </p>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Nullam pulvinar risus non risus hendrerit venenatis.
                  Pellentesque sit amet hendrerit risus, sed porttitor quam.
                </p>
                <p>
                  Magna exercitation reprehenderit magna aute tempor cupidatat consequat elit
                  dolor adipisicing. Mollit dolor eiusmod sunt ex incididunt cillum quis. 
                  Velit duis sit officia eiusmod Lorem aliqua enim laboris do dolor eiusmod. 
                  Et mollit incididunt nisi consectetur esse laborum eiusmod pariatur 
                  proident Lorem eiusmod et. Culpa deserunt nostrud ad veniam.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
                  Action
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
  )
}
