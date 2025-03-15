import * as THREE from 'three';

export default class SweepObject
{
    public start = [new THREE.Vector3(-1, -1, -1), new THREE.Vector3(1, -1, -1), new THREE.Vector3(1, 1, -1), new THREE.Vector3(-1, 1, -1)]
    public finish = [new THREE.Vector3(-1, -1, 1), new THREE.Vector3(1, -1, 1), new THREE.Vector3(1, 1, 1), new THREE.Vector3(-1, 2, 1)]
    public sweep = [new THREE.Vector3(-2, 0, 2), new THREE.Vector3(-2, 0, -2), new THREE.Vector3(2, 0, -2), new THREE.Vector3(2, 0, 2)]
    
    public sweepPoints: number = 20
    public crossSectionPoints: number = 20
    public isClosed: boolean = false
    public tension: number = 0.5

    public mesh: THREE.Mesh
    
    private scene: THREE.Scene

    constructor(scene: THREE.Scene)
    {
        this.scene = scene;

        const sweepSurface = this.ComputeSweepSurface();
        const geometry = this.SurfaceGeometry(sweepSurface)
        const material = new THREE.MeshStandardMaterial({ color: 0xff0000, side: THREE.DoubleSide })
        this.mesh = new THREE.Mesh(geometry, material);
        
        this.scene.add(this.mesh)
    }

    UpdateGeometry()
    {
        this.mesh.geometry.dispose()

        const sweepSurface = this.ComputeSweepSurface();

        this.mesh.geometry = this.SurfaceGeometry(sweepSurface)
    }

    ComputeSweepSurface()
    {
        const pathCurve = new THREE.CatmullRomCurve3(this.sweep, this.isClosed, 'catmullrom', this.tension)
        const pathPoints = pathCurve.getPoints(this.sweepPoints)
        const pathFrames = pathCurve.computeFrenetFrames(this.sweepPoints)

        const sweepSurface: THREE.Vector3[][] = []
        for (let i = 0; i < this.sweepPoints; i++) {
            const path = pathPoints[i];
            const normal = pathFrames.normals[i]
            const binormal = pathFrames.binormals[i]
            const tangent = pathFrames.tangents[i]

            const newBase = new THREE.Matrix4().makeBasis(binormal, normal, tangent);
            newBase.setPosition(path)
            
            const transformedStart = this.start.map((point, j) => {
                const t = i / this.sweepPoints
                const finalPoint = point.clone().lerp(this.finish[j], t)
                return finalPoint.applyMatrix4(newBase)
            })
            sweepSurface.push(new THREE.CatmullRomCurve3(transformedStart, this.isClosed, 'catmullrom', this.tension).getPoints(this.crossSectionPoints))
        }

        return sweepSurface
    }

    SurfaceGeometry(polylines: THREE.Vector3[][]): THREE.BufferGeometry {
        let geometry = new THREE.BufferGeometry();
        let n = polylines[0].length;
        let m = polylines.length;
        let vertices: number[] = [];
        let indices = [];
        let uvs = [];

        let tex = (i: number, j: number) => [i / (m - 1), j / (n - 1)];

        polylines.forEach(poly => {
            for (let vertice of poly) {
                vertices.push(vertice.x, vertice.y, vertice.z);
            }
        });

        // Generate faces and UVs
        for (let i = 0; i + 1 < m; i++) {
            for (let j = 0; j + 1 < n; j++) {
                let a = i * n + j;
                let b = i * n + j + 1;
                let c = (i + 1) * n + j;
                let d = (i + 1) * n + j + 1;

                // First triangle
                indices.push(a, b, c);
                uvs.push(...tex(i, j), ...tex(i, j + 1), ...tex(i + 1, j));

                // Second triangle
                indices.push(c, b, d);
                uvs.push(...tex(i + 1, j), ...tex(i, j + 1), ...tex(i + 1, j + 1));
            }
        }

        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
        geometry.setIndex(indices);
        geometry.computeVertexNormals();

        return geometry
    }

}