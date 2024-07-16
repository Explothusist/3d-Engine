
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

    add_perspective(vanish, los) {
        let x = this.x;
        let y = this.y;
        let z = this.z;
        let multiplier = (vanish-this.y)/vanish;
        let los_mult = (vanish-los)/vanish;
        multiplier = Math.max(los_mult, Math.min(1, multiplier));
        // multiplier *= multiplier;
        this.x = x*multiplier;
        this.y = z*multiplier;
        this.z = y;
    }

    debug_text(txt, x, y, ctx) {
        ctx.fillStyle = "rgb(0, 0, 0)";
        ctx.fillText(txt+"("+this.x+", "+this.y+", "+this.z+")", x, y);
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
        this.angle = new Spherical_Vertex(0, theta, phi);
    }

    moveRelative(vector) {
        let trans_point = this.point.to_spherical();
        let invert_angle = this.angle.copy();
        invert_angle.invert();
        trans_point.translate(invert_angle);
        trans_point = trans_point.to_cartesean();
        trans_point.translate(vector);
        trans_point = trans_point.to_spherical();
        trans_point.translate(this.angle);
        trans_point = trans_point.to_cartesean();
        this.point = trans_point;
    }
}

class WeltContext {
    vertices = [];
    surfaces = [];
    floor_surfaces = [];
    camera;
    light;
    vanish = 5000;
    los = 3000;

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
            vert.add_perspective(this.vanish, this.los);
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
            for (let vert_index of surface.vertices) {
                average_dist += vertex_positions[vert_index].z;
                // min_dist = Math.min(vertex_positions[vert_index].z, min_dist);
                if (vertex_positions[vert_index].z > 0 && vertex_positions[vert_index].z < this.los/* && vertex_positions[vert_index].x > -(width/2) && vertex_positions[vert_index].x < (width/2)
                        && vertex_positions[vert_index].y > -(height/2) && vertex_positions[vert_index].y < (height/2)*/) {
                    one_on_screen = true;
                }
            }
            average_dist /= surface.vertices.length;
            if (one_on_screen) {
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