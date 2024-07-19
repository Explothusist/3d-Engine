
const m_canv = document.getElementById("m_canv");
const m_ctx = m_canv.getContext("2d");
const width = 1000;
const height = 600;
m_canv.width = width;
m_canv.height = height;

const welt_ctx = new WeltContext();

// welt_ctx.add_vertex(-200, -200, 200); // fr
// welt_ctx.add_vertex(-200, 200, 200); // br
// welt_ctx.add_vertex(200, 200, 200); // bl
// welt_ctx.add_vertex(200, -200, 200); // fl
// welt_ctx.add_vertex(-200, -200, -200);
// welt_ctx.add_vertex(-200, 200, -200);
// welt_ctx.add_vertex(200, 200, -200);
// welt_ctx.add_vertex(200, -200, -200);

// welt_ctx.add_vertex(-500, -500, 500); // fr
// welt_ctx.add_vertex(-500, 500, 500); // br
// welt_ctx.add_vertex(500, 500, 500); // bl
// welt_ctx.add_vertex(500, -500, 500); // fl
// welt_ctx.add_vertex(-500, -500, -500);
// welt_ctx.add_vertex(-500, 500, -500);
// welt_ctx.add_vertex(500, 500, -500);
// welt_ctx.add_vertex(500, -500, -500);

// welt_ctx.add_surface([1, 2, 6, 5], "#A00000"); // b
// welt_ctx.add_surface([0, 1, 2, 3], "#00A000"); // t
// welt_ctx.add_surface([4, 5, 6, 7], "#00A000"); // b
// welt_ctx.add_surface([2, 3, 7, 6], "#0000A0"); // l
// welt_ctx.add_surface([0, 1, 5, 4], "#0000A0"); // r
// welt_ctx.add_surface([0, 3, 7, 4], "#A00000"); // f

// function add_grass(x, y, z) {
//     let far_right = welt_ctx.add_vertex(x+500, y+500, z);
//     let far_left = welt_ctx.add_vertex(x-500, y+500, z);
//     let back_right = welt_ctx.add_vertex(x+500, y-500, z);
//     let back_left = welt_ctx.add_vertex(x-500, y-500, z);
//     welt_ctx.add_floor([far_right, far_left, back_left, back_right], "#005000");
// };

// add_grass(0, 0, 0);
// add_grass(1000, 0, 0);
// add_grass(2000, 0, 0);
// add_grass(3000, 0, 0);
// add_grass(4000, 0, 0);
// add_grass(5000, 0, 0);
// add_grass(0, -1000, 0);
// add_grass(1000, -1000, 0);
// add_grass(2000, -1000, 0);
// add_grass(3000, -1000, 0);
// add_grass(0, 1000, 0);
// add_grass(1000, 1000, 0);
// add_grass(2000, 1000, 0);
// add_grass(3000, 1000, 0);

// for (let i = -5000; i <= 5000; i += 1000) {
//     for (let j = -3000; j <= 3000; j += 1000) {
//         add_grass(i, j, 0);
//     }
// }

AddTiledRect(welt_ctx, new Vertex(-5000, -3000, 0), 10000, 6000, 10, 6, { as_floor: true, color: "#005000" });

function add_checker_board(x, y, z) {
    let size_of_square = 100;
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            let far_right = welt_ctx.add_vertex(x+(i*size_of_square)+(size_of_square/2), y+(j*size_of_square)+(size_of_square/2), z);
            let far_left = welt_ctx.add_vertex(x+(i*size_of_square)-(size_of_square/2), y+(j*size_of_square)+(size_of_square/2), z);
            let back_right = welt_ctx.add_vertex(x+(i*size_of_square)+(size_of_square/2), y+(j*size_of_square)-(size_of_square/2), z);
            let back_left = welt_ctx.add_vertex(x+(i*size_of_square)-(size_of_square/2), y+(j*size_of_square)-(size_of_square/2), z);
            let color = "#000000";
            if (((i+j) % 2) === 0) {
                color = "#FFFFFF";
            }
            welt_ctx.add_floor([far_right, far_left, back_left, back_right], color);
        }
    }
};

add_checker_board(1000, 1000, 0);

