import { useState } from "react";
import { Button } from "./ui/button";
import { login, register } from "../services/AuthService";
import background from '../assets/logo.png'; // reemplaza con el nombre de tu imagen


export default function AuthForm({onLogin}) {
  const [isRegister, setIsRegister] = useState(false); // true = registro, false = login
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });

  const [errors, setErrors] = useState<any>({});

  const handleChange = (e: { target: { id: any; value: any; type: any; checked: any; }; }) => {
    const { id, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;

    setFormData({
      ...formData,
      [id]: val,
    });

    // Validación en tiempo real
    if (id === "password") {
      if (isRegister && value.length < 6) {
        setErrors((prev: any) => ({ ...prev, password: "La contraseña debe tener al menos 6 caracteres" }));
      } else {
        setErrors((prev: any) => ({ ...prev, password: null }));
      }

      if (isRegister && formData.confirmPassword && value !== formData.confirmPassword) {
        setErrors((prev: any) => ({ ...prev, confirmPassword: "Las contraseñas no coinciden" }));
      } else {
        setErrors((prev: any) => ({ ...prev, confirmPassword: null }));
      }
    }

    if (id === "confirmPassword") {
      if (isRegister && value !== formData.password) {
        setErrors((prev: any) => ({ ...prev, confirmPassword: "Las contraseñas no coinciden" }));
      } else {
        setErrors((prev: any) => ({ ...prev, confirmPassword: null }));
      }
    }

    if (id === "username" && value.trim() === "") {
      setErrors((prev: any) => ({ ...prev, username: "El nombre de usuario es obligatorio" }));
    } else if (id === "username") {
      setErrors((prev: any) => ({ ...prev, username: null }));
    }

    if (id === "terms") {
      if (!checked) {
        setErrors((prev: any) => ({ ...prev, terms: "Debes aceptar los términos y condiciones" }));
      } else {
        setErrors((prev: any) => ({ ...prev, terms: null }));
      }
    }
  };

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    setErrors("");

    try {
      if (isRegister) {
        if (formData.password !== formData.confirmPassword) {
          setErrors("Las contraseñas no coinciden");
          return;
        }
        try {
          await register(formData.username, formData.password);
          alert("Registro exitoso, ahora inicia sesión");
          setIsRegister(false);
          setFormData({ username: "", password: "", confirmPassword: "", terms: false });
        } catch (error: any) {
          alert(error);
        }
      } else {
        const data = await login(formData.username, formData.password);
        if (data) {
          localStorage.setItem("isLoggedIn", "true");
          // localStorage.setItem("token", data.token);
          onLogin();
        } else {
          setErrors(data.message || "Error en login");
        }
      }
    } catch (err: any) {
      setErrors(err.message || "Error del servidor");
    }

    const newErrors: any= {};
    if (!formData.username) newErrors.username = "El nombre de usuario es obligatorio";
    if (!formData.password || (isRegister && formData.password.length < 6)) newErrors.password = "La contraseña debe tener al menos 6 caracteres";

    if (isRegister) {
      if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Las contraseñas no coinciden";
      if (!formData.terms) newErrors.terms = "Debes aceptar los términos y condiciones";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (isRegister) {
      console.log("Registro válido:", formData);
    } else {
      console.log("Login válido:", formData.username, formData.password);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ backgroundImage: `url(${background})` }}>
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-0">
        <div className="w-full bg-form-auth rounded-lg shadow border-form md:mt-0 sm:max-w-md xl:p-0">
          <div className="p-6 space-y-6 md:space-y-6 sm:p-8">
            <p className="text-xl text-whitesmoke font-bold leading-tight tracking-tight text-center text-gray-900 md:text-2xl">
              {isRegister ? "Crear una cuenta" : "Iniciar sesión"}
            </p>

            <div>
              <label htmlFor="username" className="block text-whitesmoke mb-2 text-sm font-medium text-gray-900">
                Usuario
              </label>
              <input
                id="username"
                type="text"
                placeholder="JohnDoe"
                value={formData.username}
                onChange={handleChange}
                className={`text-whitesmoke border-form sm:text-sm rounded-lg block w-full p-1 ${
                  errors.username ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.username && <p className="text-whitesmoke text-sm mt-1">{errors.username}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block mb-2 text-sm text-whitesmoke font-medium text-gray-900">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className={`bg-gray-50 border-form sm:text-sm rounded-lg block w-full p-1 ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.password && <p className="text-whitesmoke text-sm mt-1">{errors.password}</p>}
            </div>

            {isRegister && (
              <>
                <div>
                  <label htmlFor="confirmPassword" className="block text-whitesmoke mb-2 text-sm font-medium text-gray-900">
                    Confirmar contraseña
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`bg-gray-50 border-form sm:text-sm rounded-lg block w-full p-1 ${
                      errors.confirmPassword ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.confirmPassword && <p className="text-whitesmoke text-sm mt-1">{errors.confirmPassword}</p>}
                </div>

                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="terms"
                      type="checkbox"
                      checked={formData.terms}
                      onChange={handleChange}
                      className={`w-4 h-4 border-form rounded ${
                        errors.terms ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="terms" className="font-light text-whitesmoke text-gray-500">
                      Acepto los{" "}
                      <a href="#" className="font-medium text-primary-600 hover:underline">
                        Términos y Condiciones
                      </a>
                    </label>
                  </div>
                </div>
                {errors.terms && <p className="text-whitesmoke text-sm mt-1">{errors.terms}</p>}
              </>
            )}
            <div className="text-center">
              <Button variant="buttonAdd" type="submit">
              {isRegister ? "Crear una cuenta" : "Iniciar sesión"}
              </Button>

            </div>

            <p className="text-sm text-gray-500 text-whitesmoke text-center mt-2">
              {isRegister ? "Ya tienes una cuenta?" : "No tienes una cuenta?"}{" "}
              <button
                type="button"
                onClick={() => setIsRegister(!isRegister)}
                className="text-primary-600 font-medium hover:underline"
              >
                {isRegister ? "Iniciar sesión" : "Registrarse"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </form>
  );
}
