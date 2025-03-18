import * as THREE from 'three';

export default class SweepObject
{
    public start: THREE.Vector3[] = []
    public finish: THREE.Vector3[] = []
    public sweep: THREE.Vector3[] = []
    
    public sweepPoints: number = 20
    public crossSectionPoints: number = 20
    public tension: number = 0.5
    public twist: number = 0
    
    public isStartClosed: boolean = false
    public isFinishClosed: boolean = false
    public isSweepClosed: boolean = false
    
    public mesh: THREE.Mesh
    public frenetFrames: THREE.Group
    
    private scene: THREE.Scene
    private isTextured: boolean = false
    private texture: THREE.Texture

    constructor(scene: THREE.Scene)
    {
        this.scene = scene;

        this.texture = new THREE.TextureLoader().load('./checkboard-texture.png');
        this.texture.anisotropy = 4;
        this.texture.minFilter = THREE.LinearFilter
        this.texture.needsUpdate = true;
        this.texture.wrapS = THREE.RepeatWrapping;
        this.texture.wrapT = THREE.RepeatWrapping;

        const material = new THREE.MeshStandardMaterial({ color: 0xff0000, side: THREE.DoubleSide })
        this.mesh = new THREE.Mesh(new THREE.BufferGeometry(), material);

        this.frenetFrames = new THREE.Group()
        
        this.scene.add(this.mesh, this.frenetFrames)
    }

    UpdateGeometry()
    {
        this.mesh.geometry.dispose()
        this.frenetFrames.clear()

        const [sweepSurface, frames] = this.ComputeSweepSurface();
        this.mesh.geometry = this.SurfaceGeometry(sweepSurface)
        
        this.FrenetFramesArrowHelpers(frames).forEach((frame, i) => {
            frame.forEach(arrow => this.frenetFrames.add(arrow))
        })
    }

    ComputeSweepSurface()
    {
        const startPoints = new THREE.CatmullRomCurve3(this.start, this.isStartClosed, 'catmullrom', this.tension).getPoints(this.crossSectionPoints)
        const finalPoints = new THREE.CatmullRomCurve3(this.finish, this.isFinishClosed, 'catmullrom', this.tension).getPoints(this.crossSectionPoints)
        const pathCurve = new THREE.CatmullRomCurve3(this.sweep, this.isSweepClosed, 'catmullrom', this.tension)

        const pathPoints = pathCurve.getPoints(this.sweepPoints)
        const pathFrames = pathCurve.computeFrenetFrames(this.sweepPoints)

        const sweepSurface: THREE.Vector3[][] = []
        const frenetFrames: THREE.Vector3[][] = []
        for (let i = 0; i <= this.sweepPoints; i++) {
            const t = i / this.sweepPoints

            const path = pathPoints[i];
            const normal = pathFrames.normals[i]
            const binormal = pathFrames.binormals[i]
            const tangent = pathFrames.tangents[i]

            const newBase = new THREE.Matrix4().makeBasis(binormal, normal, tangent);
            newBase.setPosition(path)

            const smoothRotation = new THREE.Matrix4().makeRotationZ(-(Math.PI * (this.twist * t)) / 180)
            newBase.multiply(smoothRotation)
            
            const transformedStart = startPoints.map((point, j) => {
                const finalPoint = point.clone().lerp(finalPoints[j], t)
                return finalPoint.applyMatrix4(newBase)
            })

            const transformedNormal = new THREE.Vector3();
            const transformedBinormal = new THREE.Vector3();
            const transformedTangent = new THREE.Vector3();
            newBase.extractBasis(transformedBinormal, transformedNormal, transformedTangent);
            frenetFrames.push([path, transformedTangent, transformedNormal, transformedBinormal])

            sweepSurface.push(transformedStart)
        }

        return [sweepSurface, frenetFrames]
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

    FrenetFramesArrowHelpers(frames: THREE.Vector3[][])
    {
        const result: THREE.ArrowHelper[][] = []
        frames.forEach((frame, i) => { 
            const [position, tangent, normal, binormal] = frame
            result.push([
                new THREE.ArrowHelper(tangent, position, 0.5, 0xff0000),
                new THREE.ArrowHelper(normal, position, 0.5, 0x00ff00),
                new THREE.ArrowHelper(binormal, position, 0.5, 0x0000ff)
            ])
        })

        return result
    }

    SetTexture(newState: boolean)
    {
        console.dir(newState)
        this.isTextured = newState;

        if (this.isTextured) {
            // @ts-ignore
            this.mesh.material.map = this.texture;

            // @ts-ignore
            this.mesh.material.needsUpdate = true;
        } else {
            // @ts-ignore
            this.mesh.material.map = null;

            // @ts-ignore
            this.mesh.material.needsUpdate = true;
        }
    }
}