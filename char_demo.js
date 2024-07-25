
const m_canv = document.getElementById("m_canv");
const m_ctx = m_canv.getContext("2d");
const width = 1000;
const height = 600;
m_canv.width = width;
m_canv.height = height;

const welt_ctx = new WeltContext();


welt_ctx.set_floors([1000000, 0, -1000, -2000, -3000, -4000, -5000, -1000000]);
let person_origin = new Vertex(-100, -100, 0);
let person_extent = new Vertex(200, 200, 300);
welt_ctx.setup_third_person([
    new Vertex(person_origin.x, person_origin.y, person_origin.z),
    new Vertex(person_origin.x+person_extent.x, person_origin.y, person_origin.z),
    new Vertex(person_origin.x, person_origin.y+person_extent.y, person_origin.z),
    new Vertex(person_origin.x+person_extent.x, person_origin.y+person_extent.y, person_origin.z),
    new Vertex(person_origin.x, person_origin.y, person_origin.z+person_extent.z),
    new Vertex(person_origin.x+person_extent.x, person_origin.y, person_origin.z+person_extent.z),
    new Vertex(person_origin.x, person_origin.y+person_extent.y, person_origin.z+person_extent.z),
    new Vertex(person_origin.x+person_extent.x, person_origin.y+person_extent.y, person_origin.z+person_extent.z),
], [
    new Surface([0, 1, 3, 2], "#700000", Surface.surface),
    new Surface([4, 5, 7, 6], "#700000", Surface.surface),
    new Surface([0, 1, 5, 4], "#700000", Surface.surface),
    new Surface([2, 3, 7, 6], "#700000", Surface.surface),
    new Surface([0, 2, 6, 4], "#700000", Surface.surface),
    new Surface([1, 3, 7, 5], "#700000", Surface.surface)
]);


// Low Grass
AddTiledRect(welt_ctx, new Vertex(-7500, -10000, 0), 10000, 20000, 10, 20, { as_floor: true, color: "#005000" });
// High Grass
AddTiledRect(welt_ctx, new Vertex(2500, -10000, -1000), 10000, 20000, 10, 20, { as_floor: true, color: "#005000" });

function AddHouse(x, y, z, width, length, height, roof_height) {
    AddCube(welt_ctx, new Vertex(x, y, z), width, 50, -height, [], { all_sides: true, color: "#503812" });
    AddCube(welt_ctx, new Vertex(x, y+50, z), 50, length, -height, [], { all_sides: true, color: "#503812" });
    AddCube(welt_ctx, new Vertex(x+50, y+length, z), width, 50, -height, [], { all_sides: true, color: "#503812" });
    AddCube(welt_ctx, new Vertex(x+width, y, z), 50, length*0.5, -height, [], { all_sides: true, color: "#503812" });
    AddCube(welt_ctx, new Vertex(x+width, y+(length*0.75), z), 50, length*0.25, -height, [], { all_sides: true, color: "#503812" });
    AddCube(welt_ctx, new Vertex(x+width, y+(length*0.5), z+(-height*0.7)), 50, length*0.25, -height*0.3, [], { all_sides: true, color: "#503812" });

    AddGable(welt_ctx, new Vertex(x, y, z-height), width+50, length+50, -roof_height, [true, true, false, true, true], { color: "#505000" });
};

// First Houses
AddHouse(-4000, 0, 0, 2000, 2000, 1000, 1000);
AddHouse(-4000, -4000, 0, 2000, 2000, 1000, 1000);

