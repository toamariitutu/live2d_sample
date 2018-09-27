namespace State {
  export interface Model {
    name: string;
    model: string;
    physics: string;
    textures: string[];
  }
  
  export interface Immutable {
    models: {[name: string]: Model};
  }
  
  export interface Mutable {
    stream?: MediaStream;
    feature?: number[][];
    tracking: boolean;
    showVideo: boolean;
    showTrace: boolean;
    controllerVisible: boolean;
    loading: boolean;
    currentModel?: Model;
    currentAssets?: {
      model: any;
      physics: any;
      textures: HTMLImageElement[];
    };
    live2DParameter?: {[name: string]: number};
  }
}

export default State;
