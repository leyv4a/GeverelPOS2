import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Link,
  Image,
  Input,
  Button
} from "@nextui-org/react";
import { FaRegUserCircle, FaEye, FaEyeSlash,FaKey  } from "react-icons/fa";
export default function Login() {
  const [isVisible, setIsVisible] = React.useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  const [imageSrc, setImageSrc] = React.useState('/background.png');
  const [textSrc, setTextSrc] = React.useState('¡Bienvenido!');
  const [isLoading, setIsLoading] = React.useState(false);

  const images = ['/background1.png', '/background2.png','/background3.png','/background4.png','/background5.png','/background.png'];
  const text = [ 'Controla tus inventario', 'Registra tus salidas', '¡Haz tu venta mas facil!', 'Audita cualquier movimiento', 'Controla tus gastos','¡Bienvenido!'];
  let imageIndex = 0;
  let textIndex = 0;

  React.useEffect(() => {
    const interval = setInterval(() => {
      imageIndex = (imageIndex + 1) % images.length; // Cambiar al siguiente src cada 1.5 segundos
      setImageSrc(images[imageIndex]);
    },900);

    return () => clearInterval(interval); // Limpiar el intervalo cuando el componente se desmonta
  }, []);
  
//   React.useEffect(() => {
//     const interval = setInterval(() => {
//         textIndex = (textIndex + 1) % text.length; // Cambiar al siguiente src cada 1.5 segundos
//       setTextSrc(text[imageIndex]);

//     },950);

//     return () => clearInterval(interval); // Limpiar el intervalo cuando el componente se desmonta
//   }, []);


//   const handleAnimationIteration = () => {
//     imageIndex = (imageIndex + 1) % images.length; // Cambiar al siguiente src
//     setImageSrc(images[imageIndex]);
//     setTextSrc(text[imageIndex]);
//   };

//   React.useEffect(() => {
//     const cardElement = document.getElementById('bounceCard');
//     cardElement.addEventListener('animationiteration', handleAnimationIteration);
    
//     return () => {
//       cardElement.removeEventListener('animationiteration', handleAnimationIteration);
//     };
//   }, []);

  return (
    <div className="z-50 bg-slate-100 w-screen h-screen absolute top-0 left-0">
      <div className="flex w-full h-full items-center justify-evenly">
       <div>
       <Card id="bounceCard" className='animate-bounce' radius='sm' isBlurred>
            <Image
            src={imageSrc}
            width={800}
            height={800}
            />
            </Card>
            {/* <h2 className="text-5xl font-bold text-center -mt-24">{textSrc}</h2> */}
        </div>
        <Card radius="sm" isBlurred className="max-w-[400px] w-[400px]">
          <CardHeader className="flex gap-3">
            <Image
              alt="Fruteria taky"
              height={100}
              width={100}
              radius="sm"
              src="/FruteriaTaky.png"
            />
            <div className="flex flex-col">
              <p className="text-md font-bold">Fruteria Taky </p>
              <p className="text-small text-default-500">
                Desarrollado por
                <a
                  className="text-blue-400 underline ms-1"
                  target="_blank"
                  href="https://geverel.com"
                >
                  Geverel Software
                </a>
              </p>
            </div>
          </CardHeader>
          <Divider />
          <CardBody className="flex flex-col items-center justify-center gap-2">
            <h1 className="text-center -mt-2 mb-2 text-lg font-bold">
              Inicia sesion
            </h1>
            <Input
              startContent={<FaRegUserCircle />}
              type="text"
              placeholder="Ingresa tu usuario"
              variant="bordered"
              radius="sm"
              size="md"
            />
            <Input
            startContent={<FaKey />}
              variant="bordered"
              placeholder="Ingresa tu contraseña"
               radius="sm"
              size="md"
              endContent={
                <button
                  className="focus:outline-none"
                  type="button"
                  onClick={toggleVisibility}
                  aria-label="toggle password visibility"
                >
                  {isVisible ? (
                    <FaEyeSlash className="text-2xl text-default-400 pointer-events-none" />
                  ) : (
                    <FaEye className="text-2xl text-default-400 pointer-events-none" />
                  )}
                </button>
              }
              type={isVisible ? "text" : "password"}
            />
            <Button isLoading className="w-full text-white font-bold " radius="sm" color="success" variant="solid" >Entrando...</Button>
          </CardBody>
          <Divider />
          <CardFooter>
            {/* <Link
                isExternal
                showAnchorIcon
                href="https://github.com/nextui-org/nextui"
                >
                Visit source code on GitHub.
                </Link> */}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
