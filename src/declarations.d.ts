declare module 'pannellum-react' {
  import React from 'react';

  interface PannellumPropType {
    width: string;
    height: string;
    image: string;
    autoLoad: boolean;
    yaw: number;
    pitch: number;
    hfov: number;
    minHfov: number;
    maxHfov: number;
    type: string;
  }

  const Pannellum: React.FC<PannellumPropType>;
  export default Pannellum;
}