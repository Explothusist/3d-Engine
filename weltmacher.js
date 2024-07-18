
class Spherical_Vertex {
    r;
    theta;
    phi;

    constructor(r, theta, phi) {
        this.r = r;
        this.theta = theta;
        this.phi = phi;
    }
    translate(point) {
        this.r += point.r;
        this.theta += point.theta;
        this.phi += point.phi;
    }
    within_bounds() {
        this.theta = (this.theta+(Math.PI*2)) % (Math.PI*2);
        this.phi = Math.min(Math.PI, Math.max(this.phi, 0));
    }
    invert() {
        this.r *= -1;
        this.theta *= -1;
        this.phi *= -1;
    }
    to_cartesean() {
        let z = this.r*Math.cos(this.phi);
        let x = this.r*Math.cos(this.theta)*Math.sin(this.phi);
        let y = this.r*Math.sin(this.theta)*Math.sin(this.phi);
        return new Vertex(x, y, z);
    }
    copy() {
        return new Spherical_Vertex(this.r, this.theta, this.phi);
    }

    // to_xy() {
    //     let x = this.r*(Math.sin(this.theta));
    //     let y = this.r*(Math.sin(this.phi));
    //     return {x: x, y: y, r: this.r};
    // }

    debug_text(txt, x, y, ctx) {
        ctx.fillStyle = "rgb(0, 0, 0)";
        ctx.fillText(txt+"("+this.r+", "+this.theta+", "+this.phi+")", x, y);
    }
};

class Phi_Shift_Spherical_Vertex extends Spherical_Vertex {

    constructor(r, theta, phi) {
        super(r, theta, phi);
    }
    within_bounds() {
        this.theta = (this.theta+(Math.PI*2)) % (Math.PI*2);
        // If it actually reaches pi/2, odd math occurs
        this.phi = Math.min((Math.PI/2)*0.99, Math.max(this.phi, (-Math.PI/2)*0.99));
    }
};

class Vertex {
    x;
    y;
    z;

    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    translate(point) {
        this.x += point.x;
        this.y += point.y;
        this.z += point.z;
    }
    invert() {
        this.x *= -1;
        this.y *= -1;
        this.z *= -1;
    }
    scale(point) {
        this.x *= point.x;
        this.y *= point.y;
        this.z *= point.z;
    }
    to_spherical() {
        let r = Math.sqrt((this.x*this.x)+(this.y*this.y)+(this.z*this.z));
        let theta = Math.atan2(this.y, this.x);
        let phi = Math.acos(this.z/r);
        return new Spherical_Vertex(r, theta, phi);
    }
    copy() {
        return new Vertex(this.x, this.y, this.z);
    }

    add_perspective(/*los, */focus) {
        let x = this.x;
        let y = this.y;
        let z = this.z;
        // let multiplier = (vanish-this.y)/vanish;
        // let los_mult = (vanish-los)/vanish;
        // multiplier = Math.max(los_mult, Math.min(1, multiplier));
        // // multiplier *= multiplier;
        // this.x = x*multiplier;
        // this.y = z*multiplier;
        // this.z = y;
        
        y = Math.max(y, 0);
        let point = new Vertex_2d(x, z);
        point = point.to_polar();
        this.angular_diameter = 2*Math.atan(point.r/(2*y));
        point.r = this.angular_diameter*focus;
        point = point.to_cartesean();
        this.x = point.x;
        this.y = point.y;
        this.z = y;
    }

    debug_text(txt, x, y, ctx) {
        ctx.fillStyle = "rgb(0, 0, 0)";
        ctx.fillText(txt+"("+this.x+", "+this.y+", "+this.z+")", x, y);
    }
};

