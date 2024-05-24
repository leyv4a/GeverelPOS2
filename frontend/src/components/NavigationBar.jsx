import React from 'react'
import {Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button} from "@nextui-org/react";
export default function NavigationBar({items, onSectionChange, currentSection}) {
  return (
    <Navbar
    isBordered>
    <NavbarContent className="hidden sm:flex gap-4 " justify="start">
     {items.map((item, key) => (
         <NavbarItem key={key}>
         <Link color={currentSection == item.section ? 'primary' : 'foreground'} 
         onPress={()=>onSectionChange(item.section)}>
          {item.name}
         </Link>
       </NavbarItem>
     ))}
    </NavbarContent>
  </Navbar>
  )
}
