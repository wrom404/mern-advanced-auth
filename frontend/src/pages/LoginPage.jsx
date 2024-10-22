import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Loader } from "lucide-react";
import Input from "../components/Input";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading, error } = useAuthStore();

  const handleLogin = async (e) => {
    e.preventDefault();
    await login(email, password);
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className='max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden'
      // className="max-w-md w-full overflow-hidden border border-slate-700 p-8 rounded-xl"
    >
      <div className="p-8">
        <h2 className="text-3xl text-slate-200 font-bold mb-6 text-center">
          Login
        </h2>
        <form onSubmit={handleLogin}>
          <Input
            icon={Mail}
            placeholder={"Email Address"}
            type={"email"}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            icon={Lock}
            placeholder={"Password"}
            type={"password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="flex items-center mb-6">
            <Link
              to={"/forgot-password"}
              className="text-sm hover:underline hover:text-blue-500 text-blue-600"
            >
              Forgot password?
            </Link>
          </div>

          {error && <p className="text-red-500 font-semibold mb-2">{error}</p>}

          <motion.button
            className="mt-5 w-full py-3 px-4 text-slate-200 font-bold rounded-lg cursor-pointer border border-slate-700 bg-blue-700 hover:bg-blue-600"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="submit"
          >
            {isLoading ? (
              <Loader className="size-6 animate-spin mx-auto" />
            ) : (
              "Login"
            )}
          </motion.button>
        </form>
      </div>
      <div className="px-8 py-4 bg-gray-900 flex justify-center rounded-b-xl">
        <p className="text-sm text-gray-400">
          Don't have an account?{" "}
          <Link to={"/signup"} className="text-blue-400 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default LoginPage;