function AddWall(start_x, start_y, start_z, width, length, height, options) {
    for (let x = start_x; x < start_x+width; x += 1000) {
        let final_z = 0;
        for (let y = start_y; y < start_y+length; y += 1000) {
            for (let z = start_z; z > start_z-height; z -= 1000) {
                if (z-1000 > start_z-height) {
                    AddCube(welt_ctx, new Vertex(x, y, z), 1000, 1000, -1000, [], { all_sides: true, color: "#505050" });
                }else {
                    AddCube(welt_ctx, new Vertex(x, y, z), 500, 500, -1000, [], { all_sides: true, color: "#505050" });
                    AddCube(welt_ctx, new Vertex(x+500, y, z), 500, 500, -1000, [], { all_sides: true, color: "#505050" });
                    AddCube(welt_ctx, new Vertex(x, y+500, z), 500, 500, -1000, [], { all_sides: true, color: "#505050" });
                    AddCube(welt_ctx, new Vertex(x+500, y+500, z), 500, 500, -1000, [], { all_sides: true, color: "#505050" });
                }
                final_z = z;
            }
            if (options.front_battlements) {
                AddCube(welt_ctx, new Vertex(x-300, y, final_z-1000), 300, 500, -400, [], { all_sides: true, color: "#505050" });
                AddCube(welt_ctx, new Vertex(x-300, y+500, final_z-1000), 300, 500, -200, [], { all_sides: true, color: "#505050" });
                AddRamp(welt_ctx, new Vertex(x-300, y, final_z-1000), 500, 300, -500, { face_back: true, color: "#505050" });
                AddRamp(welt_ctx, new Vertex(x-300, y+500, final_z-1000), 500, 300, -500, { face_back: true, color: "#505050" });
            }
            if (options.back_battlements) {
                AddCube(welt_ctx, new Vertex(x+width, y, final_z-1000), 300, 500, -400, [], { all_sides: true, color: "#505050" });
                AddCube(welt_ctx, new Vertex(x+width, y+500, final_z-1000), 300, 500, -200, [], { all_sides: true, color: "#505050" });
                AddRamp(welt_ctx, new Vertex(x+width, y, final_z-1000), 500, 300, -500, { face_front: true, color: "#505050" });
                AddRamp(welt_ctx, new Vertex(x+width, y+500, final_z-1000), 500, 300, -500, { face_front: true, color: "#505050" });
            }
            if (options.left_battlements) {
                AddCube(welt_ctx, new Vertex(x, y-300, final_z-1000), 500, 300, -400, [], { all_sides: true, color: "#505050" });
                AddCube(welt_ctx, new Vertex(x+500, y-300, final_z-1000), 500, 300, -200, [], { all_sides: true, color: "#505050" });
                AddRamp(welt_ctx, new Vertex(x, y-300, final_z-1000), 500, 300, -500, { face_right: true, color: "#505050" });
                AddRamp(welt_ctx, new Vertex(x+500, y-300, final_z-1000), 500, 300, -500, { face_right: true, color: "#505050" });
            }
            if (options.right_battlements) {
                AddCube(welt_ctx, new Vertex(x, y+length, final_z-1000), 500, 300, -400, [], { all_sides: true, color: "#505050" });
                AddCube(welt_ctx, new Vertex(x+500, y+length, final_z-1000), 500, 300, -200, [], { all_sides: true, color: "#505050" });
                AddRamp(welt_ctx, new Vertex(x, y+length, final_z-1000), 500, 300, -500, { face_left: true, color: "#505050" });
                AddRamp(welt_ctx, new Vertex(x+500, y+length, final_z-1000), 500, 300, -500, { face_left: true, color: "#505050" });
            }
        }
    }
};
// Front Wall
AddWall(-7000, -6000, 0, 1000, 13000, 3000, { front_battlements: true });
AddRamp(welt_ctx, new Vertex(-6000, 0, 0), 500, 1000, 1000, { face_right: true, color: "#505050" });
AddRamp(welt_ctx, new Vertex(-6000, 1000, -1000), 500, 1000, 1000, { face_right: true, color: "#505050" });
AddRamp(welt_ctx, new Vertex(-6000, 2000, -2000), 500, 1000, 1000, { face_right: true, color: "#505050" });
for (let y = 1000; y < 4000; y += 1000) {
    for (let z = 0; y+z >= 1000; z -= 1000) {
        AddCube(welt_ctx, new Vertex(-6000, y, z), 500, 1000, -1000, [], { all_sides: true, color: "#505050" });
    }
}
// Right Wall
AddWall(-5500, 7500, 0, 8000, 1000, 3000, { right_battlements: true });
AddWall(2500, 7500, -1000, 4000, 1000, 3000, { right_battlements: true });
AddRamp(welt_ctx, new Vertex(1500, 7500, -3000), 1000, 1000, 1000, { face_back: true, color: "#505050" });

