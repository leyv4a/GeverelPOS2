import React from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, } from '@nextui-org/react'

export default function PasarelaPOS({isOpen, onOpenChange,unidad, handlePesar, handleCarritoAdd}) {

    const [peso, setPeso] = React.useState(0);

  if (unidad == 'kg') {
    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader className="flex flex-col gap-1">Este es el modal header</ModalHeader>
                  <ModalBody>
                    <Button onClick={()=> handlePesar(peso)}>
                        Pesar 
                    </Button>
                    <Button onClick={()=>{handleCarritoAdd(); onClose}}>
                        Confirmar
                    </Button>
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
  }else{
    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader className="flex flex-col gap-1">Este es el modal header</ModalHeader>
                  <ModalBody>
                    {/* <Button onClick={()=> handlePesar(peso)}>
                        Pesar
                    </Button> */}
                    <Input value={peso} onChange={e => {setPeso(e.target.value); handlePesar(e.target.value)}}/>
                    <Button onPress={()=>{handleCarritoAdd(); onClose(); setPeso(0)}}>
                        Confirmar
                    </Button>
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
  
}
