##TODO

# GUARDAR CARRITO
# AGREGAR CAMPO USUARIO EN TRANSACCIONES
<!-- # NO PROCESA EL CARRITO SI NO HABIA UN CODIGO EN EL CAMPO CODIGO DE TIENDA -->
# AGREGAR EL FONDO AL INICIO DE TURNO TAMBIEN

## SI HAY OBJETOS EN EL CARRITO NO PODER RECUPERAR UNO PAUSADO
<!-- # CHECKPRICE FALTA LA FECHA -->

<!-- AGREGAR LA BASCULA A ENTRADAS/SALIDAS -->
<!-- ORDENAR EN INGRESOS/EGRESOS LA FECHA QUE SEA LO ULTIMO AGREGADO AL PRINCIPIO -->
<!-- AGREGAR REGISTROS A LA TABLA VENTAS -->
<!-- CUANDO SE DEBE ASGINAR UN PRECIO?  -->
<!-- AGREGAR OPCION DE MANTENER PRECIO ACTUAL AL DAR UNA ENTRADA -->
## REVISAR LOS DATOS DE LA BASE DE DATOS PARA VER SI CUADRAN CON LO QUE SE ESTA GRAFICANDO
## CAMBIAR LA OPCION DE RENDER EN PANEL, SI EL TOTALES. CONTIENE ERROR 
<!-- ## AL INICIAR LA TIENDA, SI NO HAY TURNO NO SE RENDERIZA, PERO SI HAY TURNO TIENES QUE REINICIAR LA PAIGNA PARA QUE RENDERIZE -->
<!-- ##que no deje ver el pdf al cerrar el turno, que sea un boton  navigate al settings/turnos, y que ahi pueda ver la lista de pdfs -->
<!-- ## cambiar el shift model y controller, que al cerrar el turno solo te regrese la informacion que se guarda en turnos, que el shift details se llame en la tabla de shift, ahi te de el pdf. -->
<!-- NO FUNCIONA LA NAVEGACION CON LAS FUNCTIONS KEYS (REF) -->
<!-- QUE CON EL ENTER BUSQUE EL PRODUCTO AL AGREGAR ENTRADAS/SALIDA -->
<!-- AGREGAR EN LA TALBA PRODUCTOS LAS UNIDADES EN STOCK = 124KG o 3U -->
EN LA TABLA VENTAS MENSUALES TENER UN BOTON GO, Y QUE ACTUALICE EL DASHBOARD A ESE MES
<!-- MANEJAR LAS CANCELACIONES -->
<!-- HACER FIN DE TURNO (CORTE DE CAJA, ETC) -->
<!-- DESHABILITAR EL EDITAR CANTIDAD EN PRODUCTOS DE KG -->
<!-- HABILITAR TENER UN 0 EN EL PRODUCT CANTIDAD -->
NO FUNCIONA LAZY, SUSPENSE EN INVENTARIO. (NI VA A JALAR)
<!-- (TIENDA.JSX) EL PRIMER ARTICULO DEL CARRITO DE COMPRAS AFECTA AL RESTO -->
<!-- LA CANTIDAD NO SE ACTUALIZA EN LA TABLA PERO SI EN EL CARRITO! -->
<!-- AL EDITAR UN PRODUCTO SE AGREGA MAL EL CODIGO -->
<!-- BUSCAR POR DESCRIPCION EN INGRESO/EGRESO -->
<!-- - 1. USAR PROPS PARA PASAR onDetails null para que no se muestre el ojo en tablas basicas -->
<!-- - 1. UNIDAD DE MEDIDA PARA PRODUCTO KG/UNIDAD -->
<!-- - 1. EL PRODUCTO PONGAS EL ID QUE PONGAS SIEMPRE DEVUELVE EL PRIMERO Y UNICO REGISTRO -->
<!-- - 1. PRIMER OPCION: BUSCAS EL PRODUCTO Y SE ABRE LA BASCULA O PARA PONER LAS UNIDADES -->
<!-- - 2. SEGUNDA OPCION: AGREGAS CON LISTA LOS PRODUCTOS -->
<!-- - 1. Hay que hacer un pos controller, ahi se hara primero una query a addEntry y otra a AddStock(productos) -->
<!-- - 2. Al crear categoria agregar una letra para el codigo -->
<!-- - 3. Que todo se agregue a la base de datos en minuscula, al pedir y usar en el front usar la clase 'capitalize' -->
<!-- - 4. Agregar boton cancelar en Entradas -->
<!-- - 5. Agregar validacion a los inputs (solo texto, solo letras, maximo 3 caracteres, etc).  -->
<!-- - 6. No poder borrar categoria si un producto la tiene. -->
<!-- - 7. Hacer onDelete y hadleEditing en RegistrarEntradas -->
<!-- - 8. Que no se pueda borrar un producto si tiene una categoria -->
<!-- AÑADIR EN EL DEELTEBYID QUE SE CLICKEE ESC AL TERMINAR PARA QUE SE CIERRE EL MODAL. -->