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



React.useEffect(()=>{
  if (localStorage.getItem('user')) {
    navigate('/tienda');
  }
},[])

  return (
    <div className="z-50  bg-background  w-screen h-screen absolute top-0 left-0">
     <div className="w-full h-full relative">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r via-yellow-300 from-red-600 to-emerald-600">
        </div>
        <div className="absolute backdrop-blur-sm flex w-full h-full items-center justify-center">
       <div>
        </div>
        <Card radius="sm" isBlurred className="max-w-[400px] w-[400px]">
          <CardHeader className="flex gap-3">
            <img
              alt="Fruteria taky"
              height={100}
              width={100}
              radius="sm"
              src={"FruteriaTaky.png"}
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
           <form autoComplete="false"  className="flex w-full flex-col items-center justify-center gap-2" onSubmit={(e)=>handleLogin(e)}>
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
    </div>
  );
}
