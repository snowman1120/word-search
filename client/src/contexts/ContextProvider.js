import React, { createContext, useContext, useState } from 'react';

const StateContext = createContext();

//the 'children' returns the underlying component behind the ContextProvider
export const ContextProvider = ({ children }) => {

  const [isConnected, setIsConnected] = useState(false); 
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [userInfo, setUserInfo] = useState({ });
  const [words, setWords] = useState([]);
  const [message, setMessage] = useState(null);
  const [playInfo, setPlayInfo] = useState(null);

  //once we create the provider, we render out the children and pass the values we want to wrap our app with. 
  return (
    <StateContext.Provider
      value={{ 
        isConnected,
        setIsConnected,
        isLoggedin,
        setIsLoggedin,
        userInfo,
        setUserInfo,
        words,
        setWords,
        message,
        setMessage,
        playInfo,
        setPlayInfo
      }}
    >
      {children}
    </StateContext.Provider>
  )
}

//gives us the data from the context (useStateContext), by using the context. We specify 'StateContext' as the context.
export const useStateContext = () => useContext(StateContext);