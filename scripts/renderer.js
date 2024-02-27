class Renderer {
    // canvas:              object ({id: __, width: __, height: __})
    // num_curve_sections:  int
    constructor(canvas, num_curve_sections, show_points_flag) {
        this.canvas = document.getElementById(canvas.id);
        this.canvas.width = canvas.width;
        this.canvas.height = canvas.height;
        this.ctx = this.canvas.getContext('2d', {willReadFrequently: true});
        this.slide_idx = 0;
        this.num_curve_sections = num_curve_sections;
        this.show_points = show_points_flag;
    }

    // n:  int
    setNumCurveSections(n) {
        this.num_curve_sections = n;
        this.drawSlide(this.slide_idx);
    }

    // flag:  bool
    showPoints(flag) {
        this.show_points = flag;
        this.drawSlide(this.slide_idx);
    }
    
    // slide_idx:  int
    drawSlide(slide_idx) {
        this.slide_idx = slide_idx;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        let framebuffer = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);

        switch (this.slide_idx) {
            case 0:
                this.drawSlide0(framebuffer);
                break;
            case 1:
                this.drawSlide1(framebuffer);
                break;
            case 2:
                this.drawSlide2(framebuffer);
                break;
            case 3:
                this.drawSlide3(framebuffer);
                break;
        }

        this.ctx.putImageData(framebuffer, 0, 0);
    }

    // framebuffer:  canvas ctx image data
    drawSlide0(framebuffer) {
        // TODO: draw at least 2 Bezier curves
        //   - variable `this.num_curve_sections` should be used for `num_edges`
        //   - variable `this.show_points` should be used to determine whether or not to render vertices

        this.drawBezierCurve({x: 200, y: 100}, {x: 110, y: 150}, {x: 400, y: 600}, {x: 600, y: 300}, this.num_curve_sections, [255, 0, 0, 255], framebuffer)
        this.drawBezierCurve({x: 150, y: 500}, {x: 10, y: 150}, {x: 700, y: 100}, {x: 600, y: 500}, this.num_curve_sections, [50, 119, 168, 255], framebuffer)
        
    }

    // framebuffer:  canvas ctx image data
    drawSlide1(framebuffer) {
        // TODO: draw at least 2 circles
        //   - variable `this.num_curve_sections` should be used for `num_edges`
        //   - variable `this.show_points` should be used to determine whether or not to render vertices
        
        this.drawCircle({x: 300, y: 300}, 100, this.num_curve_sections, [50, 119, 168, 255], framebuffer);
        this.drawCircle({x: 400, y: 300}, 200, this.num_curve_sections, [50, 119, 168, 255], framebuffer);
        
    }

    // framebuffer:  canvas ctx image data
    drawSlide2(framebuffer) {
        // TODO: draw at least 2 convex polygons (each with a different number of vertices >= 5)
        //   - variable `this.show_points` should be used to determine whether or not to render vertices
        let vertices = [{x: 100, y: 100}, {x: 50, y: 180}, {x: 80, y: 310}, {x: 130, y: 340}, {x: 200, y: 300}, {x: 240, y: 200}, {x: 220, y: 120}];
        let vertices2 =[{x: 300, y: 300}, {x: 250, y: 350}, {x: 300, y: 500}, {x: 360, y: 530}, {x: 420, y: 550}, {x: 450, y: 400}];
        this.drawConvexPolygon(vertices, [0, 128, 128, 255], framebuffer);
        this.drawConvexPolygon(vertices2, [0, 128, 128, 255], framebuffer);
        
        if(this.show_points) {
            for(let i = 0; i < vertices.length; i++) {
                this.drawVertex(vertices[i], [100, 100, 100, 255], framebuffer);
            }

            for(let i = 0; i < vertices2.length; i++) {
                this.drawVertex(vertices2[i], [100, 100, 100, 255], framebuffer);
            }
        }

    }

    // framebuffer:  canvas ctx image data
    drawSlide3(framebuffer) {
        // TODO: draw your name!
        //   - variable `this.num_curve_sections` should be used for `num_edges`
        //   - variable `this.show_points` should be used to determine whether or not to render vertices
        let color = [103, 52, 235, 255];
        //P
        this.drawLine({x: 100, y: 170}, {x: 100, y: 450}, color, framebuffer);
        this.drawBezierCurve({x: 100, y: 350}, {x: 250, y: 300}, {x: 250, y: 500}, {x: 100, y: 450}, this.num_curve_sections, color, framebuffer);
        
        //a
        this.drawBezierCurve({x: 250, y: 330}, {x: 120, y: 360}, {x: 120, y: 140}, {x: 250, y: 200}, this.num_curve_sections, color, framebuffer);
        this.drawLine({x: 250, y: 170}, {x: 250, y: 350}, color, framebuffer);

        //k
        this.drawLine({x: 280, y: 170}, {x: 280, y: 450}, color, framebuffer);
        this.drawLine({x: 280, y: 270}, {x: 350, y: 350}, color, framebuffer);
        this.drawLine({x: 280, y: 270}, {x: 350, y: 170}, color, framebuffer);

        //u
        this.drawBezierCurve({x: 400, y: 350}, {x: 400, y: 180}, {x: 400, y: 180}, {x: 480, y: 190}, this.num_curve_sections, color, framebuffer);
        this.drawLine({x: 480, y: 170}, {x: 480, y: 350}, color, framebuffer);

    }

    // p0:           object {x: __, y: __}
    // p1:           object {x: __, y: __}
    // p2:           object {x: __, y: __}
    // p3:           object {x: __, y: __}
    // num_edges:    int
    // color:        array of int [R, G, B, A]
    // framebuffer:  canvas ctx image data
    drawBezierCurve(p0, p1, p2, p3, num_edges, color, framebuffer) {
        // TODO: draw a sequence of straight lines to approximate a Bezier curve
        let t = 0;
        let x = [];
        let y = [];
        let interval = 1 / num_edges;
        if(this.show_points) {
            this.drawVertex(p1, [100, 100, 100, 255], framebuffer);
            this.drawVertex(p2, [100, 100, 100, 255], framebuffer);
        }

        for(let i = 0; i < num_edges + 1; i++) {
            x[i] = parseInt(Math.pow((1 - t), 3) * p0.x + 3 * Math.pow((1 -t), 2) * t * p1.x + 3 * (1 - t) * Math.pow(t, 2) * p2.x + Math.pow(t, 3) * p3.x);
            y[i] = parseInt(Math.pow((1 - t), 3) * p0.y + 3 * Math.pow((1 -t), 2) * t * p1.y + 3 * (1 - t) * Math.pow(t, 2) * p2.y + Math.pow(t, 3) * p3.y);

            t += interval;

            if(this.show_points) {
                this.drawVertex({x: x[i], y: y[i]}, [100, 100, 100, 255], framebuffer);
            }
        }

        // console.log(x);
        // console.log(y);
        // console.log(num_edges);

        for (let i = 0; i < x.length - 1; i++) {
            this.drawLine({x: x[i], y: y[i]}, {x: x[i + 1], y: y[i + 1]}, color, framebuffer);
        }
        
        
    }

    // center:       object {x: __, y: __}
    // radius:       int
    // num_edges:    int
    // color:        array of int [R, G, B, A]
    // framebuffer:  canvas ctx image data
    drawCircle(center, radius, num_edges, color, framebuffer) {
        // TODO: draw a sequence of straight lines to approximate a circle
        let a = 0;
        let angle = 360 / num_edges;
        let x = [];
        let y = [];

        for(let i = 0; i <= num_edges; i++) {
            x[i] = parseInt(center.x + radius * Math.cos(a * Math.PI / 180));
            y[i] = parseInt(center.y + radius * Math.sin(a * Math.PI / 180));

            a += angle;

            if(this.show_points) {
                this.drawVertex({x: x[i], y: y[i]}, [100, 100, 100, 255], framebuffer);
            }
        }

        if(this.show_points) {
            this.drawVertex(center, [100, 100, 100, 255], framebuffer);
        }

        for(let i = 0; i < num_edges; i++) {
            this.drawLine({x: x[i], y: y[i]}, {x: x[i + 1], y: y[i + 1]}, color, framebuffer);
        }
        
    }
    
    // vertex_list:  array of object [{x: __, y: __}, {x: __, y: __}, ..., {x: __, y: __}]
    // color:        array of int [R, G, B, A]
    // framebuffer:  canvas ctx image data
    drawConvexPolygon(vertex_list, color, framebuffer) {
        // TODO: draw a sequence of triangles to form a convex polygon

        for(let i = 1; i < vertex_list.length - 1; i++) {
            this.drawTriangle(vertex_list[0], vertex_list[i], vertex_list[i + 1], color, framebuffer);
        }
        
        
    }
    
    // v:            object {x: __, y: __}
    // color:        array of int [R, G, B, A]
    // framebuffer:  canvas ctx image data
    drawVertex(v, color, framebuffer) {
        // TODO: draw some symbol (e.g. small rectangle, two lines forming an X, ...) centered at position `v`
        this.drawLine(v, {x: v.x + 3, y: v.y + 3}, color, framebuffer);
        this.drawLine(v, {x: v.x + 3, y: v.y - 3}, color, framebuffer);
        this.drawLine(v, {x: v.x - 3, y: v.y - 3}, color, framebuffer);
        this.drawLine(v, {x: v.x - 3, y: v.y + 3}, color, framebuffer);
        
    }
    
    /***************************************************************
     ***       Basic Line and Triangle Drawing Routines          ***
     ***       (code provided from in-class activities)          ***
     ***************************************************************/
    pixelIndex(x, y, framebuffer) {
	    return 4 * y * framebuffer.width + 4 * x;
    }
    
    setFramebufferColor(color, x, y, framebuffer) {
	    let p_idx = this.pixelIndex(x, y, framebuffer);
        for (let i = 0; i < 4; i++) {
            framebuffer.data[p_idx + i] = color[i];
        }
    }
    
    swapPoints(a, b) {
        let tmp = {x: a.x, y: a.y};
        a.x = b.x;
        a.y = b.y;
        b.x = tmp.x;
        b.y = tmp.y;
    }

    drawLine(p0, p1, color, framebuffer) {
        if (Math.abs(p1.y - p0.y) <= Math.abs(p1.x - p0.x)) { // |m| <= 1
            if (p0.x < p1.x) {
                this.drawLineLow(p0.x, p0.y, p1.x, p1.y, color, framebuffer);
            }
            else {
                this.drawLineLow(p1.x, p1.y, p0.x, p0.y, color, framebuffer);
            }
        }
        else {                                                // |m| > 1
            if (p0.y < p1.y) {
                this.drawLineHigh(p0.x, p0.y, p1.x, p1.y, color, framebuffer);
            }
            else {
                this.drawLineHigh(p1.x, p1.y, p0.x, p0.y, color, framebuffer);
            }
        }
    }
    
    drawLineLow(x0, y0, x1, y1, color, framebuffer) {
        let A = y1 - y0;
        let B = x0 - x1;
        let iy = 1; // y increment (+1 for positive slope, -1 for negative slop)
        if (A < 0) {
            iy = -1;
            A *= -1;
        }
        let D = 2 * A + B;
        let D0 = 2 * A;
        let D1 = 2 * A + 2 * B;
    
        let y = y0;
        for (let x = x0; x <= x1; x++) {
            this.setFramebufferColor(color, x, y, framebuffer);
            if (D <= 0) {
                D += D0;
            }
            else {
                D += D1;
                y += iy;
            }
        }
    }
    
    drawLineHigh(x0, y0, x1, y1, color, framebuffer) {
        let A = x1 - x0;
        let B = y0 - y1;
        let ix = 1; // x increment (+1 for positive slope, -1 for negative slop)
        if (A < 0) {
            ix = -1;
            A *= -1;
        }
        let D = 2 * A + B;
        let D0 = 2 * A;
        let D1 = 2 * A + 2 * B;
    
        let x = x0;
        for (let y = y0; y <= y1; y++) {
            this.setFramebufferColor(color, x, y, framebuffer);
            if (D <= 0) {
                D += D0;
            }
            else {
                D += D1;
                x += ix;
            }
        }
    }
    
    drawTriangle(p0, p1, p2, color, framebuffer) {
        // Deep copy, then sort points in ascending y order
        p0 = {x: p0.x, y: p0.y};
        p1 = {x: p1.x, y: p1.y};
        p2 = {x: p2.x, y: p2.y};
        if (p1.y < p0.y) this.swapPoints(p0, p1);
        if (p2.y < p0.y) this.swapPoints(p0, p2);
        if (p2.y < p1.y) this.swapPoints(p1, p2);
        
        // Edge coherence triangle algorithm
        // Create initial edge table
        let edge_table = [
            {x: p0.x, inv_slope: (p1.x - p0.x) / (p1.y - p0.y)}, // edge01
            {x: p0.x, inv_slope: (p2.x - p0.x) / (p2.y - p0.y)}, // edge02
            {x: p1.x, inv_slope: (p2.x - p1.x) / (p2.y - p1.y)}  // edge12
        ];
        
        // Do cross product to determine if pt1 is to the right/left of edge02
        let v01 = {x: p1.x - p0.x, y: p1.y - p0.y};
        let v02 = {x: p2.x - p0.x, y: p2.y - p0.y};
        let p1_right = ((v01.x * v02.y) - (v01.y * v02.x)) >= 0;
        
        // Get the left and right edges from the edge table (lower half of triangle)
        let left_edge, right_edge;
        if (p1_right) {
            left_edge = edge_table[1];
            right_edge = edge_table[0];
        }
        else {
            left_edge = edge_table[0];
            right_edge = edge_table[1];
        }
        // Draw horizontal lines (lower half of triangle)
        for (let y = p0.y; y < p1.y; y++) {
            let left_x = parseInt(left_edge.x) + 1;
            let right_x = parseInt(right_edge.x);
            if (left_x <= right_x) { 
                this.drawLine({x: left_x, y: y}, {x: right_x, y: y}, color, framebuffer);
            }
            left_edge.x += left_edge.inv_slope;
            right_edge.x += right_edge.inv_slope;
        }
        
        // Get the left and right edges from the edge table (upper half of triangle) - note only one edge changes
        if (p1_right) {
            right_edge = edge_table[2];
        }
        else {
            left_edge = edge_table[2];
        }
        // Draw horizontal lines (upper half of triangle)
        for (let y = p1.y; y < p2.y; y++) {
            let left_x = parseInt(left_edge.x) + 1;
            let right_x = parseInt(right_edge.x);
            if (left_x <= right_x) {
                this.drawLine({x: left_x, y: y}, {x: right_x, y: y}, color, framebuffer);
            }
            left_edge.x += left_edge.inv_slope;
            right_edge.x += right_edge.inv_slope;
        }
    }
};

export { Renderer };
