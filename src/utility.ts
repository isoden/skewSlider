
interface TweenOptions {
  start      : number;
  end        : number;
  duration   : number;
  onUpdate   : Function;
  onComplete : Function;
}

export function tween({start, end, duration, onUpdate, onComplete}: TweenOptions) {
  let diff        = Math.abs(end) + Math.abs(start);
  let prevTime    = +new Date();
  let elapsedTime = 0;

  return new Promise((resolve, reject) => {
    let timer = raf(function ticker() {
      let now         = +new Date();
      let timeRate    = elapsedTime / duration;
      let changeValue = start - diff * (1 - Math.pow((1 - timeRate), 3));

      onUpdate(changeValue);

      // 1フレーム分の時間を経過時間に加算
      elapsedTime += now - prevTime;
      prevTime = now;

      if (elapsedTime >= duration) {
        cancelRaf(timer);
        onUpdate(end);
        onComplete(end);
        return resolve();
      }

      raf(ticker);
    });
  });
}


export function raf(callback: Function) {
  return (
    window.requestAnimationFrame ||
    (<any>window).mozRequestAnimationFrame ||
    (<any>window).webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (callback: Function) {
      return setTimeout(callback, 1000 / 60);
    }
  )(callback);
}

export function cancelRaf(requestId: number) {
  return (
    window.cancelAnimationFrame ||
    (<any>window).mozCancelAnimationFrame ||
    (<any>window).webkitCancelAnimationFrame ||
    function (requestId: number) {
      clearTimeout(requestId);
    }
  )(requestId);
}
