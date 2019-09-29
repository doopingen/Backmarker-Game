var LF1 = {
    canvas: null,
    ctx: null,
    canvas2: null,
    ctx2: null,
    colors: {
      sky: "#D4F5FE",
      mountains: "#83CACE",
      ground: "#8FC04C",
      groundDark: "#73B043",
      road: "#606a7c",
      roadLine: "#FFF",
      hud: "#FFF"
    },
    settings: {
      fps: 60,
      skySize: 120,
      ground: {
        size: 350,
        min: 4,
        max: 120
      },
      road: {
        min: 76,
        max: 700,
      }
    },
    state: {
      bgpos: 0,
      offset: 0,
      startDark: true,
      curve: 0,
      currentCurve: 0,
      turn: 1,
      speed: 27,
      xpos: 0,
      section: 50,
      car: {
        maxSpeed: 50,
        friction: 0.4,
        acc: 0.85,
        deAcc: 0.5
      },
      keypress: {
        up: false,
        left: false,
        right: false,
        down: false
      }
    },
    storage: {
      bg: null
    }
};
LF1.canvas = document.getElementsByTagName('canvas')[0];
LF1.ctx = $.canvas.getContext('2d');
LF1.ctx2 = $.canvas2.getContext('2d');
LF1.canvas2 = document.createElement('canvas');
LF1.canvas2.width = $.canvas.width;
LF1.canvas2.height = $.canvas.height;
