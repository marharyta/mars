export interface User {
  user_id: string;
  name?: string;
  password?: string;
}

export interface Ore {
  ore_sites: number;
  timestamp: number;
}

export type OreType =
  | "Magnesium"
  | "Aluminium"
  | "Titanium"
  | "Iron"
  | "Chromium";

export interface OreExtended extends Ore {
  ore_sites: number;
  timestamp: number;
  detectorRange: number;
  location: {
    x: number;
    y: number;
    z: number;
  };
  detectedOres: {
    type: OreType;
    amount: number;
    distance: number;
    signalColor: "yellow";
  }[];
}

export interface UserProps {
  children: React.ReactNode;
}

export interface DashboardProps {
  onLogoutSuccess: () => void;
}

export interface LoginProps {
  onLoginSuccess: () => void;
}

export interface AuthContextType {
  token: string | null;
  login: (user_id: string, password: string) => Promise<void>;
  logout: () => void;
}

export const errorMap: Record<string, string> = {
  TypeError: "Oops! Something is wrong with the data.",
  RangeError: "Whoa! Something went out of bounds.",
  SyntaxError: "Looks like there’s a syntax problem in the code.",
  DefaultError: "Something unexpected happened. Please try again.",
};
