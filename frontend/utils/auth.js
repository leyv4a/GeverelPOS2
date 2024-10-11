import { toast } from "react-toastify";

export const isAuthenticated = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  };
  
  export const checkPermissions = (type) => {
    const user = isAuthenticated();
    if (!user || user.tipo >  type) {
      toast.info('No tienes permisos para realizar esta acción');
      return false;
    }
    return true;
  };

//   1- Puede hacer todo
// 2- Puede hacer todo lo de 3, y puede ver el dashboard, puede registrar entradas de dinero, puede reigstrar salidas de material, 
// 3 - Puede vender, registrar entradas de material, registrar salidas de dinero.