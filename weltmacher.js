
function cartesean_to_spherical(point) {
    // Point must have {x, y, z}
    // Returns as {r, theta, phi}
    let new_point = {r: 0, theta: 0, phi: 0};
    let half_r = Math.sqrt((point.y*point.y)+(point.x*point.x));
    new_point.r = Math.sqrt((half_r*half_r)+(point.z*point.z));
    new_point.theta = Math.atan2(point.y, point.x);
    new_point.phi = Math.atan2(point.z, half_r);
    return new_point;
};
function translate_cartesean(point, translate) {
    // 
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
};

class Surface {
    vertices = [];

    constructor(vertices) {
        // vertices is a list of the indexes of the vertices it is between
        this.vertices = vertices;
    }
};

class WeltContext {
    vertices = [];
    surfaces = [];

    constructor() {

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
};