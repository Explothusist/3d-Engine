
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
        let z = this.r*Math.sin(this.phi);
        let half_r = this.r*Math.cos(this.phi);
        let x = half_r*Math.sin(this.theta);
        let y = half_r*Math.cos(this.theta);
        return new Vertex(x, y, z);
    }
    copy() {
        return new Spherical_Vertex(this.r, this.theta, this.phi);
    }

    to_xy() {
        let x = this.r*(Math.sin(this.theta));
        let y = this.r*(Math.sin(this.phi));
        return {x: x, y: y, r: this.r};
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
        let half_r = Math.sqrt((this.y*this.y)+(this.x*this.x));
        let r = Math.sqrt((half_r*half_r)+(this.z*this.z));
        let theta = Math.atan2(this.y, this.x);
        let phi = Math.atan2(this.z, half_r);
        return new Spherical_Vertex(r, theta, phi);
    }
    copy() {
        return new Vertex(this.x, this.y, this.z);
    }
};

class Surface {
    vertices = [];

    constructor(vertices) {
        // vertices is a list of the indexes of the vertices it is between
        this.vertices = vertices;
    }
};

class Camera {
    point;
    angle;

    constructor(x, y, z, theta, phi) {
        this.point = new Vertex(x, y, z);
        this.angle = new Spherical_Vertex(0, theta, phi);
    }
}

class WeltContext {
    vertices = [];
    surfaces = [];
    camera;
    light;

    constructor() {
        this.camera = new Camera(0, 0, 0, 0, 0);
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
    add_surface(vertices) {
        this.surfaces.push(new Surface(vertices));
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
        for (let vertex of this.vertices) {
            let vert = vertex.copy();
            // Translates so camera point is origin
            vert.translate(cam_point);
            vert = vert.to_spherical();
            // Rotates so camera angle is origin
            vert.translate(cam_angle);
            // If any math is wrong, it is probably this math
            vertex_positions.push(vert.to_xy());
        }

        console.log(vertex_positions);

        ctx.fillStyle = "#000000";
        for (let vertex of vertex_positions) {
            ctx.fillRect(center_x+vertex.x, center_y+vertex.y, 1, 1);
        }
    }
};