class Vertex_2d {
    x;
    y;

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    translate(point) {
        this.x += point.x;
        this.y += point.y;
    }
    invert() {
        this.x *= -1;
        this.y *= -1;
    }
    scale(point) {
        this.x *= point.x;
        this.y *= point.y;
    }
    to_polar() {
        let r = Math.sqrt((this.x*this.x)+(this.y*this.y));
        let theta = Math.atan2(this.y, this.x);
        return new Polar_Vertex(r, theta);
    }
    copy() {
        return new Vertex_2d(this.x, this.y);
    }

    debug_text(txt, x, y, ctx) {
        ctx.fillStyle = "rgb(0, 0, 0)";
        ctx.fillText(txt+"("+this.x+", "+this.y+")", x, y);
    }
};

class Polar_Vertex {
    r;
    theta;

    constructor(r, theta) {
        this.r = r;
        this.theta = theta;
    }
    translate(point) {
        this.r += point.r;
        this.theta += point.theta;
    }
    within_bounds() {
        this.theta = (this.theta+(Math.PI*2)) % (Math.PI*2);
    }
    invert() {
        this.r *= -1;
        this.theta *= -1;
    }
    to_cartesean() {
        let x = this.r*Math.cos(this.theta);
        let y = this.r*Math.sin(this.theta);
        return new Vertex_2d(x, y);
    }
    copy() {
        return new Polar_Vertex(this.r, this.theta);
    }

    debug_text(txt, x, y, ctx) {
        ctx.fillStyle = "rgb(0, 0, 0)";
        ctx.fillText(txt+"("+this.r+", "+this.theta+")", x, y);
    }
};


class Surface {
    vertices = [];
    color;

    constructor(vertices, color) {
        // vertices is a list of the indexes of the vertices it is between
        this.vertices = vertices;
        this.color = color;
    }
};

class Camera {
    point;
    angle;

    constructor(x, y, z, theta, phi) {
        this.point = new Vertex(x, y, z);
        this.angle = new Phi_Shift_Spherical_Vertex(0, theta, phi);
    }

    moveFullRelative(vector) {
        // Uses Phi

        // let trans_point = this.point.to_spherical();
        // let invert_angle = this.angle.copy();
        // invert_angle.invert();
        // trans_point.translate(invert_angle);
        // trans_point = trans_point.to_cartesean();
        // trans_point.translate(vector);
        // trans_point = trans_point.to_spherical();
        // trans_point.translate(this.angle);
        // trans_point = trans_point.to_cartesean();
        // this.point = trans_point;

        let angled_vector = vector.copy();
        angled_vector = angled_vector.to_spherical();
        angled_vector.translate(this.angle);
        angled_vector = angled_vector.to_cartesean();
        this.point.translate(angled_vector);
    }
    moveRelative(vector) {
        // Ignores Phi

        // let trans_point = this.point.to_spherical();
        // let invert_angle = new Spherical_Vertex(0, this.angle.theta, 0);
        // console.log(this.angle, invert_angle);
        // invert_angle.invert();
        // trans_point.translate(invert_angle);
        // trans_point = trans_point.to_cartesean();
        // trans_point.translate(vector);
        // trans_point = trans_point.to_spherical();
        // trans_point.translate(this.angle);
        // trans_point = trans_point.to_cartesean();
        // console.log(this.point, trans_point);
        // this.point = trans_point;
        
        let angled_vector = vector.copy();
        angled_vector = angled_vector.to_spherical();
        angled_vector.translate(new Spherical_Vertex(0, this.angle.theta, 0));
        angled_vector = angled_vector.to_cartesean();
        this.point.translate(angled_vector);
    }
    moveAbsolute(vector) {
        this.point.translate(vector);
    }
    rotate(vector) {
        this.angle.translate(vector);
        this.angle.within_bounds();
    }
}

class WeltContext {
    vertices = [];
    surfaces = [];
    floor_surfaces = [];
    camera;
    light;
    // vanish = 10000;
    // los = 6000;
    distinguishable_size = 0.0003; // 0.0003 rad = 1 arcminute = how small an object humans can make out
    focus = 1000; // Distance at which objects are x pixels large, x being size in code

