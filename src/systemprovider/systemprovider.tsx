import React, { createContext, useState, useEffect, useCallback } from "react";

import "dotenv/config";

// Define the type for the key-value pairs
type FeatureFlags = { [key: string]: any };
type Settings = { [key: string]: any };

// Define the context type
interface SystemContextType {
  featureFlags: FeatureFlags;
  settings: Settings;
  setUser: React.Dispatch<React.SetStateAction<any>>;
}

interface SystemProviderProps {
  tag: string;
  children: React.ReactNode;
}

// Create the context
const SystemContext = createContext<SystemContextType | undefined>(undefined);

// Create the provider
const SystemProvider = (props: SystemProviderProps) => {
  const { children, tag } = props;

  if (!process.env.REACT_APP_SYSTEM_API) {
    throw new Error("REACT_APP_SYSTEM_API must be defined");
  }
  if (!tag) {
    throw new Error("Tag must be defined, can be application id");
  }
  
  const [featureFlags, setFeatureFlags] = useState<FeatureFlags>({});
  const [settings, setSettings] = useState<Settings>({});
  const [user, setUser] = useState<any>();

  const fetchSettings = useCallback(() => {
    const id = user?.id ?? 0;
    if (user) {
      fetch(
        `${process.env.REACT_APP_SYSTEM_API}/api/settings/api.php/mysettings/${id}`
      )
        .then((res) => res.json())
        .then((res) => {
          // console.log("Settings",res)
          setSettings(res);
        });
    }
  }, []);

  const fetchFeatureFlags = useCallback(() => {
    const body = user;
    fetch(
      `${process.env.REACT_APP_SYSTEM_API}/api/flags/getfeatureflags.php?tag=${tag}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setFeatureFlags(data.result);
      })
      .catch((err) => console.log(err));
  }, [tag, user]);

  useEffect(() => {
    fetchFeatureFlags();
  }, [tag, user]);

  useEffect(() => {
    if (!user?.id) {
      throw new Error("User must have an id");
    }
    fetchSettings();
  }, [user]);

  return (
    <SystemContext.Provider
      value={{ featureFlags, settings, setUser }}
    >
      {children}
    </SystemContext.Provider>
  );
};
export { SystemContext, SystemProvider };
