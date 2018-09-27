import State from './State';

class Observer {
  constructor(private store: {
    setState: <T>(f: (state: State.Mutable, props: { immutable: State.Immutable; mutable: State.Mutable; }) => T) => void;
  }) {
      
  }
    
  onAssetsLoaded(currentAssets: {
    model: any;
    physics: any;
    textures: HTMLImageElement[];
  }): void {
    this.update((mutable) => {
      let controllerVisible = mutable.controllerVisible;
      if (!mutable.currentAssets) {
        controllerVisible = true;
      }
      return { currentAssets, controllerVisible, loading: false };
    });
  }
  
  updateParameter(live2DParameter: {[name: string]: number}): void {
    this.update(() => ({ live2DParameter }));
  }
  
  onGetUserMedia(stream: MediaStream): void {
    this.update(() => ({ stream }));
  }
  
  onToggleTracking(): void {
    this.update(mutable => {
      if (mutable.stream) {
        mutable.stream.getTracks()[0].stop();
      }
      return { 
        tracking: !mutable.tracking,
        stream: void 0
      };
    });
  }
  
  onChangeModel(name: string): void {
    this.update((mutable, immutable) => ({ currentModel: immutable.models[name], loading: true }));
  }
  
  onChangeShowVideo(showVideo: boolean): void {
    this.update(() => ({ showVideo }));
  }
  
  onChangeShowTrace(showTrace: boolean): void {
    this.update(() => ({ showTrace }));
  }
  
  onToggleController(): void {
    this.update((mutable) => ({ controllerVisible: !mutable.controllerVisible }));
  }

  private update(update: (mutable: State.Mutable, immutable: State.Immutable) => any): void {
    this.store.setState((mutable, { immutable }) => update(mutable, immutable));
  }
}

export default Observer;