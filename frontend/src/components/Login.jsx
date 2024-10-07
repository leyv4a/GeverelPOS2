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
import { useNavigate } from "react-router-dom";
export default function Login() {
  const [isVisible, setIsVisible] = React.useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [usuario, setUsuario] = React.useState('');
  const [contra, setContra] = React.useState('');

  const resetData = () => {
    setUsuario('');
    setContra('');
  }
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:3001/api/login", {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user: usuario, password: contra }),
      }).then((response) => response.json());
      if (!response.success) {
        throw new Error(response.error);
      }
        localStorage.setItem('user', JSON.stringify(response.user.usuario));
        localStorage.setItem('type', JSON.stringify(response.user.tipo));
        navigate('/tienda');
    } catch (error) {
      setErrorMessage(error.message)
    }finally{
      setIsLoading(false);
      resetData();
    }
  }

  const [imageSrc, setImageSrc] = React.useState('/background.png');
  const [textSrc, setTextSrc] = React.useState('¡Bienvenido!');

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

React.useEffect(()=>{
  if (localStorage.getItem('user')) {
    navigate('/tienda');
  }
},[])

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
           <form className="flex w-full flex-col items-center justify-center gap-2" onSubmit={(e)=>handleLogin(e)}>
           <h1 className="text-center -mt-2 mb-2 text-lg font-bold">
              Inicia sesion
            </h1>
            <h2 className="text-red-700 bg-red-100 w-full text-center rounded-md">{errorMessage}</h2>
            <Input
              startContent={<FaRegUserCircle />}
              type="text"
              value={usuario}
              onChange={(e)=>{setUsuario(e.target.value)}}
              placeholder="Ingresa tu usuario"
              variant="bordered"
              radius="sm"
              size="md"
            />
            <Input
            value={contra}
            onChange={(e)=>{setContra(e.target.value)}}
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
            <Button isLoading={isLoading} type="submit" className="w-full text-white font-bold " radius="sm" color="success" variant="solid" >Entrar</Button>
           </form>
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
