import * as React from 'react';
import State from '../State';
import calculateWorker from '../workers/calculateWorker';

const BLINK_SAMPLING_COUNT = 100;

class FaceTracker extends React.Component<FaceTracker.Props, void> {
  private tracker: clm.tracker;
  private video: HTMLVideoElement;
  private traceCanvas: HTMLCanvasElement;
  private canvas2dContext: CanvasRenderingContext2D;
  
  private worker: Worker;

  componentDidMount(): void {
    this.tracker = new clm.tracker({useWebGL: true});
    this.tracker.init(pModel);
    this.worker = new Worker(URL.createObjectURL(new Blob(['(', calculateWorker.toString(), ')()'], { type: 'application/javascript' })));
    document.addEventListener('clmtrackrIteration', () => {
      this.canvas2dContext.clearRect(0, 0, this.traceCanvas.width, this.traceCanvas.height);
      if (this.props.mutable.showTrace) {
        this.tracker.draw(this.traceCanvas);
      }
      this.worker.postMessage(this.tracker.getCurrentPosition());
    });
    this.worker.onmessage = (event) => this.props.observer.updateParameter(event.data);
  }

  shouldComponentUpdate(props: FaceTracker.Props): boolean {
    const shouldComponentUpdate = (props.mutable.showVideo !== this.props.mutable.showVideo)
      || (props.mutable.showTrace !== this.props.mutable.showTrace)
      || (props.mutable.tracking !== this.props.mutable.tracking);
    if (!props.mutable.stream) {
      return shouldComponentUpdate;
    }
    if (!this.props.mutable.stream) {
      this.video.src = window.URL.createObjectURL(props.mutable.stream);
      this.video.play();
      if (props.mutable.tracking) {
        this.tracker.start(this.video);
      }
      return shouldComponentUpdate;
    }
    if (props.mutable.tracking && !this.props.mutable.tracking) {
      this.tracker.start(this.video);
    }
    if (!props.mutable.tracking && this.props.mutable.tracking) {
      this.tracker.stop();
    }
    return shouldComponentUpdate;
  }

  render(): JSX.Element {
    const style = {
      WebkitTransform: 'scaleX(-1)',
      OTransform: 'scaleX(-1)',
      MozTransform: 'scaleX(-1)',
      transform: 'scaleX(-1)',
      filter: 'FlipH',
      msFilter: 'FlipH',
      position: 'absolute'
    },
      styleHidden = { display: 'none' },
      { showVideo, showTrace, tracking } = this.props.mutable;
    
    return <div>
      <video ref={video => !this.video && (this.video = video)} width='320' height='240' style={ tracking && showVideo ? style : styleHidden } />
      <canvas ref={traceCanvas => {
        if (this.traceCanvas) {
          return;
        }
        this.traceCanvas = traceCanvas;
        this.canvas2dContext = traceCanvas.getContext('2d');
      }} width='320' height='240' style={ tracking && showTrace ? style : styleHidden } />
    </div>;
  }
}

namespace FaceTracker {
  export interface Props {
    mutable: {
      tracking: boolean;
      showVideo: boolean;
      showTrace: boolean;
      stream?: MediaStream;
    };
    observer: {
      updateParameter(parameter: {[name: string]: number}): void;
    };
  }
}
  
function getAveg(arr: number[]): number {
  return arr.reduce((acc, num) => acc + num, 0) / arr.length;
}

export default FaceTracker;
