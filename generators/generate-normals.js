const { VoxelChunk, VoxelFaceGeometry } = require("@ovistek/bvx.ts");
const fs = require("fs-extra");
const { Vector3 } = require("three");

const xPosn = new Vector3(1, 0, 0).normalize();
const xNegn = new Vector3(-1, 0, 0).normalize();
const yPosn = new Vector3(0, 1, 0).normalize();
const yNegn = new Vector3(0, -1, 0).normalize();
const zPosn = new Vector3(0, 0, 1).normalize();
const zNegn = new Vector3(0, 0, -1).normalize();

const normals = [];

normals[VoxelFaceGeometry.X_POS_INDEX] = [xPosn, xPosn, xPosn, xPosn];
normals[VoxelFaceGeometry.X_NEG_INDEX] = [xNegn, xNegn, xNegn, xNegn];
normals[VoxelFaceGeometry.Y_POS_INDEX] = [yPosn, yPosn, yPosn, yPosn];
normals[VoxelFaceGeometry.Y_NEG_INDEX] = [yNegn, yNegn, yNegn, yNegn];
normals[VoxelFaceGeometry.Z_POS_INDEX] = [zPosn, zPosn, zPosn, zPosn];
normals[VoxelFaceGeometry.Z_NEG_INDEX] = [zNegn, zNegn, zNegn, zNegn];

const generator = (path) => {
    // total nmber of bitvoxels
    const vxSize = VoxelChunk.SIZE;
    const bvSize = VoxelChunk.BVX_SUBDIV;

    // the total number of bitvoxels in a single chunk
    const totalCount = (vxSize * vxSize * vxSize) * (bvSize * bvSize * bvSize);

    let normalsOut = "[";

    // loop though all bitvoxels and generate the array of normals
    for (let i = 0; i < totalCount; i++) {
        for (let index = 0; index < 6; index++) {
            const nx = normals[index];

            // write normals - 4 normals per face
            for (let j = 0; j < nx.length; j++) {
                const norm = nx[j];

                normalsOut += "" + norm.x + ",";
                normalsOut += "" + norm.y + ",";
                normalsOut += "" + norm.z + ",";
            }
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

module.exports = {
    generate: generator,
    normals: normals
};