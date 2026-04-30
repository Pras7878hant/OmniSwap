import { useState } from "react";
import AuthContext from "./AuthContext";

export const AuthProvider = ({ children }) => {
     const [user, setUser] = useState(() => {
          try {
               const storedUser = localStorage.getItem("user");
               return storedUser && storedUser !== "undefined"
                    ? JSON.parse(storedUser)
                    : null;
          } catch (err) {
               console.error(`Invalid user data ${err}`);
               return null;
          }
     });

     const login = (data) => {
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          setUser(data.user);
     };

     const logout = () => {
          localStorage.clear();
          setUser(null);
     };

     return (
          <AuthContext.Provider value={{ user, login, logout }}>
               {children}
          </AuthContext.Provider>
     );
};