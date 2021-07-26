const { VoxelIndex, VoxelChunk } = require("@ovistek/bvx.ts");
const fs = require("fs-extra");

const generator = (path) => {
    // vertices that makes up a single full cube
    const v0 = [0, 0, 0];
    const v1 = [0, 1, 0];
    const v2 = [1, 1, 0];
    const v3 = [1, 0, 0];
    const v4 = [0, 0, 1];
    const v5 = [0, 1, 1];
    const v6 = [1, 1, 1];
    const v7 = [1, 0, 1];

    const vertices = [v0, v1, v2, v3, v4, v5, v6, v7];

    // total nmber of bitvoxels
    const vxSize = VoxelChunk.SIZE;
    const bvSize = VoxelChunk.BVX_SUBDIV;

    // the total number of bitvoxels in a single chunk
    const totalCount = (vxSize * vxSize * vxSize) * (bvSize * bvSize * bvSize);
    const bvxRenderSize = 0.25;
    const bvxRenderInv = 1.0 / bvxRenderSize;

    let verticesOut = "[";

    // loop though all bitvoxels and generate the array of vertices
    // for each bitvoxel position - this will be written to a file
    for (let i = 0; i < totalCount; i++) {
        // this tells us the bit-voxel position
        const coord = new VoxelIndex(i);

        // these are the actual voxel positions in the chunk
        const worldX = coord.vx + (coord.bx / bvxRenderInv);
        const worldY = coord.vy + (coord.by / bvxRenderInv);
        const worldZ = coord.vz + (coord.bz / bvxRenderInv);

        // write the vertices for the provided cube at provided coordinate
        for (let j = 0; j < vertices.length; j++) {
            // x pos
            verticesOut += "" + ((vertices[j][0] / bvxRenderInv) + worldX) + ",";
            // y pos
            verticesOut += "" + ((vertices[j][1] / bvxRenderInv) + worldY) + ",";
            // z pos
            verticesOut += "" + ((vertices[j][2] / bvxRenderInv) + worldZ) + ",";
        }
    }

    verticesOut = verticesOut.slice(0, -1) + "]";

    try {
        fs.unlinkSync(path);
    }
    catch (e) { }

    fs.ensureFileSync(path);
    fs.writeFileSync(path, "export default new Float32Array(" + verticesOut + ");");
};

module.exports = generator;