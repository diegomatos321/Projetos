export default function (radius, nphi, ntheta) {
    let vertices = [];
    let faces = [];
    let uvs = [];
    let normals = [];
    for (let i = 0; i <= nphi; i++) {
        let phi = Math.PI / nphi * i;
        for (let j = 0; j <= ntheta; j++) {
            let theta = Math.PI * 2 / ntheta * j;
            let normal = [Math.sin(phi) * Math.cos(theta),
            Math.sin(phi) * Math.sin(theta),
            Math.cos(phi)]
            normals.push(normal)
            vertices.push(normal.map(x => x * radius));
            uvs.push([j / ntheta, 1 - i / nphi]);
            if (i < nphi && j < ntheta) {
                faces.push(
                    [i * (ntheta + 1) + j, (i + 1) * (ntheta + 1) + j, (i + 1) * (ntheta + 1) + j + 1],
                    [i * (ntheta + 1) + j, (i + 1) * (ntheta + 1) + j + 1, i * (ntheta + 1) + j + 1])
            }
        }
    }
    return { vertices, faces, uvs, normals }
}