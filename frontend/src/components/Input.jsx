import React from "react";

const Input = ({ icon: Icon, ...props }) => {
  //since we're using the icon as a component we will rename with initial of an uppercase
  return (
    <div className="relative mb-6">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Icon className="size-5 text-blue-600" />
      </div>
      <input {...props} className="w-full pl-10 pr-3 py-2 bg-transparent border border-slate-700 focus:border-blue-800 outline-none text-slate-200 placeholder-gray-400 transition duration-200 rounded-lg"/>
    </div>
  );
};

export default Input;
