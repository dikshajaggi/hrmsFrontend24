import { createContext, useState } from "react";

const LayoutContext = createContext();

const LayoutProvider = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <LayoutContext.Provider value={{ 
        collapsed, 
        setCollapsed 
    }}>
      {children}
    </LayoutContext.Provider>
  );
};


export {LayoutContext, LayoutProvider}
