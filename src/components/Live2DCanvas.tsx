import * as React from 'react';

class Live2DCanvas extends React.Component<Live2DCanvas.Props, {}> {
  private webGLContext: WebGLRenderingContext;
  private live2DModel: Live2DModel;
  private live2DPhysics: Live2DPhysics;
  private aspectRatio = 0;

  shouldComponentUpdate(props: Live2DCanvas.Props) {
    if (props.mutable.currentAssets && (this.props.mutable.currentAssets !== props.mutable.currentAssets)) {
      Live2D.setGL(this.webGLContext);
      const { model, physics, textures} = props.mutable.currentAssets;
      this.live2DModel = Live2DModelWebGL.loadModel(model);
      const ratio = this.aspectRatio / (this.live2DModel.getCanvasHeight() / this.live2DModel.getCanvasWidth());
      const { width, height } = ratio > 1
        ? {
          width: 2.0 / this.live2DModel.getCanvasWidth(),
          height: 2.0 / (this.live2DModel.getCanvasHeight() * ratio)
        }
        : {
          width: (2.0 * ratio) / this.live2DModel.getCanvasWidth(),
          height: 2.0 / this.live2DModel.getCanvasHeight()
        };
      this.live2DModel.setMatrix([
        width, 0, 0, 0,
        0, -height, 0, 0,
        0, 0, 1, 0,
        -1, 1, 0, 1
      ]);

      // Sad process to make unrequired parts invisible...
      try {
        this.live2DModel.setPartsOpacity('PARTS_01_ARM_L_B_001', 0);
        this.live2DModel.setPartsOpacity('PARTS_01_ARM_R_B_001', 0);
        this.live2DModel.setPartsOpacity('PARTS_01_ARM_L_B_002', 0);
        this.live2DModel.setPartsOpacity('PARTS_01_ARM_R_B_002', 0);
      } catch (e) {
        try {
          this.live2DModel.setPartsOpacity('PARTS_01_ARM_L_02', 0);
          this.live2DModel.setPartsOpacity('PARTS_01_ARM_R_02', 0);
        } catch (e) {
          try {
            this.live2DModel.setPartsOpacity('PARTS_01_ARM_R_B', 0);
          } catch (e) {
          }
        }
      }

      this.live2DPhysics = L2DPhysics.load(physics);
      textures.forEach((image, index) => this.live2DModel.setTexture(index, this.createTexture(image)));
    }
    return false;
  }

  render(): JSX.Element {
    return <canvas ref={canvas => {
        canvas.height = window.innerHeight;
        canvas.width = window.innerWidth;
        this.aspectRatio = window.innerHeight / window.innerWidth;
        this.webGLContext = this.getWebGLContext(canvas);
        this.drawLive2D();
    }} style={{position: 'absolute', top: 0, zIndex: -1}} onClick={() => this.props.observer.onToggleController()} />;
  }

  private getWebGLContext(canvas: HTMLCanvasElement): WebGLRenderingContext {
    let result: WebGLRenderingContext = null;
    const option = { premultipliedAlpha : true };
    ['webgl', 'experimental-webgl' , 'webkit-3d', 'moz-webgl'].some(contextId => {
      try {
        result = canvas.getContext(contextId, option) as WebGLRenderingContext;
        return true;
      } catch (e) {
        return false;
      }
    });
    console.log('WebGLContext', result)
    return result;
  }

  private createTexture(image: HTMLImageElement): WebGLTexture {
    const texture = this.webGLContext.createTexture();

    if(!texture) {
      console.error('Failed to generate gl texture name.');
      return null;
    }

    this.webGLContext.pixelStorei(this.webGLContext.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 1);
    this.webGLContext.pixelStorei(this.webGLContext.UNPACK_FLIP_Y_WEBGL, 1);
    this.webGLContext.activeTexture(this.webGLContext.TEXTURE0);
    this.webGLContext.bindTexture(this.webGLContext.TEXTURE_2D, texture);
    this.webGLContext.texImage2D(this.webGLContext.TEXTURE_2D, 0, this.webGLContext.RGBA, this.webGLContext.RGBA, this.webGLContext.UNSIGNED_BYTE, image);
    this.webGLContext.texParameteri(this.webGLContext.TEXTURE_2D, this.webGLContext.TEXTURE_MAG_FILTER, this.webGLContext.LINEAR);
    this.webGLContext.texParameteri(this.webGLContext.TEXTURE_2D, this.webGLContext.TEXTURE_MIN_FILTER, this.webGLContext.LINEAR_MIPMAP_NEAREST);
    this.webGLContext.generateMipmap(this.webGLContext.TEXTURE_2D);

    return texture;
  }

  private drawLive2D(): void {
    requestAnimationFrame(() => this.drawLive2D());
    if(!(this.live2DModel && this.live2DPhysics && this.props.mutable.live2DParameter)) {
      return;
    }
    this.webGLContext.clear(this.webGLContext.COLOR_BUFFER_BIT);
    Object.keys(this.props.mutable.live2DParameter).forEach(key =>
      this.live2DModel.setParamFloat(key, this.props.mutable.live2DParameter[key])
    );
    this.live2DPhysics.updateParam(this.live2DModel);
    this.live2DModel.update();
    this.live2DModel.draw();
  }
}

namespace Live2DCanvas {
  export interface Props {
    mutable: {
      currentAssets?: {
        model: any;
        physics: any;
        textures: HTMLImageElement[];
      };
      live2DParameter?: {[name: string]: number};
    };
    observer: {
      onToggleController(): void;
    }
  }
}

export default Live2DCanvas;