function AddTower(x, y, z, width, length, height, options) {
    // AddCube(welt_ctx, new Vertex(x+50, y+50, z), (width*0.5)-50, (length*0.5)-50, -50, [], { all_sides: true, color: "#404040" });
    // AddCube(welt_ctx, new Vertex(x+50, y+(length*0.5), z), (width*0.5)-50, (length*0.5)-50, -50, [], { all_sides: true, color: "#404040" });
    // AddCube(welt_ctx, new Vertex(x+(width*0.5), y+50, z), (width*0.5)-50, (length*0.5)-50, -50, [], { all_sides: true, color: "#404040" });
    // AddCube(welt_ctx, new Vertex(x+(width*0.7), y+(length*0.5), z), (width*0.3)-50, (length*0.2)-50, -50, [], { all_sides: true, color: "#404040" });
    // AddCube(welt_ctx, new Vertex(x+(width*0.5), y+(length*0.5), z), (width*0.2), (length*0.5)-50, -50, [], { all_sides: true, color: "#404040" });
    if (options.with_floor) {
        AddRect(welt_ctx, new Vertex(x+50, y+50, z-1), (width*0.5)-50, (length*0.5)-50, { as_floor: true, color: "#404040" });
        AddRect(welt_ctx, new Vertex(x+50, y+(length*0.5), z-1), (width*0.5)-50, (length*0.5), { as_floor: true, color: "#404040" });
        AddRect(welt_ctx, new Vertex(x+(width*0.5), y+50, z-1), (width*0.5), (length*0.5)-50, { as_floor: true, color: "#404040" });
        AddRect(welt_ctx, new Vertex(x+(width*0.7), y+(length*0.5), z-1), (width*0.3), (length*0.2), { as_floor: true, color: "#404040" });
        AddRect(welt_ctx, new Vertex(x+(width*0.5), y+(length*0.5), z-1), (width*0.2), (length*0.5), { as_floor: true, color: "#404040" });
    }
    AddLadder(welt_ctx, new Vertex(x+(width*0.7), y+(length*0.7), z), 1000, { color: "#503812" });
    // AddCube(welt_ctx, new Vertex(x+(width*0.7), y+(length*0.7), z), (width*0.3), (length*0.3), -500, [], { all_sides: true, color: "#404040" });
    if (options.left_side_door) {
        AddCube(welt_ctx, new Vertex(x, y, z), width*0.375, 50, -height, [], { all_sides: true, color: "#404040" });
        AddCube(welt_ctx, new Vertex(x+(width*0.375), y, z-(height*0.7)), width*0.25, 50, -height*0.3, [], { all_sides: true, color: "#404040" });
        AddCube(welt_ctx, new Vertex(x+(width*0.625), y, z), width*0.375, 50, -height, [], { all_sides: true, color: "#404040" });
    }else {
        AddCube(welt_ctx, new Vertex(x, y, z), width*0.5, 50, -height, [], { all_sides: true, color: "#404040" });
        AddCube(welt_ctx, new Vertex(x+(width*0.5), y, z), width*0.5, 50, -height, [], { all_sides: true, color: "#404040" });
    }
    AddCube(welt_ctx, new Vertex(x, y+50, z), 50, length*0.5, -height, [], { all_sides: true, color: "#404040" });
    AddCube(welt_ctx, new Vertex(x, y+50+(length*0.5), z), 50, length*0.5, -height, [], { all_sides: true, color: "#404040" });
    AddCube(welt_ctx, new Vertex(x+50, y+length, z), width*0.5, 50, -height, [], { all_sides: true, color: "#404040" });
    AddCube(welt_ctx, new Vertex(x+50+(width*0.5), y+length, z), width*0.5, 50, -height, [], { all_sides: true, color: "#404040" });
    if (options.back_door) {
        AddCube(welt_ctx, new Vertex(x+width, y+(length*0.25), z), 50, length*0.75, -height, [], { all_sides: true, color: "#404040" });
        AddCube(welt_ctx, new Vertex(x+width, y, z+(-height*0.7)), 50, length*0.25, -height*0.3, [], { all_sides: true, color: "#404040" });
    }else if (options.back_side_door) {
        AddCube(welt_ctx, new Vertex(x+width, y, z), 50, length*0.375, -height, [], { all_sides: true, color: "#404040" });
        AddCube(welt_ctx, new Vertex(x+width, y+(length*0.375), z+(-height*0.7)), 50, length*0.25, -height*0.3, [], { all_sides: true, color: "#404040" });
        AddCube(welt_ctx, new Vertex(x+width, y+(length*0.625), z), 50, length*0.375, -height, [], { all_sides: true, color: "#404040" });
    }else {
        AddCube(welt_ctx, new Vertex(x+width, y, z), 50, length*0.5, -height, [], { all_sides: true, color: "#404040" });
        AddCube(welt_ctx, new Vertex(x+width, y+(length*0.5), z), 50, length*0.5, -height, [], { all_sides: true, color: "#404040" });
    }
};
function AddTowerTopper(x, y, z, width, length, height, options) {
    AddRect(welt_ctx, new Vertex(x+50, y+50, z-1), (width*0.5)-50, (length*0.5)-50, { as_floor: true, color: "#404040" });
    AddRect(welt_ctx, new Vertex(x+50, y+(length*0.5), z-1), (width*0.5)-50, (length*0.5), { as_floor: true, color: "#404040" });
    AddRect(welt_ctx, new Vertex(x+(width*0.5), y+50, z-1), (width*0.5), (length*0.5)-50, { as_floor: true, color: "#404040" });
    AddRect(welt_ctx, new Vertex(x+(width*0.7), y+(length*0.5), z-1), (width*0.3), (length*0.2), { as_floor: true, color: "#404040" });
    AddRect(welt_ctx, new Vertex(x+(width*0.5), y+(length*0.5), z-1), (width*0.2), (length*0.5), { as_floor: true, color: "#404040" });
    
    for (let i = 0; i < 6; i += 2) {
        AddCube(welt_ctx, new Vertex(x+(width*(-0.2+(i*0.2))), y-(length*0.2), z), width*0.2, (length*0.2), -400, [], { all_sides: true, color: "#404040" });
        AddCube(welt_ctx, new Vertex(x+(width*(-0.2+((i+1)*0.2))), y-(length*0.2), z), width*0.2, (length*0.2), -200, [], { all_sides: true, color: "#404040" });
    }
    for (let i = 0; i < 6; i += 2) {
        AddCube(welt_ctx, new Vertex(x-(width*0.2), y+(length*(-0.2+((i+2)*0.2))), z), width*0.2, (length*0.2), -400, [], { all_sides: true, color: "#404040" });
        AddCube(welt_ctx, new Vertex(x-(width*0.2), y+(length*(-0.2+((i+1)*0.2))), z), width*0.2, (length*0.2), -200, [], { all_sides: true, color: "#404040" });
    }
    for (let i = 0; i < 6; i += 2) {
        AddCube(welt_ctx, new Vertex(x+(width*(-0.2+((i+2)*0.2))), y+(length*1), z), width*0.2, (length*0.2), -400, [], { all_sides: true, color: "#404040" });
        AddCube(welt_ctx, new Vertex(x+(width*(-0.2+((i+1)*0.2))), y+(length*1), z), width*0.2, (length*0.2), -200, [], { all_sides: true, color: "#404040" });
    }
    for (let i = 0; i < 6; i += 2) {
        AddCube(welt_ctx, new Vertex(x+(width*1), y+(length*(-0.2+(i*0.2))), z), width*0.2, (length*0.2), -400, [], { all_sides: true, color: "#404040" });
        AddCube(welt_ctx, new Vertex(x+(width*1), y+(length*(-0.2+((i+1)*0.2))), z), width*0.2, (length*0.2), -200, [], { all_sides: true, color: "#404040" });
    }

    AddRamp(welt_ctx, new Vertex(x, y-(length*0.2), -5000), width*0.5, length*0.2, -500, { face_right: true, color: "#404040" });
    AddRamp(welt_ctx, new Vertex(x+(width*0.5), y-(length*0.2), -5000), width*0.5, length*0.2, -500, { face_right: true, color: "#404040" });
    AddRamp(welt_ctx, new Vertex(x, y+length, -5000), width*0.5, length*0.2, -500, { face_left: true, color: "#404040" });
    AddRamp(welt_ctx, new Vertex(x+(width*0.5), y+length, -5000), width*0.5, length*0.2, -500, { face_left: true, color: "#404040" });
    AddRamp(welt_ctx, new Vertex(x-(length*0.2), y, -5000), width*0.2, length*0.5, -500, { face_back: true, color: "#404040" });
    AddRamp(welt_ctx, new Vertex(x-(length*0.2), y+(width*0.5), -5000), width*0.2, length*0.5, -500, { face_back: true, color: "#404040" });
    AddRamp(welt_ctx, new Vertex(x+length, y, -5000), width*0.2, length*0.5, -500, { face_front: true, color: "#404040" });
    AddRamp(welt_ctx, new Vertex(x+length, y+(width*0.5), -5000), width*0.2, length*0.5, -500, { face_front: true, color: "#404040" });
};
// Front Right Tower
AddTower(-7550, 7000, 0, 2000, 2000, 1000, { back_door: true });
AddTower(-7550, 7000, -1000, 2000, 2000, 1000, {});
AddTower(-7550, 7000, -2000, 2000, 2000, 1000, {});
AddTower(-7550, 7000, -3000, 2000, 2000, 1000, { left_side_door: true, back_side_door: true, with_floor: true });
AddTower(-7550, 7000, -4000, 2000, 2000, 500, {});
AddTowerTopper(-7550, 7000, -5000, 2000, 2000, 1000, {});

