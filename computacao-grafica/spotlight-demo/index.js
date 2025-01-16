document.addEventListener('alpine:init', () => {
    Alpine.data('App', Main)
})

function Main() {
    return {
        selectedTab: 0,
        light: {
            dir: [1, 1, 1],
            color: '#ffffff'
        },
        object: {
            mesh: 'bunny',
            position: [0, 0, 0],
            rotation: [0, 0, 0],
            scale: [1, 1, 1],
            color: '#ffffff',
            emission: 0,
            ambient: 0.2,
            diffuse: 0.5,
            specular: 0.5,
            shininess: 10
        },
        meshes: {},
        matrixModel: glMatrix.mat4.create(),
        matrixProjection: glMatrix.mat4.create(),
        matrixView: glMatrix.mat4.create(),

        async init() {
            this.regl = createREGL(this.$refs.canvas);

            await this.loadMeshes()

            this.matrixView = glMatrix.mat4.lookAt([], [0, 0, 5], [0, 0, 0], [0, 1, 0])

            const fovy = 40, aspect = 1.333, near = 0.01, far = 100, deg = Math.PI / 180
            this.matrixProjection = glMatrix.mat4.perspective([], fovy * deg, aspect, near, far)

            this.regl.frame(({ time }) => {
                let rotationMatrix = glMatrix.mat4.fromZRotation([], this.object.rotation[2] * deg)
                rotationMatrix = glMatrix.mat4.rotateY([], rotationMatrix, this.object.rotation[1] * deg)
                rotationMatrix = glMatrix.mat4.rotateX([], rotationMatrix, this.object.rotation[0] * deg)
                let scalingMatrix = glMatrix.mat4.fromScaling([], this.object.scale)
                let rotateThanScale = glMatrix.mat4.mul([], rotationMatrix, scalingMatrix)
                this.matrixModel = glMatrix.mat4.mul([], glMatrix.mat4.fromTranslation([], this.object.position), rotateThanScale)

                // First clear the frame buffer
                this.regl.clear({
                    color: [0.8, 0.8, 1.0, 1],
                    depth: 1
                })

                if (this.object.mesh === 'bunny') {
                    this.drawBunnyMesh({
                        objColor: this.colorToVec3(this.object.color),
                        lightColor: this.colorToVec3(this.light.color),
                        lightDir: glMatrix.vec3.normalize([], glMatrix.vec3.transformMat3([], this.light.dir, glMatrix.mat3.fromMat4([], this.matrixView))),
                        ambient: this.object.ambient,
                        emission: this.object.emission,
                        diffuse: this.object.diffuse,
                        specular: this.object.specular,
                        shininess: this.object.shininess,
                        modelview: glMatrix.mat4.mul([], this.matrixView, this.matrixModel),
                        projection: this.matrixProjection
                    });
                } else if (this.object.mesh === 'teapot') {
                    this.drawTeapotMesh({
                        objColor: this.colorToVec3(this.object.color),
                        lightColor: this.colorToVec3(this.light.color),
                        lightDir: glMatrix.vec3.normalize([], glMatrix.vec3.transformMat3([], this.light.dir, glMatrix.mat3.fromMat4([], this.matrixView))),
                        ambient: this.object.ambient,
                        emission: this.object.emission,
                        diffuse: this.object.diffuse,
                        specular: this.object.specular,
                        shininess: this.object.shininess,
                        modelview: glMatrix.mat4.mul([], this.matrixView, this.matrixModel),
                        projection: this.matrixProjection
                    });
                } else if (this.object.mesh === 'sphere') {
                    this.drawSphereMesh({
                        objColor: this.colorToVec3(this.object.color),
                        lightColor: this.colorToVec3(this.light.color),
                        lightDir: glMatrix.vec3.normalize([], glMatrix.vec3.transformMat3([], this.light.dir, glMatrix.mat3.fromMat4([], this.matrixView))),
                        ambient: this.object.ambient,
                        emission: this.object.emission,
                        diffuse: this.object.diffuse,
                        specular: this.object.specular,
                        shininess: this.object.shininess,
                        modelview: glMatrix.mat4.mul([], this.matrixView, this.matrixModel),
                        projection: this.matrixProjection
                    });
                }
            })
        },

        async loadMeshes() {
            let bunnyResponse = await fetch('./assets/obj/bunny.obj')
            let bunnyText = await bunnyResponse.text()
            let bunnyObj = this.parseObj(bunnyText)
            bunnyObj.pos = bunnyObj.pos.map(([x, y, z]) => [x + 0.4, y - 1, z])
            this.meshes.bunny = bunnyObj

            let teapotResponse = await fetch('./assets/obj/teapot@1.obj')
            let teapotText = await teapotResponse.text()
            let teapotObj = this.parseObj(teapotText)
            teapotObj.pos = teapotObj.pos.map(([x, y, z]) => [x / 10, y / 10, z / 10])
            this.meshes.teapot = teapotObj

            let sphereGeometry = function (radius = 1, slices = 20, stacks = 12) {
                let pos = [];
                let normal = [];
                let grid = []
                let dphi = Math.PI / stacks;
                let dtheta = Math.PI * 2 / slices;
                let sphereCoord = (phi, theta) => [Math.cos(theta) * Math.sin(phi),
                Math.sin(theta) * Math.sin(phi),
                Math.cos(phi)];
                for (let i = 0, theta = 0; i <= slices; ++i, theta += dtheta) {
                    grid.push([])
                    for (let j = 0, phi = 0; j <= stacks; ++j, phi += dphi) {
                        grid[i][j] = pos.length;
                        let [x, y, z] = sphereCoord(phi, theta);
                        pos.push([x * radius, y * radius, z * radius]);
                        normal.push([x, y, z]);
                    }
                }

                let faceElements = [];
                let edgeElements = [];
                let faceNormals = [];
                for (let i = 0; i < slices; ++i) {
                    for (let j = 0; j < stacks; j++) {
                        faceElements.push([grid[i][j], grid[i][j + 1], grid[i + 1][j]]);
                        faceElements.push([grid[i + 1][j], grid[i][j + 1], grid[i + 1][j + 1]]);
                        edgeElements.push([grid[i][j], grid[i][j + 1]]);
                        edgeElements.push([grid[i][j], grid[i + 1][j]]);
                    }
                }

                return { pos: pos, normal: normal, faces: faceElements, edges: edgeElements }
            }
            this.meshes.sphere = sphereGeometry()

            this.drawBunnyMesh = this.regl({
                frag: this.fragmentShader(),
                vert: this.vertexShader(),

                // These are the vertex attributes that will be passed
                // on to the vertex shader
                attributes: {
                    position: this.meshes.bunny.pos,
                    normal: this.meshes.bunny.normal
                },

                // These are the uniforms, i.e., global shader variables that are set
                // from inside the host (CPU) program
                uniforms: {
                    objColor: this.regl.prop("objColor"),
                    lightColor: this.regl.prop("lightColor"),
                    lightDir: this.regl.prop("lightDir"),
                    ambient: this.regl.prop("ambient"),
                    emission: this.regl.prop("emission"),
                    diffuse: this.regl.prop("diffuse"),
                    specular: this.regl.prop("specular"),
                    shininess: this.regl.prop("shininess"),
                    modelview: this.regl.prop("modelview"),
                    projection: this.regl.prop("projection")
                },

                // The depth buffer
                depth: {
                    enable: true,
                    func: "<",
                    mask: true
                },
                // Try replacing by the following (don't forget to clear depth to 0 in draw)
                // depth: {
                //   enable: true,
                //   func: ">",
                //   mask: true
                // },
                //

                // Number of triangles
                elements: this.meshes.bunny.faces
            })

            this.drawTeapotMesh = this.regl({
                frag: this.fragmentShader(),
                vert: this.vertexShader(),

                // These are the vertex attributes that will be passed
                // on to the vertex shader
                attributes: {
                    position: this.meshes.teapot.pos,
                    normal: this.meshes.teapot.normal
                },

                // These are the uniforms, i.e., global shader variables that are set
                // from inside the host (CPU) program
                uniforms: {
                    objColor: this.regl.prop("objColor"),
                    lightColor: this.regl.prop("lightColor"),
                    lightDir: this.regl.prop("lightDir"),
                    ambient: this.regl.prop("ambient"),
                    emission: this.regl.prop("emission"),
                    diffuse: this.regl.prop("diffuse"),
                    specular: this.regl.prop("specular"),
                    shininess: this.regl.prop("shininess"),
                    modelview: this.regl.prop("modelview"),
                    projection: this.regl.prop("projection")
                },

                // The depth buffer
                depth: {
                    enable: true,
                    func: "<",
                    mask: true
                },
                // Try replacing by the following (don't forget to clear depth to 0 in draw)
                // depth: {
                //   enable: true,
                //   func: ">",
                //   mask: true
                // },
                //

                // Number of triangles
                elements: this.meshes.teapot.faces
            })

            this.drawSphereMesh = this.regl({
                frag: this.fragmentShader(),
                vert: this.vertexShader(),

                // These are the vertex attributes that will be passed
                // on to the vertex shader
                attributes: {
                    position: this.meshes.sphere.pos,
                    normal: this.meshes.sphere.normal
                },

                // These are the uniforms, i.e., global shader variables that are set
                // from inside the host (CPU) program
                uniforms: {
                    objColor: this.regl.prop("objColor"),
                    lightColor: this.regl.prop("lightColor"),
                    lightDir: this.regl.prop("lightDir"),
                    ambient: this.regl.prop("ambient"),
                    emission: this.regl.prop("emission"),
                    diffuse: this.regl.prop("diffuse"),
                    specular: this.regl.prop("specular"),
                    shininess: this.regl.prop("shininess"),
                    modelview: this.regl.prop("modelview"),
                    projection: this.regl.prop("projection")
                },

                // The depth buffer
                depth: {
                    enable: true,
                    func: "<",
                    mask: true
                },
                // Try replacing by the following (don't forget to clear depth to 0 in draw)
                // depth: {
                //   enable: true,
                //   func: ">",
                //   mask: true
                // },
                //

                // Number of triangles
                elements: this.meshes.sphere.faces
            })
        },

        vertexShader() {
            return `
                attribute vec3 position;
                attribute vec3 normal;
                varying vec3 vtxNormal;
                uniform mat4 modelview;
                uniform mat4 projection;
                
                void main () {
                    vec4 worldpos = modelview*vec4(position, 1.0);
                    gl_Position = projection*worldpos;
                    vtxNormal = (modelview*vec4(normal,0.0)).xyz;
                }
            `
        },

        fragmentShader() {
            return `
                precision mediump float;
                uniform vec4 color;
                varying vec3 vtxNormal;
                uniform vec3 lightDir;
                uniform vec3 lightColor;
                uniform vec3 objColor;
                uniform float ambient;
                uniform float emission;
                uniform float diffuse;
                uniform float specular;
                uniform float shininess;
                
                void main () {
                    vec3 normal = normalize(vtxNormal);
                    float diffuseComp = max(0.0,diffuse * dot(normal,lightDir));
                    vec3 ref = 2.0*dot(lightDir,normal)*normal - lightDir;
                    float specularComp = specular*pow(max(0.0,dot(ref,vec3(0.0,0.0,1.0))),shininess);
                    gl_FragColor = vec4(
                        emission*objColor + (ambient+diffuseComp)*lightColor*objColor + specularComp*lightColor, 
                        1.0
                    );
                }
            `
        },

        // Function to convert a html color to a vec3 with rgb values between 0 and 1
        colorToVec3(color) {
            return [
                parseInt(color.slice(1, 3), 16) / 255,
                parseInt(color.slice(3, 5), 16) / 255,
                parseInt(color.slice(5, 7), 16) / 255
            ]
        },

        // A very crude parser for meshes in the Wavefront obj format
        parseObj(source) {
            let pos = [], normal = [], faces = [];
            for (let line of source.split("\n")) {
                let split = line.split(/ +/);
                if (split.length != 4) continue;
                let [letter, x, y, z] = split;
                switch (letter) {
                    case 'v':
                        x = parseFloat(x); y = parseFloat(y); z = parseFloat(z);
                        pos.push([x, y, z]);
                        break;
                    case 'vn':
                        x = parseFloat(x); y = parseFloat(y); z = parseFloat(z);
                        normal.push([x, y, z]);
                        break;
                    case 'f':
                        // Assume vertex index = normal index
                        x = parseInt(x); y = parseInt(y); z = parseInt(z);
                        faces.push([x - 1, y - 1, z - 1]);
                        break
                }
            }
            return { pos, normal, faces };
        }
    }
}
