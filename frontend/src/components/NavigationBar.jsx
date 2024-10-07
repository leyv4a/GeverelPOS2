import React from 'react'
import {Navbar, NavbarBrand, NavbarContent, NavbarItem, Button} from "@nextui-org/react";
import {Link} from 'react-router-dom';
export default function NavigationBar({items, onSectionChange}) {

 const buttonRef = React.useRef(null);

  React.useEffect(() => {
    const handleKeyDown = (event) => {
        if (event.key === 'F7' ) {
          event.preventDefault(); // Previene la acción por defecto del F1
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
    className='  justify-start py-7 max-h-[4rem]'
    isBordered
>
    <NavbarContent className="sm:max-w-[70%] h-auto ">
     {items.map((item, key) => (
         <NavbarItem key={key}>
          <Link to={item.section}>
            <Button   tabIndex="-1" disableRipple color='foreground' className={` cursor-pointer ${item.isActive ? 'font-bold bg-[#f4f4f5] rounded-lg my-1' : ''}`}
            onPress={()=>onSectionChange(item.section)}
            ref={item.section === 'agregarProducto' ? buttonRef : null}>
              {item.name}
            </Button>
          </Link>
       </NavbarItem>
     ))}
    </NavbarContent>
  </Navbar>
  )
}
