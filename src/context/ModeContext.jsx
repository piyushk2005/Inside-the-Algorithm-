import React, { createContext, useContext, useState } from "react";

const ModeContext = createContext({ guided: true, setGuided: () => {} });

export function ModeProvider({ children }) {
  const [guided, setGuided] = useState(true);
  return (
    <ModeContext.Provider value={{ guided, setGuided }}>
      {children}
    </ModeContext.Provider>
  );
}

export function useMode() {
  return useContext(ModeContext);
}
