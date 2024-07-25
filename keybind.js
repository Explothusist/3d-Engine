
// Key Handling
let key_states = {};
function set_key_state(key, state) {
    // console.log(key);
    switch (key) {
        case "ArrowUp":
            key_states.arrup = state;
            break;
        case "ArrowDown":
            key_states.arrdown = state;
            break;
        case "ArrowLeft":
            key_states.arrleft = state;
            break;
        case "ArrowRight":
            key_states.arrright = state;
            break;
        case "a":
            key_states.a = state;
            break;
        case "d":
            key_states.d = state;
            break;
        case "s":
            key_states.s = state;
            break;
        case "w":
            key_states.w = state;
            break;
        case "'":
            key_states.single_quote = state;
            break;
        case "/":
            key_states.foreslash = state;
            break;
        case " ":
            key_states.space = state;
            break;
        case "PageUp":
            key_states.pgup = state;
            break;
        case "PageDown":
            key_states.pgdown = state;
            break;
        case "Control":
            key_states.ctrl = state;
            break;
        case "Shift":
            key_states.shift = state;
            break;
    }
};
function get_key_state(key) {
    switch (key) {
        case "ArrowUp":
            return key_states.arrup;
        case "ArrowDown":
            return key_states.arrdown;
        case "ArrowLeft":
            return key_states.arrleft;
        case "ArrowRight":
            return key_states.arrright;
        case "a":
            return key_states.a;
        case "d":
            return key_states.d;
        case "s":
            return key_states.s;
        case "w":
            return key_states.w;
        case "'":
            return key_states.single_quote;
        case "/":
            return key_states.foreslash;
        case " ":
            return key_states.space;
        case "PageUp":
            return key_states.pgup;
        case "PageDown":
            return key_states.pgdown;
        case "Control":
            return key_states.ctrl;
        case "Shift":
            return key_states.shift;
    }
};
document.addEventListener("keydown", function(event) {
    set_key_state(event.key, true);
});
document.addEventListener("keyup", function(event) {
    set_key_state(event.key, false);
});

// Controller Hendling
let gamepads = [];
function gamepadHandler(event, connected) {
  const new_gamepad = event.gamepad;
  // Note:
  // gamepad === navigator.getGamepads()[gamepad.index]


  if (connected) {
    console.log("Joystick Connected!");
    gamepads.push(new_gamepad);
    console.log(gamepads);
  } else {
    console.log("Joystick Disconnected");
    for (let i in gamepads) {
        let gamepad = gamepads[i];
        if (gamepad.index === new_gamepad.index) {
            gamepads.splice(i, 1);
        }
    }
  }
}

window.addEventListener(
  "gamepadconnected",
  (e) => {
    gamepadHandler(e, true);
  },
  false,
);
window.addEventListener(
  "gamepaddisconnected",
  (e) => {
    gamepadHandler(e, false);
  },
  false,
);

// l/rb = left/right bumper, l/rt = left/right trigger, l/rj = click left/right joystick
let standard_button_bindings = ["B", "A", "Y", "X", "LBumper", "RBumper", "LTrigger", "RTrigger", "Select", "Start", "LJoystick", "RJoystick", "Up", "Down", "Left", "Right", "Special"];
let standard_axes_bindings = ["LeftX", "LeftY", "RightX", "RightY"];
function get_button_state(button_name) {
    let button = standard_button_bindings.indexOf(button_name);
    if (button === -1) {
        alert("Button "+button_name+" not recognized");
        return;
    }
    let any_true = false;
    for (let i in gamepads) {
        let gamepad = navigator.getGamepads()[gamepads[i].index];
        if (gamepad.buttons[button].pressed) {
            any_true = true;
            break;
        }
    }
    return any_true;
};
function get_axis_state(axis_name, deadband) {
    let axis = standard_axes_bindings.indexOf(axis_name);
    if (axis === -1) {
        alert("Axis "+axis_name+" not recognized");
    }
    let most_extreme = 0;
    for (let i in gamepads) {
        let gamepad = navigator.getGamepads()[gamepads[i].index];
        if (Math.abs(gamepad.axes[axis]) > Math.max(most_extreme, deadband)) {
            most_extreme = gamepad.axes[axis];
        }
    }
    return most_extreme;
};
function isGamepadConnected() {
    if (gamepads.length >= 1) {
        return true;
    }
    return false;
};