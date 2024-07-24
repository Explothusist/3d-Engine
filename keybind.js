
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