function add_tree(x, y, z) {
    let bottom_near_left = welt_ctx.add_vertex(x, y, z);
    let bottom_near_right = welt_ctx.add_vertex(x-100, y, z);
    let bottom_far = welt_ctx.add_vertex(x-50, y+100, z);
    let top_near_left = welt_ctx.add_vertex(x, y, z-400);
    let top_near_right = welt_ctx.add_vertex(x-100, y, z-400);
    let top_far = welt_ctx.add_vertex(x-50, y+100, z-400);

    welt_ctx.add_surface([bottom_near_left, bottom_near_right, bottom_far], "#905020");
    welt_ctx.add_surface([top_near_left, top_near_right, top_far], "#905020");
    welt_ctx.add_surface([bottom_near_left, bottom_near_right, top_near_right, top_near_left], "#905020");
    welt_ctx.add_surface([bottom_near_left, bottom_far, top_far, top_near_left], "#905020");
    welt_ctx.add_surface([bottom_near_right, bottom_far, top_far, top_near_right], "#905020");
    
    let leaf_low_near_left = welt_ctx.add_vertex(x+100, y-100, z-400);
    let leaf_low_near_right = welt_ctx.add_vertex(x-200, y-100, z-400);
    let leaf_low_far = welt_ctx.add_vertex(x-150, y+200, z-400);
    let leaf_high = welt_ctx.add_vertex(x-50, y+50, z-800);

    welt_ctx.add_surface([leaf_low_far, leaf_low_near_left, leaf_low_near_right], "#00A000");
    welt_ctx.add_surface([leaf_high, leaf_low_near_left, leaf_low_near_right], "#00A000");
    welt_ctx.add_surface([leaf_low_far, leaf_high, leaf_low_near_right], "#00A000");
    welt_ctx.add_surface([leaf_low_far, leaf_low_near_left, leaf_high], "#00A000");
};

// add_tree(-200, 200, 0);
// add_tree(-50, 400, 0);

for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
        add_tree(-200-(i*500)-(Math.random()*500), 200+(j*500)+(Math.random()*500), 0);
    }
}

function add_gate(x, y, z) {
    let gate_left = welt_ctx.add_vertex(x-200, y+300, z);
    let gate_right = welt_ctx.add_vertex(x+200, y+300, z);
    let gate_top_left = welt_ctx.add_vertex(x-200, y+300, z-600);
    let gate_top_right = welt_ctx.add_vertex(x+200, y+300, z-600);
    let gate_back_left = welt_ctx.add_vertex(x-200, y-300, z);
    let gate_back_right = welt_ctx.add_vertex(x+200, y-300, z);
    let gate_back_top_left = welt_ctx.add_vertex(x-200, y-300, z-600);
    let gate_back_top_right = welt_ctx.add_vertex(x+200, y-300, z-600);

    let gate_far_left = welt_ctx.add_vertex(x-500, y+300, z);
    let gate_far_right = welt_ctx.add_vertex(x+500, y+300, z);
    let gate_far_top_left = welt_ctx.add_vertex(x-500, y+300, z-800);
    let gate_far_top_right = welt_ctx.add_vertex(x+500, y+300, z-800);
    let gate_far_back_left = welt_ctx.add_vertex(x-500, y-300, z);
    let gate_far_back_right = welt_ctx.add_vertex(x+500, y-300, z);
    let gate_far_back_top_left = welt_ctx.add_vertex(x-500, y-300, z-800);
    let gate_far_back_top_right = welt_ctx.add_vertex(x+500, y-300, z-800);

    welt_ctx.add_surface([gate_left, gate_top_left, gate_back_top_left, gate_back_left], "#505050");
    welt_ctx.add_surface([gate_right, gate_top_right, gate_back_top_right, gate_back_right], "#505050");
    welt_ctx.add_surface([gate_top_left, gate_top_right, gate_back_top_right, gate_back_top_left], "#505050");
    
    welt_ctx.add_surface([gate_left, gate_far_left, gate_far_top_left, gate_top_left], "#707070");
    welt_ctx.add_surface([gate_right, gate_far_right, gate_far_top_right, gate_top_right], "#707070");
    welt_ctx.add_surface([gate_top_left, gate_far_top_left, gate_far_top_right, gate_top_right], "#707070");
    welt_ctx.add_surface([gate_back_left, gate_far_back_left, gate_far_back_top_left, gate_back_top_left], "#707070");
    welt_ctx.add_surface([gate_back_right, gate_far_back_right, gate_far_back_top_right, gate_back_top_right], "#707070");
    welt_ctx.add_surface([gate_back_top_left, gate_far_back_top_left, gate_far_back_top_right, gate_back_top_right], "#707070");
    
    welt_ctx.add_surface([gate_far_left, gate_far_top_left, gate_far_back_top_left, gate_far_back_left], "#707070");
    welt_ctx.add_surface([gate_far_right, gate_far_top_right, gate_far_back_top_right, gate_far_back_right], "#707070");
    welt_ctx.add_surface([gate_far_top_left, gate_far_top_right, gate_far_back_top_right, gate_far_back_top_left], "#707070");
};
function add_wall(x, y, z) {
    let wall_left = welt_ctx.add_vertex(x-500, y+150, z);
    let wall_right = welt_ctx.add_vertex(x+500, y+150, z);
    let wall_top_left = welt_ctx.add_vertex(x-500, y+150, z-600);
    let wall_top_right = welt_ctx.add_vertex(x+500, y+150, z-600);
    let wall_back_left = welt_ctx.add_vertex(x-500, y-150, z);
    let wall_back_right = welt_ctx.add_vertex(x+500, y-150, z);
    let wall_back_top_left = welt_ctx.add_vertex(x-500, y-150, z-600);
    let wall_back_top_right = welt_ctx.add_vertex(x+500, y-150, z-600);
    
    welt_ctx.add_surface([wall_left, wall_top_left, wall_back_top_left, wall_back_left], "#707070");
    welt_ctx.add_surface([wall_right, wall_top_right, wall_back_top_right, wall_back_right], "#707070");
    welt_ctx.add_surface([wall_top_left, wall_top_right, wall_back_top_right, wall_back_top_left], "#707070");
    welt_ctx.add_surface([wall_left, wall_top_left, wall_top_right, wall_right], "#707070");
    welt_ctx.add_surface([wall_back_left, wall_back_top_left, wall_back_top_right, wall_back_right], "#707070");
};
function add_fort_front(x, y, z) {
    add_gate(x, y, z);
    add_wall(x-1000, y, z);
    add_wall(x-2000, y, z);
    add_wall(x+1000, y, z);
    add_wall(x+2000, y, z);
};

