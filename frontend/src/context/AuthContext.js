import React,{createContext,useContext,useState,useEffect} from 'react';
const AuthContext=createContext(null);
export function AuthProvider({children}){
  const [user,setUser]=useState(null);
  const [loading,setLoading]=useState(true);
  useEffect(()=>{
    const t=localStorage.getItem('sebn_token'), u=localStorage.getItem('sebn_user');
    if(t&&u){setUser(JSON.parse(u));}
    setLoading(false);
  },[]);
  const login=(d)=>{
    const u={id:d.userId,username:d.username,email:d.email,role:d.role};
    setUser(u);
    localStorage.setItem('sebn_token',d.token);
    localStorage.setItem('sebn_user',JSON.stringify(u));
  };
  const logout=()=>{setUser(null);localStorage.removeItem('sebn_token');localStorage.removeItem('sebn_user');};
  const isAdmin=()=>user?.role==='ADMIN';
  const isResp=()=>user?.role==='RESPONSABLE_FORMATION'||isAdmin();
  const isFormateur=()=>user?.role==='FORMATEUR'||isResp();
  return <AuthContext.Provider value={{user,loading,login,logout,isAdmin,isResp,isFormateur}}>{children}</AuthContext.Provider>;
}
export const useAuth=()=>useContext(AuthContext);
