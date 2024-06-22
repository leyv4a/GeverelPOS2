import React from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, } from '@nextui-org/react'

export default function PasarelaPOS({isOpen, onOpenChange, handlePesar, handleCarritoAdd}) {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Este es el modal header</ModalHeader>
              <ModalBody>
                PESAR
              </ModalBody>
              {/* <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancelar
                </Button>
                <Button color="primary" >
                  Confirmar
                </Button>
              </ModalFooter> */}
            </>
          )}
        </ModalContent>
      </Modal>  
  )
}
