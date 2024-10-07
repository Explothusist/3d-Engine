
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
        let x = this.r*Math.cos(this.theta)*Math.sin(this.phi);
        let y = this.r*Math.sin(this.theta)*Math.sin(this.phi);
        let z = this.r*Math.cos(this.phi);
        let ret = new Vertex(x, y, z);
        ret.r = this.r;
        return ret;
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
        this.phi = Math.min((Math.PI/2), Math.max(this.phi, (-Math.PI/2)));
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

    add_perspective(focus, phi) {
        let x = this.x;
        let y = this.y;
        let z = this.z;
        
        y = Math.max(y, 0);

        let horizon_vert = new Polar_Vertex(y, phi);
        horizon_vert = horizon_vert.to_cartesean();
        let horizon_y = horizon_vert.y;

        let horizon_ang_dia = 2*Math.atan(horizon_y/(2*y));
        horizon_ang_dia *= focus;

        let point = new Vertex_2d(x, z/*-horizon_y*/);
        point = point.to_polar();
        this.angular_diameter = 2*Math.atan(point.r/(2*y));
        point.r = this.angular_diameter*focus;
        point = point.to_cartesean();
        this.x = point.x;
        // this.y = point.y+(horizon*this.angular_diameter);
        this.y = point.y+horizon_ang_dia;
        this.z = y;
        this.actual_y = z;
        this.actual_z = this.r;

        // this.x = x;
        // this.y = z;
        // this.z = y;
        
        // y = Math.max(y, 0);
        // this.angular_diameter_x = 2*Math.atan(x/(2*y));
        // this.x = this.angular_diameter_x*focus;
        // this.angular_diameter_z = 2*Math.atan(z/(2*y));
        // this.y = this.angular_diameter_z*(focus+horizon);
        // this.z = y;
        // this.actual_y = z;
        // this.actual_z = this.r;
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


class Line_2d {
    m;
    b;

    constructor(m, b) {
        this.m = m;
        this.b = b;
    }
    pointIsOnLine(point) {
        if (point.y === (this.m*point.x)+this.b) {
            return true;
        }
        return false;
    }
    pointIsAboveLine(point) {
        if (point.y > (this.m*point.x)+this.b) {
            return true;
        }
        return false;
    }
    pointIsBelowLine(point) {
        if (point.y < (this.m*point.x)+this.b) {
            return true;
        }
        return false;
    }

    static get_line(point1, point2) {
        // 2d line connecting points in slope-intercept form (y = mx + b)
        let m = (point2.y-point1.y)/(point2.x-point1.x);
        let b = point1.y-(m*point1.x);
        return new Line_2d(m, b);
    }
};

// Can handle ramps
function collide_cube_to_floor_rect(cube_points, rect_points) {
    // cube_points is array of 8 vertices and rect_points is array of 4 vertices

    // console.log(cube_points, rect_points);

    rect_points.sort((a, b) => a.x-b.x || a.y-b.y || a.z-b.z);
    let rect_origin = rect_points[0].copy();
    rect_points.splice(0, 1);
    let high_dist = {value: 0, index: 0};
    for (let i = 0; i < rect_points.length; i++) {
        let point = rect_points[i];
        let dist = Math.sqrt(Math.pow(rect_origin.x-point.x, 2)+Math.pow(rect_origin.y-point.y, 2)+Math.pow(rect_origin.z-point.z, 2));
        if (dist > high_dist.value) {
            high_dist.value = dist;
            high_dist.index = i;
        }
    }
    let rect_dimensions = rect_points[high_dist.index].copy();
    rect_points.splice(high_dist.index, 1);
    let invert_origin = rect_origin.copy();
    invert_origin.invert();
    rect_dimensions.translate(invert_origin);

    // console.log(rect_origin, rect_dimensions);

    let z_counted = false;

    // x-z test
    let xz_test_result = false;
    let x_min = new Vertex_2d(rect_origin.x, rect_origin.z);
    // let x_max = new Vertex_2d(rect_origin.x+rect_dimensions.x, rect_origin.z+rect_dimensions.z);
    let x_max = undefined;
    for (let point of rect_points) {
        if (point.y === rect_origin.y) {
            x_max = new Vertex_2d(point.x, point.z);
        }
    }
    if (x_max === undefined) {
        console.log("!! collide_cube_to_floor_rect cannot handle the given rect_points !!");
    }
    let xz_line = Line_2d.get_line(x_min, x_max);

    // console.log(xz_line);

    let in_x_bounds = false;
    let x_greater = false;
    let x_lesser = false;
    for (let point of cube_points) {
        if (point.x >= x_min.x && point.x <= x_max.x) {
            in_x_bounds = true;
            break;
        }else if (point.x > x_max.x) {
            x_greater = true;
            if (x_lesser) {
                in_x_bounds = true;
                break;
            }
        }else if (point.x < x_min.x) {
            x_lesser = true;
            if (x_greater) {
                in_x_bounds = true;
                break;
            }
        }
    }
    // console.log(in_x_bounds, x_greater, x_lesser);
    if (in_x_bounds) {
        if (xz_line.m !== 0) {
            z_counted = true;
            let above_line = false;
            let below_line = false;
            for (let point of cube_points) {
                let point2d = new Vertex_2d(point.x, point.z);
                if (xz_line.pointIsOnLine(point2d)) {
                    xz_test_result = true;
                    break;
                }else if (xz_line.pointIsAboveLine(point2d)) {
                    above_line = true;
                    if (below_line) {
                        xz_test_result = true;
                        break;
                    }
                }else if (xz_line.pointIsBelowLine(point2d)) {
                    below_line = true;
                    if (above_line) {
                        xz_test_result = true;
                        break;
                    }
                }
            }
            // console.log(above_line, below_line);
        }else {
            xz_test_result = true;
        }
    }

    // y-z test
    let yz_test_result = false;
    let y_min = new Vertex_2d(rect_origin.y, rect_origin.z);
    // let y_max = new Vertex_2d(rect_origin.y+rect_dimensions.y, rect_origin.z+rect_dimensions.z);
    let y_max = undefined;
    for (let point of rect_points) {
        if (point.x === rect_origin.x) {
            y_max = new Vertex_2d(point.y, point.z);
        }
    }
    if (y_max === undefined) {
        console.log("!! collide_cube_to_floor_rect cannot handle the given rect_points !!");
    }
    let yz_line = Line_2d.get_line(y_min, y_max);

    // console.log(yz_line);

    let in_y_bounds = false;
    let y_greater = false;
    let y_lesser = false;
    for (let point of cube_points) {
        if (point.y >= y_min.x && point.y <= y_max.x) {
            in_y_bounds = true;
            break;
        }else if (point.y > y_max.x) {
            y_greater = true;
            if (y_lesser) {
                in_y_bounds = true;
                break;
            }
        }else if (point.y < x_min.x) {
            y_lesser = true;
            if (y_greater) {
                in_y_bounds = true;
                break;
            }
        }
    }
    // console.log(in_y_bounds, y_greater, y_lesser);
    if (in_y_bounds) {
        if (yz_line.m !== 0 || !z_counted) {
            let above_line = false;
            let below_line = false;
            for (let point of cube_points) {
                let point2d = new Vertex_2d(point.y, point.z);
                if (yz_line.pointIsOnLine(point2d)) {
                    yz_test_result = true;
                    break;
                }else if (yz_line.pointIsAboveLine(point2d)) {
                    above_line = true;
                    if (below_line) {
                        yz_test_result = true;
                        break;
                    }
                }else if (yz_line.pointIsBelowLine(point2d)) {
                    below_line = true;
                    if (above_line) {
                        yz_test_result = true;
                        break;
                    }
                }
            }
            // console.log(above_line, below_line);
        }else {
            yz_test_result = true;
        }
    }

    if (yz_test_result && xz_test_result) {
        return true;
    }
    return false;
};
// Must be vertical or horizontal
function collide_cube_to_vertical_wall_rect(cube_points, rect_points) {
    // cube_points is array of 8 vertices and rect_points is array of 4 vertices

    // console.log(cube_points, rect_points);

    rect_points.sort((a, b) => a.x-b.x || a.y-b.y || a.z-b.z);
    let rect_origin = rect_points[0].copy();
    rect_points.splice(0, 1);
    let high_dist = {value: 0, index: 0};
    for (let i = 0; i < rect_points.length; i++) {
        let point = rect_points[i];
        let dist = Math.sqrt(Math.pow(rect_origin.x-point.x, 2)+Math.pow(rect_origin.y-point.y, 2)+Math.pow(rect_origin.z-point.z, 2));
        if (dist > high_dist.value) {
            high_dist.value = dist;
            high_dist.index = i;
        }
    }
    let rect_dimensions = rect_points[high_dist.index].copy();
    rect_points.splice(high_dist.index, 1);
    let invert_origin = rect_origin.copy();
    invert_origin.invert();
    rect_dimensions.translate(invert_origin);

    // console.log(rect_origin, rect_dimensions);

    // x-z test
    let xz_test_result = false;
    if (rect_dimensions.x === 0 || rect_dimensions.z === 0) {
        // console.log("X-Z Test");

        let x_min = new Vertex_2d(rect_origin.x, rect_origin.z);
        // let x_max = new Vertex_2d(rect_origin.x+rect_dimensions.x, rect_origin.z+rect_dimensions.z);
        let x_max = undefined;
        for (let point of rect_points) {
            if (point.y === rect_origin.y) {
                x_max = new Vertex_2d(point.x, point.z);
            }
        }
        if (x_max === undefined) {
            console.log("!! collide_cube_to_vertical_wall_rect cannot handle the given rect_points !!");
        }
        let xz_line = Line_2d.get_line(x_min, x_max);
        let flip_xz = false;
        if (xz_line.m === Infinity) {
            flip_xz = true;
            x_min = new Vertex_2d(x_min.y, x_min.x);
            x_max = new Vertex_2d(x_max.y, x_max.x);
            xz_line = Line_2d.get_line(x_min, x_max);
        }

        // console.log(xz_line, flip_xz);

        let in_bounds = false;
        if (!flip_xz) {
            let x_greater = false;
            let x_lesser = false;
            for (let point of cube_points) {
                if (point.x >= x_min.x && point.x <= x_max.x) {
                    in_bounds = true;
                    break;
                }else if (point.x > x_max.x) {
                    x_greater = true;
                    if (x_lesser) {
                        in_bounds = true;
                        break;
                    }
                }else if (point.x < x_min.x) {
                    x_lesser = true;
                    if (x_greater) {
                        in_bounds = true;
                        break;
                    }
                }
            }
        }else {
            let z_greater = false;
            let z_lesser = false;
            for (let point of cube_points) {
                if (point.z >= x_min.x && point.z <= x_max.x) {
                    in_bounds = true;
                    break;
                }else if (point.z > x_max.x) {
                    z_greater = true;
                    if (z_lesser) {
                        in_bounds = true;
                        break;
                    }
                }else if (point.z < x_min.x) {
                    z_lesser = true;
                    if (z_greater) {
                        in_bounds = true;
                        break;
                    }
                }
            }
        }
        // console.log(in_x_bounds, x_greater, x_lesser);
        if (in_bounds) {
            let above_line = false;
            let below_line = false;
            for (let point of cube_points) {
                let point2d = new Vertex_2d(point.x, point.z);
                if (flip_xz) {
                    point2d = new Vertex_2d(point2d.y, point2d.x);
                }
                if (xz_line.pointIsOnLine(point2d)) {
                    xz_test_result = true;
                    break;
                }else if (xz_line.pointIsAboveLine(point2d)) {
                    above_line = true;
                    if (below_line) {
                        xz_test_result = true;
                        break;
                    }
                }else if (xz_line.pointIsBelowLine(point2d)) {
                    below_line = true;
                    if (above_line) {
                        xz_test_result = true;
                        break;
                    }
                }
            }
            // console.log(above_line, below_line);
        }

        // console.log(xz_test_result);
    }

    // y-z test
    let yz_test_result = false;
    if (rect_dimensions.y === 0 || rect_dimensions.z === 0) {
        // console.log("Y-Z Test");

        let y_min = new Vertex_2d(rect_origin.y, rect_origin.z);
        // let y_max = new Vertex_2d(rect_origin.y+rect_dimensions.y, rect_origin.z+rect_dimensions.z);
        let y_max = undefined;
        for (let point of rect_points) {
            if (point.x === rect_origin.x) {
                y_max = new Vertex_2d(point.y, point.z);
            }
        }
        if (y_max === undefined) {
            console.log("!! collide_cube_to_vertical_wall_rect cannot handle the given rect_points !!");
        }
        let yz_line = Line_2d.get_line(y_min, y_max);
        let flip_yz = false;
        if (yz_line.m === Infinity) {
            flip_yz = true;
            y_min = new Vertex_2d(y_min.y, y_min.x);
            y_max = new Vertex_2d(y_max.y, y_max.x);
            yz_line = Line_2d.get_line(y_min, y_max);
        }

        // console.log(yz_line, flip_yz);
    
        let in_bounds = false;
        if (!flip_yz) {
            let y_greater = false;
            let y_lesser = false;
            for (let point of cube_points) {
                if (point.y >= y_min.x && point.y <= y_max.x) {
                    in_bounds = true;
                    break;
                }else if (point.y > y_max.x) {
                    y_greater = true;
                    if (y_lesser) {
                        in_bounds = true;
                        break;
                    }
                }else if (point.y < y_min.x) {
                    y_lesser = true;
                    if (y_greater) {
                        in_bounds = true;
                        break;
                    }
                }
            }
        }else {
            let z_greater = false;
            let z_lesser = false;
            for (let point of cube_points) {
                if (point.z >= y_min.x && point.z <= y_max.x) {
                    in_bounds = true;
                    break;
                }else if (point.z > y_max.x) {
                    z_greater = true;
                    if (z_lesser) {
                        in_bounds = true;
                        break;
                    }
                }else if (point.z < y_min.x) {
                    z_lesser = true;
                    if (z_greater) {
                        in_bounds = true;
                        break;
                    }
                }
            }
        }
        // console.log(in_y_bounds, y_greater, y_lesser);
        if (in_bounds) {
            let above_line = false;
            let below_line = false;
            for (let point of cube_points) {
                let point2d = new Vertex_2d(point.y, point.z);
                if (flip_yz) {
                    point2d = new Vertex_2d(point2d.y, point2d.x);
                }
                if (yz_line.pointIsOnLine(point2d)) {
                    yz_test_result = true;
                    break;
                }else if (yz_line.pointIsAboveLine(point2d)) {
                    above_line = true;
                    if (below_line) {
                        yz_test_result = true;
                        break;
                    }
                }else if (yz_line.pointIsBelowLine(point2d)) {
                    below_line = true;
                    if (above_line) {
                        yz_test_result = true;
                        break;
                    }
                }
            }
            // console.log(above_line, below_line);
        }

        // console.log(yz_test_result);
    }
    
    // x-y test
    let xy_test_result = false;
    if (rect_dimensions.x === 0 || rect_dimensions.y === 0) {
        // console.log("X-Y Test");

        let x_min = new Vertex_2d(rect_origin.x, rect_origin.y);
        let x_max = undefined;
        for (let point of rect_points) {
            if (point.z === rect_origin.z) {
                x_max = new Vertex_2d(point.x, point.y);
            }
        }
        if (x_max === undefined) {
            console.log("!! collide_cube_to_vertical_wall_rect cannot handle the given rect_points !!");
        }
        let xy_line = Line_2d.get_line(x_min, x_max);
        let flip_xy = false;
        if (xy_line.m === Infinity) {
            flip_xy = true;
            x_min = new Vertex_2d(x_min.y, x_min.x);
            x_max = new Vertex_2d(x_max.y, x_max.x);
            xy_line = Line_2d.get_line(x_min, x_max);
        }

        // console.log(xy_line, flip_xy);
    
        let in_bounds = false;
        if (!flip_xy) {
            let x_greater = false;
            let x_lesser = false;
            for (let point of cube_points) {
                if (point.x >= x_min.x && point.x <= x_max.x) {
                    in_bounds = true;
                    break;
                }else if (point.x > x_max.x) {
                    x_greater = true;
                    if (x_lesser) {
                        in_bounds = true;
                        break;
                    }
                }else if (point.x < x_min.x) {
                    x_lesser = true;
                    if (x_greater) {
                        in_bounds = true;
                        break;
                    }
                }
            }
        }else {
            let y_greater = false;
            let y_lesser = false;
            for (let point of cube_points) {
                if (point.y >= x_min.x && point.y <= x_max.x) {
                    in_bounds = true;
                    break;
                }else if (point.y > x_max.x) {
                    y_greater = true;
                    if (y_lesser) {
                        in_bounds = true;
                        break;
                    }
                }else if (point.y < x_min.x) {
                    y_lesser = true;
                    if (y_greater) {
                        in_bounds = true;
                        break;
                    }
                }
            }
        }
        // console.log(in_x_bounds, x_greater, x_lesser);
        if (in_bounds) {
            let above_line = false;
            let below_line = false;
            for (let point of cube_points) {
                let point2d = new Vertex_2d(point.x, point.y);
                if (flip_xy) {
                    point2d = new Vertex_2d(point2d.y, point2d.x);
                }
                if (xy_line.pointIsOnLine(point2d)) {
                    xy_test_result = true;
                    break;
                }else if (xy_line.pointIsAboveLine(point2d)) {
                    above_line = true;
                    if (below_line) {
                        xy_test_result = true;
                        break;
                    }
                }else if (xy_line.pointIsBelowLine(point2d)) {
                    below_line = true;
                    if (above_line) {
                        xy_test_result = true;
                        break;
                    }
                }
            }
            // console.log(above_line, below_line);
        }

        // console.log(xy_test_result);
    }

    if ((xy_test_result+yz_test_result+xz_test_result) >= 2) {
        return true;
    }
    return false;
};


class Surface {
    vertices = [];
    color;

    static surface = 0;
    static floor = 1;
    static platform = 2;
    static wall = 3;

    constructor(vertices, color, type) {
        // vertices is a list of the indexes of the vertices it is between
        this.vertices = vertices;
        this.color = color;
        this.type = type;
    }

    isWalkable() {
        if (this.type === Surface.floor || this.type == Surface.platform) {
            return true;
        }
        return false;
    }
    isBonkable() {
        if (this.type === Surface.wall) {
            return true;
        }
        return false;
    }
};

class Camera {
    char_point;
    point;
    angle;
    perspective = "first";

    third_seperation = 1000;

    constructor(x, y, z, theta, phi) {
        this.point = new Vertex(x, y, z);
        this.angle = new Phi_Shift_Spherical_Vertex(0, theta, phi);
        this.physics = new Physics_Element();
    }
    setup_third_person() {
        this.perspective = "third";
        this.char_point = this.point.copy();
        this.calulate_third_person_camera();
    }
    calulate_third_person_camera() {
        // this.point = this.char_point.to_spherical();
        // let mod_angle = this.angle.copy();
        // mod_angle.r = 300;
        // mod_angle.phi = 0;
        // this.point.translate(mod_angle);
        // this.point = this.point.to_cartesean();

        // this.point = this.char_point.copy();
        // let mod_angle = new Polar_Vertex(this.third_seperation, this.angle.theta-(Math.PI/2));
        // mod_angle = mod_angle.to_cartesean();
        // let mod_3d = new Vertex(mod_angle.x, mod_angle.y, 0);
        // this.point.translate(mod_3d);
        
        this.point = this.char_point.copy();
        let mod_angle = this.angle.copy();
        mod_angle.r = this.third_seperation;
        mod_angle.theta -= Math.PI/2;
        mod_angle.phi *= -1;
        mod_angle.phi += Math.PI/2;
        mod_angle = mod_angle.to_cartesean();
        this.point.translate(mod_angle);
    }
    get_bounding_points() {
        let origin = new Vertex(this.point.x-100, this.point.y-100, this.point.z);
        if (this.perspective === "third") {
            origin = new Vertex(this.char_point.x-100, this.char_point.y-100, this.char_point.z);
        }
        let extent = new Vertex(200, 200, 300);
        let bounding_points = [];
        bounding_points.push(new Vertex(origin.x, origin.y, origin.z));
        bounding_points.push(new Vertex(origin.x+extent.x, origin.y, origin.z));
        bounding_points.push(new Vertex(origin.x, origin.y+extent.y, origin.z));
        bounding_points.push(new Vertex(origin.x+extent.x, origin.y+extent.y, origin.z));
        bounding_points.push(new Vertex(origin.x, origin.y, origin.z+extent.z));
        bounding_points.push(new Vertex(origin.x+extent.x, origin.y, origin.z+extent.z));
        bounding_points.push(new Vertex(origin.x, origin.y+extent.y, origin.z+extent.z));
        bounding_points.push(new Vertex(origin.x+extent.x, origin.y+extent.y, origin.z+extent.z));
        return bounding_points;
    }

    moveFullRelative(vector) {
        let angled_vector = vector.copy();
        angled_vector = angled_vector.to_spherical();
        angled_vector.translate(this.angle);
        angled_vector = angled_vector.to_cartesean();
        this.point.translate(angled_vector);
        if (this.perspective === "third") {
            this.char_point.translate(angled_vector);
        }
    }
    moveRelative(vector) {
        let angled_vector = vector.copy();
        angled_vector = angled_vector.to_spherical();
        angled_vector.translate(new Spherical_Vertex(0, this.angle.theta, 0));
        angled_vector = angled_vector.to_cartesean();
        this.point.translate(angled_vector);
        if (this.perspective === "third") {
            this.char_point.translate(angled_vector);
        }
    }
    moveAbsolute(vector) {
        this.point.translate(vector);
        if (this.perspective === "third") {
            this.char_point.translate(vector);
        }
    }
    rotate(vector) {
        this.angle.translate(vector);
        this.angle.within_bounds();
        if (this.perspective === "third") {
            this.calulate_third_person_camera();
        }
    }
};

class Physics_Element {
    z_velocity = 0;
    on_ground = false;
    jump_force = 7;
    fall_accel = 0.1;
    bounding_points = [];

    constructor(/*cube_origin, cube_extent*/) {
        // this.set_bounding_points_cube(cube_origin, cube_extent);
    }
    // set_bounding_points_cube(origin, extent) {
    //     this.bounding_points = [];
    //     this.bounding_points.push(new Vertex(origin.x, origin.y, origin.z));
    //     this.bounding_points.push(new Vertex(origin.x+extent.x, origin.y, origin.z));
    //     this.bounding_points.push(new Vertex(origin.x, origin.y+extent.y, origin.z));
    //     this.bounding_points.push(new Vertex(origin.x+extent.x, origin.y+extent.y, origin.z));
    //     this.bounding_points.push(new Vertex(origin.x, origin.y, origin.z+extent.z));
    //     this.bounding_points.push(new Vertex(origin.x+extent.x, origin.y, origin.z+extent.z));
    //     this.bounding_points.push(new Vertex(origin.x, origin.y+extent.y, origin.z+extent.z));
    //     this.bounding_points.push(new Vertex(origin.x+extent.x, origin.y+extent.y, origin.z+extent.z));
    // }
    set_physics(jump_force, fall_accel) {
        this.jump_force = jump_force;
        this.fall_accel = fall_accel;
    }
    canJump() {
        if (this.on_ground) {
            return true;
        }
        return false;
    }
    jump(force) {
        this.z_velocity = force || this.jump_force;
    }
    land() {
        this.z_velocity = 0;
        this.on_ground = true;
    }
    fall() {
        this.on_ground = false;
        this.z_velocity -= this.fall_accel;
        return this.z_velocity;
    }
    // move(vector) {
    //     for (let point of this.bounding_points) {
    //         point.translate(vector);
    //     }
    // }
};


class WeltContext {
    vertices = [];
    surfaces = [];
    camera;
    light;
    // vanish = 10000;
    // los = 6000;
    distinguishable_size = 0.0003; // 0.0003 rad = 1 arcminute = how small an object humans can make out
    focus = 500; // Distance at which objects are x pixels large, x being size in code
    horizon = 0;

    perspective = "first";
    person_vertices = [];
    person_surfaces = [];

    floors = [1000000, 0, -1000000];

    constructor() {
        // this.camera = new Camera(0, -400, 0, 0, 0);
        this.camera = new Camera(0, 0, -300, 0, 0);
    }
    reset_context() {
        // Clears the entire screen
        this.vertices = [];
        this.surfaces = [];
    }
    set_floors(floors) {
        this.floors = floors;
    }
    setup_third_person(person_vertices, person_surfaces) {
        this.perspective = "third";
        this.person_vertices = person_vertices;
        this.person_surfaces = person_surfaces;
        this.camera.setup_third_person();
    }

    add_vertex(x, y, z) {
        // Makes a new vertex and returns the index of that vertex
        this.vertices.push(new Vertex(x, y, z));
        return this.vertices.length-1;
    }
    add_surface(vertices, color, type) {
        this.surfaces.push(new Surface(vertices, color, type));
    }

    calculate_vertices(vertices) {
        let vertex_positions = [];
        let cam_point = this.camera.point.copy();
        cam_point.invert();
        let cam_angle_point = this.camera.angle.to_cartesean();
        cam_angle_point.invert();
        let cam_angle = this.camera.angle.copy();
        cam_angle.invert();
        // let cam_phi_angle = cam_angle.copy();
        cam_angle.phi = 0;
        cam_angle.r = 0;
        for (let i in vertices) {
            let vert = vertices[i].copy();
            // vert.debug_text("start: ", 50, 100+(i*150), ctx);
            // Translates so camera point is origin
            vert.translate(cam_point);
            vert.translate(cam_angle_point);
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
            vert.add_perspective(this.focus, this.camera.angle.phi);
            // vert.debug_text("perspective: ", 50, 200+(i*150), ctx);
            // vert = new Vertex(vert.x, this.focus, vert.z);
            // vert = vert.to_spherical();
            // vert.translate(cam_phi_angle);
            // vert = vert.to_cartesean();
            // vert.y = vert.z;
            vertex_positions.push(vert);
        }
        return vertex_positions;
    }

    render(x, y, width, height, ctx) {
        // console.log(this.horizon);
        ctx.fillStyle = "#C0C0C0";
        ctx.fillRect(x, y, width, height);
        
        let center_x = Math.floor(x+(width/2));
        let center_y = Math.floor(y+(height/2));

        let vertex_positions = this.calculate_vertices(this.vertices);

        // console.log(vertex_positions);

        ctx.fillStyle = "#000000";
        for (let vertex of vertex_positions) {
            ctx.fillRect(center_x+vertex.x, center_y+vertex.y, 1, 1);
        }

        let split_floors = [];
        for (let i = 0; i+1 < this.floors.length; i++) {
            split_floors.push({floor_surfaces: [], surfaces: []});
        }
        for (let i in this.surfaces) {
            let surface = this.surfaces[i];
            let average_dist = 0;
            let average_height = 0;
            // let min_dist = this.los;
            let one_on_screen = false;
            let one_on_screen_x = false;
            let offscreen_posx = false;
            let offscreen_negx = false;
            let offscreen_posy = false;
            let offscreen_negy = false;
            for (let vert_index of surface.vertices) {
                // average_dist += vertex_positions[vert_index].z;
                average_dist += vertex_positions[vert_index].actual_z;
                average_height += this.vertices[vert_index].z;
                // min_dist = Math.min(vertex_positions[vert_index].z, min_dist);
                if (this.perspective === "first") {
                    if (vertex_positions[vert_index].z > 0/* && vertex_positions[vert_index].angular_diameter > this.distinguishable_size*/) {
                        one_on_screen = true;
                    }
                }else if (this.perspective === "third") {
                    let vanishing = 0;
                    if (surface.type !== Surface.floor) {
                        vanishing = this.camera.third_seperation;
                    }
                    if (vertex_positions[vert_index].z > vanishing/* && vertex_positions[vert_index].angular_diameter > this.distinguishable_size*/) {
                        one_on_screen = true;
                    }
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
            if ((offscreen_negx+offscreen_posx+offscreen_negy+offscreen_posy) >= 2) {
                one_on_screen_x = true;
            }
            average_dist /= surface.vertices.length;
            average_height /= surface.vertices.length;
            if (one_on_screen && one_on_screen_x) {
                // surfaces_sorted.push({floor: false, index: i, dist: average_dist, height: average_height});
                // surfaces_sorted.push({index: i, dist: min_dist});

                let floor_index = 0;
                while (average_height <= this.floors[floor_index+1] && floor_index < split_floors.length-1) {
                    floor_index += 1;
                }
                // console.log(split_floors, floor_index);
                if (surface.type === Surface.floor) {
                    split_floors[floor_index].floor_surfaces.push({index: i, dist: average_dist, height: average_height});
                }else {
                    split_floors[floor_index].surfaces.push({index: i, dist: average_dist, height: average_height});
                }
            }
        }
        
        for (let floor of split_floors) {
            floor.floor_surfaces.sort((a, b) => b.dist-a.dist);
            floor.surfaces.sort((a, b) => b.dist-a.dist);
        }
        // surfaces_sorted.sort((a,b) => /*b.height-a.height || */b.dist-a.dist);

        let char_floor = 0;
        while (this.camera.point.z < this.floors[char_floor+1] && char_floor < split_floors.length-1) {
            char_floor += 1;
        }
        console.log(char_floor);
        
        function draw_surface(surface) {
            ctx.fillStyle = surface.color;
            ctx.strokeStyle = "#000000";
            ctx.beginPath();
            ctx.moveTo(center_x+vertex_positions[surface.vertices[0]].x, center_y+vertex_positions[surface.vertices[0]].y);
            for (let i = 1; i < surface.vertices.length; i++) {
                ctx.lineTo(center_x+vertex_positions[surface.vertices[i]].x, center_y+vertex_positions[surface.vertices[i]].y);
            }
            ctx.closePath();
            ctx.stroke();
            ctx.fill();
        };

        for (let i = 0; i < char_floor; i++) {
            for (let floor of split_floors[i].floor_surfaces) {
                draw_surface(this.surfaces[floor.index]);
            }
            for (let surface of split_floors[i].surfaces) {
                draw_surface(this.surfaces[surface.index]);
            }
        }
        for (let i = split_floors.length-1; i > char_floor; i--) {
            for (let surface of split_floors[i].surfaces) {
                draw_surface(this.surfaces[surface.index]);
            }
            for (let floor of split_floors[i].floor_surfaces) {
                draw_surface(this.surfaces[floor.index]);
            }
        }
        for (let floor of split_floors[char_floor].floor_surfaces) {
            draw_surface(this.surfaces[floor.index]);
        }
        for (let surface of split_floors[char_floor].surfaces) {
            draw_surface(this.surfaces[surface.index]);
        }

        if (this.perspective === "third") {
            let person_vertices = [];
            for (let i in this.person_vertices) {
                let vert = this.person_vertices[i].copy();
                vert.translate(this.camera.char_point);
                person_vertices.push(vert);
            }
            let vertex_positions = this.calculate_vertices(person_vertices);

            let surfaces_sorted = [];
            for (let i in this.person_surfaces) {
                let surface = this.person_surfaces[i];
                let average_dist = 0;
                let average_height = 0;
                // let min_dist = this.los;
                let one_on_screen = false;
                let one_on_screen_x = false;
                let offscreen_posx = false;
                let offscreen_negx = false;
                let offscreen_posy = false;
                let offscreen_negy = false;
                for (let vert_index of surface.vertices) {
                    // average_dist += vertex_positions[vert_index].z;
                    average_dist += vertex_positions[vert_index].actual_z;
                    average_height += this.vertices[vert_index].z;
                    // min_dist = Math.min(vertex_positions[vert_index].z, min_dist);
                    if (vertex_positions[vert_index].z > 0/* && vertex_positions[vert_index].angular_diameter > this.distinguishable_size*/) {
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
                average_height /= surface.vertices.length;
                if (one_on_screen && one_on_screen_x) {
                    surfaces_sorted.push({index: i, dist: average_dist, height: average_height});
                }
            }
            
            surfaces_sorted.sort((a,b) => b.dist-a.dist);
            
            function draw_surface(surface) {
                ctx.fillStyle = surface.color;
                ctx.strokeStyle = "#000000";
                ctx.beginPath();
                ctx.moveTo(center_x+vertex_positions[surface.vertices[0]].x, center_y+vertex_positions[surface.vertices[0]].y);
                for (let i = 1; i < surface.vertices.length; i++) {
                    ctx.lineTo(center_x+vertex_positions[surface.vertices[i]].x, center_y+vertex_positions[surface.vertices[i]].y);
                }
                ctx.closePath();
                ctx.stroke();
                ctx.fill();
            };

            for (let surface of surfaces_sorted) {
                draw_surface(this.person_surfaces[surface.index]);
            }
        }
    }
    physics() {
        this.camera.moveAbsolute(new Vertex(0, 0, -this.camera.physics.fall()));
        this.camera_to_floor_collision();
    }
    camera_to_floor_collision() {
        let in_a_floor = false;
        let collided_surface = undefined;
        for (let floor of this.surfaces) {
            if (floor.isWalkable()) {
                if (collide_cube_to_floor_rect(this.camera.get_bounding_points(), this.indices_to_vertices(floor.vertices))) {
                    in_a_floor = true;
                    collided_surface = floor;
                    break;
                }
            }
        }
        if (in_a_floor) {
            this.camera.physics.land();
            while (collide_cube_to_floor_rect(this.camera.get_bounding_points(), this.indices_to_vertices(collided_surface.vertices))) {
                this.camera.moveAbsolute(new Vertex(0, 0, -1));
            }
        }
    }

    moveCameraFullRelative(vector) {
        this.camera.moveFullRelative(vector);
        this.camera_to_floor_collision();
        this.camera_to_wall_collision(0, vector);
    }
    moveCameraRelative(vector) {
        this.camera.moveRelative(vector);
        this.camera_to_floor_collision();
        this.camera_to_wall_collision(1, vector);
    }
    moveCameraAbsolute(vector) {
        this.camera.moveAbsolute(vector);
        this.camera_to_floor_collision();
        this.camera_to_wall_collision(2, vector);
    }
    rotateCamera(vector) {
        this.camera.rotate(vector);
    }

    camera_to_wall_collision(move_type, vector) {
        let reverse_vector = vector.copy();
        reverse_vector.scale(new Vertex(0.1, 0.1, 0.1));
        reverse_vector.invert();
        // console.log(vector, reverse_vector);
        for (let surface of this.surfaces) {
            if (surface.isBonkable()) {
                while (collide_cube_to_vertical_wall_rect(this.camera.get_bounding_points(), this.indices_to_vertices(surface.vertices))) {
                    switch (move_type) {
                        case 0:
                            this.camera.moveFullRelative(reverse_vector);
                            break;
                        case 1:
                            this.camera.moveRelative(reverse_vector);
                            break;
                        case 2:
                            this.camera.moveAbsolute(reverse_vector);
                            break;
                    }
                }
            }
        }
    }

    indices_to_vertices(indices) {
        let vertices = [];
        for (let index of indices) {
            vertices.push(this.vertices[index]);
        }
        return vertices;
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
            welt_ctx.add_surface(top_corners, color, Surface.platform);
        }else {
            welt_ctx.add_surface(top_corners, color, Surface.floor);
        }
    }
    if (sides[1]) {
        if (!options.as_floor) {
            welt_ctx.add_surface(corners, color, Surface.platform);
        }else {
            welt_ctx.add_surface(corners, color, Surface.floor);
        }
    }
    for (let i = 0; i < num_sides; i++) {
        if (sides[i+2]) {
            if (!options.as_floor) {
                welt_ctx.add_surface([corners[i], top_corners[i], top_corners[(i+1) % num_sides], corners[(i+1) % num_sides]], color, Surface.surface);
            }else {
                welt_ctx.add_surface([corners[i], top_corners[i], top_corners[(i+1) % num_sides], corners[(i+1) % sides]], color, Surface.surface);
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
            welt_ctx.add_surface([top_back_left, top_back_right, top_front_right, top_front_left], color, Surface.platform);
        }else {
            welt_ctx.add_surface([top_back_left, top_back_right, top_front_right, top_front_left], color, Surface.floor);
        }
    }
    if (sides[1]) {
        if (!options.as_floor) {
            welt_ctx.add_surface([bottom_back_left, bottom_back_right, bottom_front_right, bottom_front_left], color, Surface.platform);
        }else {
            welt_ctx.add_surface([bottom_back_left, bottom_back_right, bottom_front_right, bottom_front_left], color, Surface.floor);
        }
    }
    if (sides[2]) {
        if (!options.as_floor) {
            welt_ctx.add_surface([bottom_back_left, bottom_back_right, top_back_right, top_back_left], color, Surface.wall);
        }else {
            welt_ctx.add_surface([bottom_back_left, bottom_back_right, top_back_right, top_back_left], color, Surface.floor);
        }
    }
    if (sides[3]) {
        if (!options.as_floor) {
            welt_ctx.add_surface([bottom_front_right, bottom_back_right, top_back_right, top_front_right], color, Surface.wall);
        }else {
            welt_ctx.add_surface([bottom_front_right, bottom_back_right, top_back_right, top_front_right], color, Surface.floor);
        }
    }
    if (sides[4]) {
        if (!options.as_floor) {
            welt_ctx.add_surface([bottom_front_right, bottom_front_left, top_front_left, top_front_right], color, Surface.wall);
        }else {
            welt_ctx.add_surface([bottom_front_right, bottom_front_left, top_front_left, top_front_right], color, Surface.floor);
        }
    }
    if (sides[5]) {
        if (!options.as_floor) {
            welt_ctx.add_surface([bottom_back_left, bottom_front_left, top_front_left, top_back_left], color, Surface.wall);
        }else {
            welt_ctx.add_surface([bottom_back_left, bottom_front_left, top_front_left, top_back_left], color, Surface.floor);
        }
    }
};

function AddRect(welt_ctx, point, width, length, options) {
    // point is back, left
    // options are from_spherical (bool), as_floor (bool), color (color)

    // Hack, I've already written the code
    AddTiledRect(welt_ctx, point, width, length, 1, 1, options);
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
                welt_ctx.add_surface([vertices[i][j], vertices[i+1][j], vertices[i+1][j+1], vertices[i][j+1]], color, Surface.platform);
            }else {
                welt_ctx.add_surface([vertices[i][j], vertices[i+1][j], vertices[i+1][j+1], vertices[i][j+1]], color, Surface.floor);
            }
        }
    }
};

function AddGable(welt_ctx, point, width, length, height, sides, options) {
    // point is bottom, back, left
    // sides is array of booleans in the form:
    // [top, bottom, side1 (back side (x, z)), side2 (clockwise from side1), ...]
    // options are from_spherical (bool), color (color), all_sides (bool), flip_gable (bool)
    if (options.from_spherical) {
        point = point.to_cartesean();
    }
    let color = options.color || "#000000";

    if (options.all_sides) {
        sides = [true, true, true, true, true];
    }

    if (!options.flip_gable) {
        let bottom_back_left = welt_ctx.add_vertex(point.x, point.y, point.z);
        let bottom_back_right = welt_ctx.add_vertex(point.x+width, point.y, point.z);
        let bottom_front_left = welt_ctx.add_vertex(point.x, point.y+length, point.z);
        let bottom_front_right = welt_ctx.add_vertex(point.x+width, point.y+length, point.z);
        let top_back = welt_ctx.add_vertex(point.x+(width/2), point.y, point.z+height);
        let top_front = welt_ctx.add_vertex(point.x+(width/2), point.y+length, point.z+height);

        if (sides[0]) {
            welt_ctx.add_surface([top_back, top_front, bottom_front_left, bottom_back_left], color, Surface.platform);
        }
        if (sides[1]) {
            welt_ctx.add_surface([top_back, top_front, bottom_front_right, bottom_back_right], color, Surface.platform);
        }
        if (sides[2]) {
            welt_ctx.add_surface([bottom_back_left, bottom_back_right, bottom_front_right, bottom_front_left], color, Surface.platform);
        }
        if (sides[3]) {
            welt_ctx.add_surface([bottom_back_left, bottom_back_right, top_back], color, Surface.surface);
        }
        if (sides[4]) {
            welt_ctx.add_surface([bottom_front_right, bottom_front_left, top_front], color, Surface.surface);
        }
    }else {
        let bottom_back_left = welt_ctx.add_vertex(point.x, point.y, point.z);
        let bottom_back_right = welt_ctx.add_vertex(point.x+width, point.y, point.z);
        let bottom_front_left = welt_ctx.add_vertex(point.x, point.y+length, point.z);
        let bottom_front_right = welt_ctx.add_vertex(point.x+width, point.y+length, point.z);
        let top_left = welt_ctx.add_vertex(point.x, point.y+(length/2), point.z+height);
        let top_right = welt_ctx.add_vertex(point.x+width, point.y+(length/2), point.z+height);

        if (sides[0]) {
            welt_ctx.add_surface([top_left, top_right, bottom_front_right, bottom_front_left], color, Surface.platform);
        }
        if (sides[1]) {
            welt_ctx.add_surface([top_left, top_right, bottom_back_right, bottom_back_left], color, Surface.platform);
        }
        if (sides[2]) {
            welt_ctx.add_surface([bottom_back_left, bottom_back_right, bottom_front_right, bottom_front_left], color, Surface.platform);
        }
        if (sides[3]) {
            welt_ctx.add_surface([bottom_back_left, bottom_front_left, top_left], color, Surface.wall);
        }
        if (sides[4]) {
            welt_ctx.add_surface([bottom_front_right, bottom_back_right, top_right], color, Surface.wall);
        }
    }
};

function AddLadder(welt_ctx, point, height, options) {
    let width = 400;
    let length = 50;
    let spacing = 200;
    let color = options.color || "#000000";

    AddCube(welt_ctx, new Vertex(point.x, point.y, point.z), 50, 50, -height, [], { all_sides: true, color: color });
    AddCube(welt_ctx, new Vertex(point.x+width-50, point.y, point.z), 50, 50, -height, [], { all_sides: true, color: color });
    for (let z = 0; z > -height; z -= spacing) {
        AddCube(welt_ctx, new Vertex(point.x+50, point.y, point.z+z), width-100, length, 50, [], { all_sides: true, color: color });
    }
};

function AddRamp(welt_ctx, point, width, length, height, options) {
    let color = options.color || "#000000";
    if (options.face_right) {
        let far_top_right = welt_ctx.add_vertex(point.x, point.y+length, point.z-height);
        let far_top_left = welt_ctx.add_vertex(point.x+width, point.y+length, point.z-height);
        let far_bottom_right = welt_ctx.add_vertex(point.x, point.y+length, point.z);
        let far_bottom_left = welt_ctx.add_vertex(point.x+width, point.y+length, point.z);
        let back_right = welt_ctx.add_vertex(point.x, point.y, point.z);
        let back_left = welt_ctx.add_vertex(point.x+width, point.y, point.z);
        welt_ctx.add_surface([far_top_right, far_top_left, back_left, back_right], color, Surface.platform);
        welt_ctx.add_surface([back_right, far_bottom_right, far_top_right], color, Surface.surface);
        welt_ctx.add_surface([far_top_left, far_bottom_left, back_left], color, Surface.surface);
        welt_ctx.add_surface([far_top_right, far_top_left, far_bottom_left, far_bottom_right], color, Surface.surface);
        welt_ctx.add_surface([far_bottom_right, far_bottom_left, back_left, back_right], color, Surface.platform);
    }else if (options.face_left) {
        let far_right = welt_ctx.add_vertex(point.x, point.y+length, point.z);
        let far_left = welt_ctx.add_vertex(point.x+width, point.y+length, point.z);
        let back_bottom_right = welt_ctx.add_vertex(point.x, point.y, point.z);
        let back_bottom_left = welt_ctx.add_vertex(point.x+width, point.y, point.z);
        let back_top_right = welt_ctx.add_vertex(point.x, point.y, point.z-height);
        let back_top_left = welt_ctx.add_vertex(point.x+width, point.y, point.z-height);
        welt_ctx.add_surface([back_top_right, back_top_left, far_left, far_right], color, Surface.platform);
        welt_ctx.add_surface([far_right, back_bottom_right, back_top_right], color, Surface.surface);
        welt_ctx.add_surface([back_top_left, back_bottom_left, far_left], color, Surface.surface);
        welt_ctx.add_surface([back_top_right, back_top_left, back_bottom_left, back_bottom_right], color, Surface.surface);
        welt_ctx.add_surface([back_bottom_right, back_bottom_left, far_left, far_right], color, Surface.platform);
    }else if (options.face_front) {
        let far_top_right = welt_ctx.add_vertex(point.x, point.y+length, point.z-height);
        let far_bottom_right = welt_ctx.add_vertex(point.x, point.y+length, point.z);
        let far_left = welt_ctx.add_vertex(point.x+width, point.y+length, point.z);
        let back_top_right = welt_ctx.add_vertex(point.x, point.y, point.z-height);
        let back_bottom_right = welt_ctx.add_vertex(point.x, point.y, point.z);
        let back_left = welt_ctx.add_vertex(point.x+width, point.y, point.z);
        welt_ctx.add_surface([far_top_right, back_top_right, back_left, far_left], color, Surface.platform);
        welt_ctx.add_surface([far_top_right, far_bottom_right, far_left], color, Surface.surface);
        welt_ctx.add_surface([back_top_right, back_bottom_right, back_left], color, Surface.surface);
        welt_ctx.add_surface([far_top_right, back_top_right, back_bottom_right, far_bottom_right], color, Surface.surface);
        welt_ctx.add_surface([back_bottom_right, far_bottom_right, far_left, back_left], color, Surface.platform);
    }else if (options.face_back) {
        let far_right = welt_ctx.add_vertex(point.x, point.y+length, point.z);
        let far_top_left = welt_ctx.add_vertex(point.x+width, point.y+length, point.z-height);
        let far_bottom_left = welt_ctx.add_vertex(point.x+width, point.y+length, point.z);
        let back_right = welt_ctx.add_vertex(point.x, point.y, point.z);
        let back_top_left = welt_ctx.add_vertex(point.x+width, point.y, point.z-height);
        let back_bottom_left = welt_ctx.add_vertex(point.x+width, point.y, point.z);
        welt_ctx.add_surface([far_top_left, back_top_left, back_right, far_right], color, Surface.platform);
        welt_ctx.add_surface([far_top_left, far_bottom_left, far_right], color, Surface.surface);
        welt_ctx.add_surface([back_top_left, back_bottom_left, back_right], color, Surface.surface);
        welt_ctx.add_surface([far_top_left, back_top_left, back_bottom_left, far_bottom_left], color, Surface.surface);
        welt_ctx.add_surface([back_bottom_left, far_bottom_left, far_right, back_right], color, Surface.platform);
    }
};