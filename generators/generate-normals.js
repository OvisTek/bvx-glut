const { VoxelChunk } = require("@ovistek/bvx.ts");
const fs = require("fs-extra");

const normalize = (a) => {
    const length = Math.sqrt((a[0] * a[0]) + (a[1] * a[1]) + (a[2] * a[2]));

    a[0] = a[0] / length;
    a[1] = a[1] / length;
    a[2] = a[2] / length;

    return a;
};

const generator = (path) => {
    // vertices that makes up a single full cube
    const n0 = normalize([-1, -1, -1]);
    const n1 = normalize([-1, 1, -1]);
    const n2 = normalize([1, 1, -1]);
    const n3 = normalize([1, -1, -1]);
    const n4 = normalize([-1, -1, 1]);
    const n5 = normalize([-1, 1, 1]);
    const n6 = normalize([1, 1, 1]);
    const n7 = normalize([1, -1, 1]);

    const normals = [n0, n1, n2, n3, n4, n5, n6, n7];

    // total nmber of bitvoxels
    const vxSize = VoxelChunk.SIZE;
    const bvSize = VoxelChunk.BVX_SUBDIV;

    // the total number of bitvoxels in a single chunk
    const totalCount = (vxSize * vxSize * vxSize) * (bvSize * bvSize * bvSize);

    let normalsOut = "[";

    // loop though all bitvoxels and generate the array of vertices
    // for each bitvoxel position - this will be written to a file
    for (let i = 0; i < totalCount; i++) {
        // write the vertices for the provided cube at provided coordinate
        for (let j = 0; j < normals.length; j++) {
            // x pos
            normalsOut += "" + normals[j][0] + ",";
            // y pos
            normalsOut += "" + normals[j][1] + ",";
            // z pos
            normalsOut += "" + normals[j][2] + ",";
        }
    }

    normalsOut = normalsOut.slice(0, -1) + "]";

    try {
        fs.unlinkSync(path);
    }
    catch (e) { }

    fs.ensureFileSync(path);
    fs.writeFileSync(path, "export default new Float32Array(" + normalsOut + ");");
};

module.exports = generator;