    constructor() {
        // this.camera = new Camera(0, -400, 0, 0, 0);
        this.camera = new Camera(0, 0, -300, 0, 0);
    }
    reset_context() {
        // Clears the entire screen
        this.vertices = [];
        this.surfaces = [];
    }

    add_vertex(x, y, z) {
        // Makes a new vertex and returns the index of that vertex
        this.vertices.push(new Vertex(x, y, z));
        return this.vertices.length-1;
    }
    add_surface(vertices, color) {
        this.surfaces.push(new Surface(vertices, color));
    }
    add_floor(vertices, color) {
        this.floor_surfaces.push(new Surface(vertices, color));
    }

    render(x, y, width, height, ctx) {
        ctx.fillStyle = "#C0C0C0";
        ctx.fillRect(x, y, width, height);
        
        let center_x = Math.floor(x+(width/2));
        let center_y = Math.floor(y+(height/2));

        let cam_point = this.camera.point.copy();
        cam_point.invert();
        let cam_angle = this.camera.angle.copy();
        cam_angle.invert();
        let vertex_positions = [];
        for (let i in this.vertices) {
            let vert = this.vertices[i].copy();
            // vert.debug_text("start: ", 50, 100+(i*150), ctx);
            // Translates so camera point is origin
            vert.translate(cam_point);
            // vert.debug_text("translate: ", 50, 120+(i*150), ctx);
            vert = vert.to_spherical();
            // vert.debug_text("spherical: ", 50, 140+(i*150), ctx);
            // Rotates so camera angle is origin
            vert.translate(cam_angle);
            // vert.debug_text("rotate: ", 50, 160+(i*150), ctx);
            // If any math is wrong, it is probably this math
            // I was right! Now maybe it is correct
            vert = vert.to_cartesean();
            // vert.debug_text("cartesean: ", 50, 180+(i*150), ctx);
            vert.add_perspective(/*this.distinguishable_size, */this.focus);
            // vert.debug_text("perspective: ", 50, 200+(i*150), ctx);
            vertex_positions.push(vert);
        }

        // console.log(vertex_positions);

        ctx.fillStyle = "#000000";
        for (let vertex of vertex_positions) {
            ctx.fillRect(center_x+vertex.x, center_y+vertex.y, 1, 1);
        }

        for (let surface of this.floor_surfaces) {
            ctx.fillStyle = surface.color;
            ctx.beginPath();
            ctx.moveTo(center_x+vertex_positions[surface.vertices[0]].x, center_y+vertex_positions[surface.vertices[0]].y);
            for (let i = 1; i < surface.vertices.length; i++) {
                ctx.lineTo(center_x+vertex_positions[surface.vertices[i]].x, center_y+vertex_positions[surface.vertices[i]].y);
            }
            ctx.closePath();
            ctx.stroke();
            ctx.fill();
        }

        let surfaces_sorted = [];
        for (let i in this.surfaces) {
            let surface = this.surfaces[i];
            let average_dist = 0;
            // let min_dist = this.los;
            let one_on_screen = false;
            let one_on_screen_x = false;
            let offscreen_posx = false;
            let offscreen_negx = false;
            let offscreen_posy = false;
            let offscreen_negy = false;
            for (let vert_index of surface.vertices) {
                average_dist += vertex_positions[vert_index].z;
                // min_dist = Math.min(vertex_positions[vert_index].z, min_dist);
                if (vertex_positions[vert_index].z > 0 && vertex_positions[vert_index].angular_diameter > this.distinguishable_size) {
                    one_on_screen = true;
                }
                if (vertex_positions[vert_index].x > -(width/2) && vertex_positions[vert_index].x < (width/2)
                    && vertex_positions[vert_index].y > -(height/2) && vertex_positions[vert_index].y < (height/2)) {
                    one_on_screen_x = true;
                }else {
                    if (vertex_positions[vert_index].x < -(width/2)) {
                        offscreen_negx = true;
                    }
                    if (vertex_positions[vert_index].x > (width/2)) {
                        offscreen_posx = true;
                    }
                    if (vertex_positions[vert_index].y < -(height/2)) {
                        offscreen_negy = true;
                    }
                    if (vertex_positions[vert_index].y > (height/2)) {
                        offscreen_posy = true;
                    }
                }
            }
            if ((offscreen_negx+offscreen_posx) === 2 || (offscreen_negy+offscreen_posy) === 2) {
                one_on_screen_x = true;
            }
            average_dist /= surface.vertices.length;
            if (one_on_screen && one_on_screen_x) {
                surfaces_sorted.push({index: i, dist: average_dist});
                // surfaces_sorted.push({index: i, dist: min_dist});
            }
        }

        surfaces_sorted.sort((a,b) => b.dist-a.dist);

        for (let surf_index of surfaces_sorted) {
            let surface = this.surfaces[surf_index.index];
            ctx.fillStyle = surface.color;
            ctx.beginPath();
            ctx.moveTo(center_x+vertex_positions[surface.vertices[0]].x, center_y+vertex_positions[surface.vertices[0]].y);
            for (let i = 1; i < surface.vertices.length; i++) {
                ctx.lineTo(center_x+vertex_positions[surface.vertices[i]].x, center_y+vertex_positions[surface.vertices[i]].y);
            }
            ctx.closePath();
            ctx.stroke();
            ctx.fill();
        }
    }
};


