const { VoxelIndex, VoxelChunk, VoxelFaceGeometry } = require("@ovistek/bvx.ts");
const fs = require("fs-extra");
const { Vector3 } = require("three");

// vertices that makes up a single full cube
const v0 = new Vector3(0, 0, 0);
const v1 = new Vector3(0, 1, 0);
const v2 = new Vector3(1, 1, 0);
const v3 = new Vector3(1, 0, 0);
const v4 = new Vector3(0, 0, 1);
const v5 = new Vector3(0, 1, 1);
const v6 = new Vector3(1, 1, 1);
const v7 = new Vector3(1, 0, 1);

const vertices = [];

vertices[VoxelFaceGeometry.X_POS_INDEX] = [v2, v3, v6, v7];
vertices[VoxelFaceGeometry.X_NEG_INDEX] = [v0, v1, v4, v5];
vertices[VoxelFaceGeometry.Y_POS_INDEX] = [v1, v2, v5, v6];
vertices[VoxelFaceGeometry.Y_NEG_INDEX] = [v0, v3, v4, v7];
vertices[VoxelFaceGeometry.Z_POS_INDEX] = [v4, v5, v6, v7];
vertices[VoxelFaceGeometry.Z_NEG_INDEX] = [v0, v1, v2, v3];

const generator = (path) => {

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

        for (let index = 0; index < 6; index++) {
            const px = vertices[index];

            // write vertices - 4 vertices per face
            for (let j = 0; j < px.length; j++) {
                const vert = px[j];

                verticesOut += "" + ((vert.x / bvxRenderInv) + worldX) + ",";
                verticesOut += "" + ((vert.y / bvxRenderInv) + worldY) + ",";
                verticesOut += "" + ((vert.z / bvxRenderInv) + worldZ) + ",";
            }
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

module.exports = {
    generate: generator,
    vertices: vertices
};