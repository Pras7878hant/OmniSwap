import { createContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

     const [user, setUser] = useState(() => {
          try {
               const storedUser = localStorage.getItem("user");

               if (!storedUser || storedUser === "undefined") return null;

               const parsed = JSON.parse(storedUser);

               if (!parsed?.token) return null;

               return parsed;

          } catch {
               localStorage.removeItem("user");
               return null;
          }
     });

     const login = (data) => {
          localStorage.setItem("user", JSON.stringify(data));
          setUser(data);
     };

     const logout = () => {
          localStorage.removeItem("user");
          localStorage.removeItem("userRoadmap");
          setUser(null);
     };

     const updateUser = (newUser) => {
          if (!newUser) return;
          localStorage.setItem("user", JSON.stringify(newUser));
          setUser(newUser);
     };

     return (
          <AuthContext.Provider value={{ user, login, logout, updateUser }}>
               {children}
          </AuthContext.Provider>
     );
};

export default AuthContext;