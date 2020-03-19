import { User } from "firebase";

export interface AuthState {
  hasLoaded: boolean;
  user?: User;
}
