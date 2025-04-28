import React, { createContext, useContext, useState } from 'react';

const SubscriptionContext = createContext();

export const useSubscription = () => {
  return useContext(SubscriptionContext);
};

export const SubscriptionProvider = ({ children }) => {
  const [subscription, setSubscription] = useState(null);

  return (
    <SubscriptionContext.Provider value={{ subscription, setSubscription }}>
      {children}
    </SubscriptionContext.Provider>
  );
};
