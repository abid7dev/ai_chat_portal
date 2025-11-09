// src/@types/react-syntax-highlighter.d.ts

// Tell TS that these modules exist (we don't care about internal typings)
declare module "react-syntax-highlighter" {
  import * as React from "react";
  export const Prism: React.FC<any>;
  export const Light: React.FC<any>;
}

declare module "react-syntax-highlighter/dist/esm/styles/prism" {
  export const oneDark: any;
  export const oneLight: any;
  const styles: any;
  export default styles;
}

declare module "react-syntax-highlighter/dist/cjs/styles/prism" {
  export const oneDark: any;
  export const oneLight: any;
  const styles: any;
  export default styles;
}