function AddPrism(welt_ctx, point, radius, height, sides, options) {
    // point is bottom, back, left
    // sides is array of booleans in the form:
    // [top, bottom, side1 (back side (x, z)), side2 (clockwise from side1), ...]
    // options are num_sides (int), from_spherical (bool), as_floor (bool), color (color), all_sides (bool)
    if (options.from_spherical) {
        point = point.to_cartesean();
    }
    let num_sides = options.num_sides || 4;
    let color = options.color || "#000000";
    let center_to_corner = Math.sqrt(1+Math.pow((Math.tan(Math.PI/num_sides)), 2))*radius;
    let corner_angle = (2*Math.PI)/num_sides;
    let center_x = point.x+(radius);
    let center_y = point.y+(radius);

    if (options.all_sides) {
        sides = [true, true];
        for (let i = 0; i < num_sides; i++) {
            sides.push(true);
        }
    }

    let corners = [];
    let top_corners = [];
    for (let i = 0; i < num_sides; i++) {
        let polar = new Polar_Vertex(center_to_corner, corner_angle*i);
        polar = polar.to_cartesean();
        corners.push(welt_ctx.add_vertex(center_x+polar.x, center_y+polar.y, point.z));
        top_corners.push(welt_ctx.add_vertex(center_x+polar.x, center_y+polar.y, point.z+height));
    }

    if (sides[0]) {
        if (!options.as_floor) {
            welt_ctx.add_surface(top_corners, color);
        }else {
            welt_ctx.add_floor(top_corners, color);
        }
    }
    if (sides[1]) {
        if (!options.as_floor) {
            welt_ctx.add_surface(corners, color);
        }else {
            welt_ctx.add_floor(corners, color);
        }
    }
    for (let i = 0; i < num_sides; i++) {
        if (sides[i+2]) {
            if (!options.as_floor) {
                welt_ctx.add_surface([corners[i], top_corners[i], top_corners[(i+1) % num_sides], corners[(i+1) % num_sides]], color);
            }else {
                welt_ctx.add_floor([corners[i], top_corners[i], top_corners[(i+1) % num_sides], corners[(i+1) % sides]], color);
            }
        }
    }
};

