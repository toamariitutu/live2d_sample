export default function calculateWorker(): void {
  function getDistance2(position: number[][], a: number, b: number): number {
    return Math.pow(position[a][0] - position[b][0], 2) + Math.pow(position[a][1] - position[b][1], 2);
  }
    
  self.onmessage = (event) => {
    const position: number[][] = event.data;

    if (!position) {
      return;
    }
    const parameter: { [name: string]: number } = {},
      faceR = Math.sqrt(getDistance2(position, 37, 2)),
      faceL = Math.sqrt(getDistance2(position, 37, 12)),
      mouthH = Math.sqrt(getDistance2(position, 57, 60)),
      lipH = Math.sqrt(getDistance2(position, 53, 57));

    // face angle
    parameter['PARAM_ANGLE_X'] = Math.asin((faceL - faceR) / (faceL + faceR)) * (180 / Math.PI);
    parameter['PARAM_ANGLE_Y'] = Math.asin((position[0][1] + position[14][1] - position[27][1] - position[32][1]) * 2 / (position[14][0] - position[0][0])) * (180 / Math.PI);
    parameter['PARAM_ANGLE_Z'] = -Math.atan((position[32][1] - position[27][1]) / (position[32][0] - position[27][0])) * (180 / Math.PI);
    // mouth
    parameter['PARAM_MOUTH_OPEN_Y'] = mouthH / lipH - 0.5;
    parameter['PARAM_MOUTH_FORM'] = 2 * Math.sqrt(getDistance2(position, 50, 44) / getDistance2(position, 30, 25)) - 1;
    // eye ball
    parameter['PARAM_EYE_BALL_X'] = Math.sqrt(getDistance2(position, 27, 23) / getDistance2(position, 25, 23)) - 0.5;
    parameter['PARAM_EYE_BALL_Y'] = Math.sqrt(getDistance2(position, 27, 24) / getDistance2(position, 26, 24)) - 0.5;
    // eye brow
    parameter['PARAM_BROW_L_Y'] = 2 * Math.sqrt(getDistance2(position, 24, 21)) / lipH - 4;
    parameter['PARAM_BROW_R_Y'] = 2 * Math.sqrt(getDistance2(position, 29, 17)) / lipH - 4;

    (<any>self.postMessage)(parameter);
  };
}