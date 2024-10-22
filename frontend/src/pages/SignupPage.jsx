import { motion } from "framer-motion";
import { Loader, Lock, Mail, User } from "lucide-react";
import Input from "../components/Input";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const SignupPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signup, error, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      await signup(email, password, name);
      navigate("/verify-email");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl overflow-hidden rounded-xl text-slate-200"
    >
      <div className="p-8">
        <h2 className="text-3xl font-bold mb-6 text-center">Create Account</h2>
        <form onSubmit={handleSignUp}>
          <Input
            icon={User}
            placeholder={"Full Name"}
            type={"text"}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
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
          {error && <p className="text-red-500 font-semibold mt-2">{error}</p>}
          <motion.button
            className="mt-5 w-full py-3 px-4 text-slate-200 font-bold rounded-lg cursor-pointer border border-slate-700 bg-blue-700 hover:bg-blue-600"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader className="animate-spin mx-auto size={24}" />
            ) : (
              "Sign up"
            )}
          </motion.button>
        </form>
      </div>
      <div className="px-8 py-4 bg-gray-900 flex justify-center rounded-b-xl">
        <p className="text-sm text-gray-400">
          Already have an account?{" "}
          <Link to={"/login"} className="text-blue-400 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default SignupPage;
