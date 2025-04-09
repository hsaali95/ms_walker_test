"use client";
import React from "react";
import { Provider } from "react-redux";
import { store } from "../redux/store";
type propsType = {
  children: React.ReactNode;
};

const ReduxProvider = ({ children }: propsType) => {
  return <Provider store={store}>{children}</Provider>;
};

export default ReduxProvider;