function AddCube(welt_ctx, point, width, length, height, sides, options) {
    // point is bottom, back, left
    // sides is array of booleans in the form:
    // [top, bottom, side1 (back side (x, z)), side2 (clockwise from side1), ...]
    // options are from_spherical (bool), as_floor (bool), color (color), all_sides (bool)
    if (options.from_spherical) {
        point = point.to_cartesean();
    }
    let color = options.color || "#000000";

    if (options.all_sides) {
        sides = [true, true, true, true, true, true];
    }

    let bottom_back_left = welt_ctx.add_vertex(point.x, point.y, point.z);
    let bottom_back_right = welt_ctx.add_vertex(point.x+width, point.y, point.z);
    let bottom_front_left = welt_ctx.add_vertex(point.x, point.y+length, point.z);
    let bottom_front_right = welt_ctx.add_vertex(point.x+width, point.y+length, point.z);
    let top_back_left = welt_ctx.add_vertex(point.x, point.y, point.z+height);
    let top_back_right = welt_ctx.add_vertex(point.x+width, point.y, point.z+height);
    let top_front_left = welt_ctx.add_vertex(point.x, point.y+length, point.z+height);
    let top_front_right = welt_ctx.add_vertex(point.x+width, point.y+length, point.z+height);

    if (sides[0]) {
        if (!options.as_floor) {
            welt_ctx.add_surface([top_back_left, top_back_right, top_front_right, top_front_left], color);
        }else {
            welt_ctx.add_floor([top_back_left, top_back_right, top_front_right, top_front_left], color);
        }
    }
    if (sides[1]) {
        if (!options.as_floor) {
            welt_ctx.add_surface([bottom_back_left, bottom_back_right, bottom_front_right, bottom_front_left], color);
        }else {
            welt_ctx.add_floor([bottom_back_left, bottom_back_right, bottom_front_right, bottom_front_left], color);
        }
    }
    if (sides[2]) {
        if (!options.as_floor) {
            welt_ctx.add_surface([bottom_back_left, bottom_back_right, top_back_right, top_back_left], color);
        }else {
            welt_ctx.add_floor([bottom_back_left, bottom_back_right, top_back_right, top_back_left], color);
        }
    }
    if (sides[3]) {
        if (!options.as_floor) {
            welt_ctx.add_surface([bottom_front_right, bottom_back_right, top_back_right, top_front_right], color);
        }else {
            welt_ctx.add_floor([bottom_front_right, bottom_back_right, top_back_right, top_front_right], color);
        }
    }
    if (sides[4]) {
        if (!options.as_floor) {
            welt_ctx.add_surface([bottom_front_right, bottom_front_left, top_front_left, top_front_right], color);
        }else {
            welt_ctx.add_floor([bottom_front_right, bottom_front_left, top_front_left, top_front_right], color);
        }
    }
    if (sides[5]) {
        if (!options.as_floor) {
            welt_ctx.add_surface([bottom_back_left, bottom_front_left, top_front_left, top_back_left], color);
        }else {
            welt_ctx.add_floor([bottom_back_left, bottom_front_left, top_front_left, top_back_left], color);
        }
    }
};

function AddTiledRect(welt_ctx, point, width, length, x_tiles, y_tiles, options) {
    // point is back, left
    // options are from_spherical (bool), as_floor (bool), color (color)
    if (options.from_spherical) {
        point = point.to_cartesean();
    }
    let color = options.color || "#000000";
    let tile_width = width/x_tiles;
    let tile_length = length/y_tiles;

    let vertices = [];
    for (let i = 0; i <= x_tiles; i++) {
        vertices.push([]);
        for (let j = 0; j <= y_tiles; j++) {
            vertices[i].push(welt_ctx.add_vertex(point.x+(tile_width*i), point.y+(tile_length*j), point.z));
        }
    }

    for (let i = 0; i < x_tiles; i++) {
        for (let j = 0; j < y_tiles; j++) {
            if (!options.as_floor) {
                welt_ctx.add_surface([vertices[i][j], vertices[i+1][j], vertices[i+1][j+1], vertices[i][j+1]], color);
            }else {
                welt_ctx.add_floor([vertices[i][j], vertices[i+1][j], vertices[i+1][j+1], vertices[i][j+1]], color);
            }
        }
    }
};