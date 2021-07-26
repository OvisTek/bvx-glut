const { VoxelChunk } = require("@ovistek/bvx.ts");
const fs = require("fs-extra");

const normalize = (a) => {
    const length = Math.sqrt((a[0] * a[0]) + (a[1] * a[1]) + (a[2] * a[2]));

    a[0] = a[0] / length;
    a[1] = a[1] / length;
    a[2] = a[2] / length;

    return a;
};

const generator = (path, isFlipped = false) => {
    // vertices that makes up a single full cube
    const normals = [];

    if (isFlipped == false) {
        normals[0] = normalize([-1, -1, -1]);
        normals[1] = normalize([-1, 1, -1]);
        normals[2] = normalize([1, 1, -1]);
        normals[3] = normalize([1, -1, -1]);
        normals[4] = normalize([-1, -1, 1]);
        normals[5] = normalize([-1, 1, 1]);
        normals[6] = normalize([1, 1, 1]);
        normals[7] = normalize([1, -1, 1]);
    }
    else {
        normals[0] = normalize([1, 1, 1]);
        normals[1] = normalize([1, -1, 1]);
        normals[2] = normalize([-1, -1, 1]);
        normals[3] = normalize([-1, 1, 1]);
        normals[4] = normalize([1, 1, -1]);
        normals[5] = normalize([1, -1, -1]);
        normals[6] = normalize([-1, -1, -1]);
        normals[7] = normalize([-1, 1, -1]);
    }

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