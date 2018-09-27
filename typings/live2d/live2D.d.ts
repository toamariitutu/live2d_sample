declare class PlatformManager {
  loadBytes(file: string, callback: (data: any) => void): void;
  loadTexture(file: string, callback: (data: HTMLImageElement) => void): void;
}

declare namespace Live2DFramework {
  function setPlatformManager(manager: PlatformManager): void;
}

declare namespace Live2D {
  function init(): void;
  function setGL(gl: WebGLRenderingContext): void;
}

declare namespace Live2DModelWebGL {
  function loadModel(data: any): Live2DModel;
}

declare interface Live2DModel {
  setParamFloat(name: string, value: number): void;
  setTexture(index: number, texture: WebGLTexture): void;
  setMatrix(matrix: [number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number]): void;
  setGL(gl: WebGLRenderingContext): void;
  setPartsOpacity(part: string, opacity: number): void;
  getCanvasWidth(): number;
  getCanvasHeight(): number;
  update(): void;
  draw(): void;
}

declare namespace L2DPhysics {
  function load(data: any): Live2DPhysics;
}

declare interface Live2DPhysics {
  updateParam(model: Live2DModel): void;
}
