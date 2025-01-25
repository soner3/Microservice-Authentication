import { AppDispatch, RootState } from "@/lib/store";
import { addListener, createListenerMiddleware } from "@reduxjs/toolkit";

export const listeneMiddleware = createListenerMiddleware();

export const startAppListening = listeneMiddleware.startListening.withTypes<
  RootState,
  AppDispatch
>();

export type AppStartListening = typeof startAppListening;
export const addAppListener = addListener.withTypes<RootState, AppDispatch>();
export type AppAddListener = typeof addAppListener;
