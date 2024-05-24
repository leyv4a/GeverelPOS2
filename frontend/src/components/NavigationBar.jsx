import React from 'react'
import {Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button} from "@nextui-org/react";
export default function NavigationBar({items, onSectionChange, currentSection}) {

 const buttonRef = React.useRef(null);

  React.useEffect(() => {
    const handleKeyDown = (event) => {
        if (event.key === 'F7' ) {
          event.preventDefault(); // Previene la acción por defecto del F1
          console.log(`F2 pressed`); // Añade un log para verificar la captura
          if (buttonRef.current) {
            buttonRef.current.click();
          }
        }
      };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
    document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  return (
    <Navbar 
    isBordered>
    <NavbarContent className="hidden sm:flex gap-4 " justify="start">
     {items.map((item, key) => (
         <NavbarItem key={key}>
         <Link  color='foreground' className={`${currentSection === item.section ? 'font-bold ' : ''}`}
         onPress={()=>onSectionChange(item.section)}
         ref={item.section === 'agregarProducto' ? buttonRef : null}>
          {item.name}
         </Link>
       </NavbarItem>
     ))}
    </NavbarContent>
  </Navbar>
  )
}
