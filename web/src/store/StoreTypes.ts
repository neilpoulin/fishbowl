import { AuthState } from "@web/store/modules/auth/AuthModuleTypes";

export enum Namespace {
  auth = "auth"
}

export interface RootState {
  version: string;
}

export interface GlobalState extends RootState {
  [Namespace.auth]: AuthState;
}