add_fort_front(-500, -2000, 0);

AddPrism(welt_ctx, new Vertex(1000, 2000, 0), 200, -200, [], { num_sides: 4, all_sides: true, color: "#505000" });
AddPrism(welt_ctx, new Vertex(2000, 2000, 0), 200, -300, [], { num_sides: 16, all_sides: true, color: "#505000" });
AddPrism(welt_ctx, new Vertex(2000, 1000, 0), 300, -200, [], { num_sides: 6, all_sides: true, color: "#505000" });

AddCube(welt_ctx, new Vertex(3000, 1000, 0), (Math.random()*200)+100, (Math.random()*200)+100, -((Math.random()*200)+100), [], { num_sides: 6, all_sides: true, color: "#505000" });
AddCube(welt_ctx, new Vertex(3000, 2000, 0), (Math.random()*200)+100, (Math.random()*200)+100, -((Math.random()*200)+100), [], { num_sides: 6, all_sides: true, color: "#505000" });
AddCube(welt_ctx, new Vertex(3000, 3000, 0), (Math.random()*200)+100, (Math.random()*200)+100, -((Math.random()*200)+100), [], { num_sides: 6, all_sides: true, color: "#505000" });


let move_speed = 12;
let rotate_speed = 0.017*2;

function handle_camera() {
    if (get_key_state("ArrowUp")) {
        // welt_ctx.camera.point.z -= 1;
        welt_ctx.camera.moveRelative(new Vertex(0, 0, -move_speed));
    }
    if (get_key_state("ArrowDown")) {
        // welt_ctx.camera.point.z += 1;
        welt_ctx.camera.moveRelative(new Vertex(0, 0, move_speed));
    }
    if (get_key_state("ArrowLeft")) {
        welt_ctx.camera.rotate(new Spherical_Vertex(0, rotate_speed, 0));
    }
    if (get_key_state("ArrowRight")) {
        welt_ctx.camera.rotate(new Spherical_Vertex(0, -rotate_speed, 0));
    }
    if (get_key_state("w")) {
        // welt_ctx.camera.point.y += 1;
        welt_ctx.camera.moveRelative(new Vertex(0, move_speed, 0));
    }
    if (get_key_state("s")) {
        // welt_ctx.camera.point.y -= 1;
        welt_ctx.camera.moveRelative(new Vertex(0, -move_speed, 0));
    }
    if (get_key_state("a")) {
        // welt_ctx.camera.point.x -= 1;
        welt_ctx.camera.moveRelative(new Vertex(-move_speed, 0, 0));
    }
    if (get_key_state("d")) {
        // welt_ctx.camera.point.x += 1;
        welt_ctx.camera.moveRelative(new Vertex(move_speed, 0, 0));
    }
    if (get_key_state("PageUp") || get_key_state("'")) {
        welt_ctx.camera.rotate(new Spherical_Vertex(0, 0, rotate_speed));
    }
    if (get_key_state("PageDown") || get_key_state("/")) {
        welt_ctx.camera.rotate(new Spherical_Vertex(0, 0, -rotate_speed));
    }
};

function render_loop() {
    handle_camera();

    welt_ctx.render(0, 0, width, height, m_ctx);

    m_ctx.fillStyle = "#000000";
    m_ctx.fillText("("+welt_ctx.camera.point.x+", "+welt_ctx.camera.point.y+", "+welt_ctx.camera.point.z+")", 20, 20);
    m_ctx.fillText("("+welt_ctx.camera.angle.theta+", "+welt_ctx.camera.angle.phi+")", 20, 40);
};

setInterval(render_loop, 16);