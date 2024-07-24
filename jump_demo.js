
const m_canv = document.getElementById("m_canv");
const m_ctx = m_canv.getContext("2d");
const width = 1000;
const height = 600;
m_canv.width = width;
m_canv.height = height;

const welt_ctx = new WeltContext();


welt_ctx.set_floors([1000000, 0, -500, -1000000]);


function add_grass(x, y, z) {
    let far_right = welt_ctx.add_vertex(x+500, y+500, z-500);
    let far_left = welt_ctx.add_vertex(x-500, y+500, z-500);
    let back_right = welt_ctx.add_vertex(x+500, y-500, z);
    let back_left = welt_ctx.add_vertex(x-500, y-500, z);
    welt_ctx.add_surface([far_right, far_left, back_left, back_right], "#007000", Surface.floor);
};

add_grass(1000, 2000, 0);
AddTiledRect(welt_ctx, new Vertex(-500, 2500, -500), 6000, 2000, 6, 2, { as_floor: true, color: "#707000" });
AddRect(welt_ctx, new Vertex(2500, 2000, -500), 500, 500, { as_floor: true, color: "#707000" });
AddTiledRect(welt_ctx, new Vertex(-500, -500, 0), 6000, 2000, 6, 2, { as_floor: true, color: "#005000" });
AddTiledRect(welt_ctx, new Vertex(1500, -1500, 0), 4000, 1000, 4, 1, { as_floor: true, color: "#005000" });
AddRect(welt_ctx, new Vertex(-1800, -500, 0), 1000, 1000, { as_floor: true, color: "#005000" });
AddRect(welt_ctx, new Vertex(-500, -1800, 0), 1000, 1000, { as_floor: true, color: "#005000" });
AddRect(welt_ctx, new Vertex(-2200, -2200, 0), 1000, 1000, { as_floor: true, color: "#005000" });

AddCube(welt_ctx, new Vertex(2000, 500, -1), 1000, 1000, -500, [true, false, false, true, true, true], { color: "#505000" });

// AddCube(welt_ctx, new Vertex(-100, -100, -300), 200, 200, 300, [], { all_sides: true, color: "#505000" });



let move_speed = 12;
let rotate_speed = 0.017*2;
welt_ctx.camera.physics.set_physics(15, 0.5);
let slant_scale = new Vertex(Math.sqrt(2)/2, Math.sqrt(2)/2, 0);

function handle_camera() {
    // if (get_key_state("ArrowUp")) {
    //     welt_ctx.camera.moveRelative(new Vertex(0, 0, -move_speed));
    // }
    // if (get_key_state("ArrowDown")) {
    //     welt_ctx.camera.moveRelative(new Vertex(0, 0, move_speed));
    // }
    if (get_key_state(" ")) {
        if (welt_ctx.camera.physics.canJump()) {
            welt_ctx.camera.physics.jump();
        }
    }
    let move_vector = new Vertex(0, 0, 0);
    if (get_key_state("ArrowLeft")) {
        welt_ctx.rotateCamera(new Spherical_Vertex(0, rotate_speed, 0));
    }
    if (get_key_state("ArrowRight")) {
        welt_ctx.rotateCamera(new Spherical_Vertex(0, -rotate_speed, 0));
    }
    if (get_key_state("w")) {
        move_vector.y = move_speed;
    }
    if (get_key_state("s")) {
        move_vector.y = -move_speed;
    }
    if (get_key_state("a")) {
        move_vector.x = -move_speed;
    }
    if (get_key_state("d")) {
        move_vector.x = move_speed;
    }
    if (get_key_state("PageUp") || get_key_state("'")) {
        welt_ctx.rotateCamera(new Spherical_Vertex(0, 0, rotate_speed));
    }
    if (get_key_state("PageDown") || get_key_state("/")) {
        welt_ctx.rotateCamera(new Spherical_Vertex(0, 0, -rotate_speed));
    }
    if (move_vector.x !== 0 && move_vector.y !== 0) {
        move_vector.scale(slant_scale);
    }
    if (move_vector.x !== 0 || move_vector.y !== 0) {
        welt_ctx.moveCameraRelative(move_vector);
    }
};

function render_loop() {
    handle_camera();

    welt_ctx.render(0, 0, width, height, m_ctx);

    welt_ctx.physics();

    m_ctx.fillStyle = "#000000";
    m_ctx.fillText("("+welt_ctx.camera.point.x+", "+welt_ctx.camera.point.y+", "+welt_ctx.camera.point.z+")", 20, 20);
    m_ctx.fillText("("+welt_ctx.camera.angle.theta+", "+welt_ctx.camera.angle.phi+")", 20, 40);
};

setInterval(render_loop, 16);
// setInterval(render_loop, 1000);

// setInterval(function() {
//     console.log(collide_cube_to_vertical_wall_rect(welt_ctx.camera.get_bounding_points(), welt_ctx.indices_to_vertices(welt_ctx.surfaces[3].vertices)));
// }, 1000);