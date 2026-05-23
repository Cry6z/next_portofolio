import { Object3DNode } from '@react-three/fiber';

declare module 'meshline' {
  export const MeshLineGeometry: any;
  export const MeshLineMaterial: any;
}

declare module '@react-three/fiber' {
  interface ThreeElements {
    meshLineGeometry: Object3DNode<any, any>;
    meshLineMaterial: Object3DNode<any, any>;
  }
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      meshLineGeometry: any;
      meshLineMaterial: any;
    }
  }
}
