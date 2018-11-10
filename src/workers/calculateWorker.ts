export default function calculateWorker(): void {
  const BLINK_INTERVAL = 10
  const EYE_CLOSE_INTERVAL = 6
  let blinkInterval: number = BLINK_INTERVAL
  let prevPosition: number[][] = []
  let blinkCount: number = 0
  let eyeOpen: number = 1
  let eyeClosing: boolean = false
  let eyeCloseInterval: number = EYE_CLOSE_INTERVAL

  /**
   * 三平方の定理で二点間の距離の二乗の値を求める
   * @param {number[][]} position clmtrckerから受け取ったcurrentPosition
   * @param {number} a face model配列の座標インデックス
   * @param {number} b face model配列の座標インデックス
   * @returns {number} 二点間の距離の二乗
   */
  function getDistance2(position: number[][], a: number, b: number): number {
    return Math.pow(position[a][0] - position[b][0], 2) + Math.pow(position[a][1] - position[b][1], 2);
  }
    
  self.onmessage = (event) => {
    const position: number[][] = event.data;

    if (!position) {
      return;
    }

    if (eyeClosing && eyeCloseInterval === 0) {
      eyeClosing = false
      eyeCloseInterval = EYE_CLOSE_INTERVAL
    }

    if (eyeClosing && eyeOpen > 0) {
      eyeOpen = eyeOpen - 0.25
    } else if (!eyeClosing && eyeOpen < 1) {
      eyeOpen = eyeOpen + 0.25
    }

    // 顔の各パーツの動作の指標となる二点間の距離を求める
    const parameter: { [name: string]: number } = {},
      // 鼻の中心の下端から右輪郭の距離
      faceR = Math.sqrt(getDistance2(position, 37, 2)),
      // 鼻の中心の下端から左輪郭の距離
      faceL = Math.sqrt(getDistance2(position, 37, 12)),
      // 開口部分の距離
      mouthH = Math.sqrt(getDistance2(position, 57, 60)),
      // 下唇の厚み
      lipH = Math.sqrt(getDistance2(position, 53, 57));

    // face angle
    // 顔の横向きの角度
    parameter['PARAM_ANGLE_X'] = Math.asin((faceL - faceR) / (faceL + faceR)) * (180 / Math.PI);
    // 顔の縦向きの角度
    parameter['PARAM_ANGLE_Y'] = Math.asin((position[0][1] + position[14][1] - position[27][1] - position[32][1]) * 2 / (position[14][0] - position[0][0])) * (180 / Math.PI);
    // 顔の傾きの角度
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

    if (prevPosition.length) {
      const rightEye = position[27]
      const prevRightEye = prevPosition[27]
      const dxRE = rightEye[0] - prevRightEye[0]
      const dyRE = rightEye[1] - prevRightEye[1]
      const dRE = Math.sqrt(Math.pow(dxRE, 2) + Math.pow(dyRE, 2))
      const nose = position[37]
      const prevNose = prevPosition[37]
      const dxN = nose[0] - prevNose[0];
      const dyN = nose[1] - prevNose[1];
      const dN = Math.sqrt(dxN * dxN + dyN * dyN);

      if (blinkInterval < 0) {
        if (0.4 <= dyRE) {
          if (dRE - dN > 0.6) {
            eyeOpen = eyeOpen - 0.25
            eyeClosing = true
            blinkInterval = BLINK_INTERVAL
            blinkCount++
          }
        }
      }
    }
    
    parameter['PARAM_EYE_R_OPEN'] = eyeOpen
    parameter['PARAM_EYE_L_OPEN'] = eyeOpen

    if (eyeClosing && eyeCloseInterval > 0) {
      eyeCloseInterval-- 
    }

    blinkInterval--
    prevPosition = position
    parameter['blinkCount'] = blinkCount;

    (<any>self.postMessage)(parameter);
  };
}