// Stairs
for (let i = 100; i <= 2000; i += 100) {
    AddCube(welt_ctx, new Vertex(400+i, 0+(Math.log(i)*100), 0), 100, 3000-(Math.log(i)*200), -i/2, [], { all_sides: true, color: "#505050" });
}
// Retaining Wall
AddCube(welt_ctx, new Vertex(2300, 2250, 0), 200, 750, -1000, [], { all_sides: true, color: "#505050" });
for (let y = 3000; y < 7000; y += 1000) {
    AddCube(welt_ctx, new Vertex(2300, y, 0), 200, 1000, -1000, [], { all_sides: true, color: "#505050" });
}
AddCube(welt_ctx, new Vertex(2300, 7000, 0), 200, 500, -1000, [], { all_sides: true, color: "#505050" });
for (let y = -5250; y < 0; y += 1000) {
    AddCube(welt_ctx, new Vertex(2300, y, 0), 200, 1000, -1000, [], { all_sides: true, color: "#505050" });
}



let move_speed = 20;
let rotate_speed = 0.017*2;
welt_ctx.camera.physics.set_physics(25, 0.75);
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
        // welt_ctx.horizon += 10;
    }
    if (get_key_state("PageDown") || get_key_state("/")) {
        welt_ctx.rotateCamera(new Spherical_Vertex(0, 0, -rotate_speed));
        // welt_ctx.horizon -= 10;
    }
    if (get_key_state("Shift")) {
        welt_ctx.rotateCamera(new Spherical_Vertex(0, 0, -welt_ctx.camera.angle.phi));
    }
    if (move_vector.x !== 0 && move_vector.y !== 0) {
        move_vector.scale(slant_scale);
    }
    if (move_vector.x !== 0 || move_vector.y !== 0) {
        welt_ctx.moveCameraRelative(move_vector);
    }

    if (isGamepadConnected()) {
        if (get_button_state("A")) {
            if (welt_ctx.camera.physics.canJump()) {
                welt_ctx.camera.physics.jump();
            }
        }
        let rotate_vector = new Spherical_Vertex(0, rotate_speed*-get_axis_state("RightX", 0.1), 0);
        if (rotate_vector.theta !== 0) {
            welt_ctx.rotateCamera(rotate_vector);
        }
        let move_vector = new Vertex(move_speed*get_axis_state("LeftX", 0.1), move_speed*-get_axis_state("LeftY", 0.1), 0);
        if (move_vector.x !== 0 || move_vector.y !== 0) {
            welt_ctx.moveCameraRelative(move_vector);
        }
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

// welt_ctx.camera.moveAbsolute(new Vertex(-4000, 6000, 0));