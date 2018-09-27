import * as React from 'react';
import State from '../State';

class AssetsLoader extends React.Component<AssetsLoader.Props, void> {
  private manager: PlatformManager;
  componentDidMount(): void {
    this.manager = new PlatformManager();
    Live2D.init();
    Live2DFramework.setPlatformManager(this.manager);
  }

  shouldComponentUpdate(props: AssetsLoader.Props) {
    if (props.mutable.currentModel === this.props.mutable.currentModel) {
      return false;
    }
    if (props.mutable.currentModel) {
      const { model, physics, textures } = props.mutable.currentModel;
      Promise.all([
        new Promise(resolve => this.manager.loadBytes(model, resolve)),
        new Promise(resolve => this.manager.loadBytes(physics, resolve)),
        Promise.all(textures.map(texture =>
          new Promise(resolve => this.manager.loadTexture(texture, resolve))
        ))
      ])
        .then(([model, physics, textures]: [any, any, HTMLImageElement[]]) =>
          this.props.observer.onAssetsLoaded({ model, physics, textures })
        )
    }
    return false;
  }

  render(): JSX.Element {
    return null;
  }
}

namespace AssetsLoader {
  export interface Props {
    mutable: {
      currentModel?: State.Model;
    };
    observer: {
      onAssetsLoaded(data: {
        model: any;
        physics: any;
        textures: HTMLImageElement[];
      }): void;
    };
  }
}

export default AssetsLoader;
