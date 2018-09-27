declare namespace clm {
  class tracker {
    constructor(arg: { useWebGL: boolean; });

    init(model: any): void;
    start(video: HTMLVideoElement): void;
    stop(): void;
    getCurrentPosition(): [number, number][];
    draw(canvas: HTMLCanvasElement): void;
  }
}

declare var pModel: any;
