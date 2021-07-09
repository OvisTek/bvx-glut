/**
 * This independently executed script generates all required static LUT tables
 * for BVX Rendering. Use the BVX Engine to process these LUT tables correctly.
 */

const { VoxelFaceGeometry, VoxelChunk, VoxelIndex, BitOps } = require("@ovistek/bvx.ts");
const fs = require("fs-extra");

const VERTICES_LUT_PATH = "./src/lut/bvx-vertices.ts";
const NORMALS_LUT_PATH = "./src/lut/bvx-normals.ts";
const INDICES_LUT_PATH = "./src/lut/bvx-indices.ts";

// total nmber of bitvoxels
const vxSize = VoxelChunk.SIZE;
const bvSize = VoxelChunk.BVX_SUBDIV;

// the total number of bitvoxels in a single chunk
const totalCount = (vxSize * vxSize * vxSize) * (bvSize * bvSize * bvSize);
const bvxRenderSize = 0.25;
const bvxRenderInv = 1.0 / bvxRenderSize;

// vertices that makes up a single full cube
const v0 = [0, 0, 0];
const v1 = [0, 1, 0];
const v2 = [1, 1, 0];
const v3 = [1, 0, 0];
const v4 = [0, 0, 1];
const v5 = [0, 1, 1];
const v6 = [1, 1, 1];
const v7 = [1, 0, 1];

const vertices = [];

vertices[VoxelFaceGeometry.X_POS_INDEX] = [v2, v3, v6, v7];//[v3, v6, v2, v3, v7, v6];
vertices[VoxelFaceGeometry.X_NEG_INDEX] = [v0, v1, v4, v5];//[v0, v1, v5, v0, v5, v4];
vertices[VoxelFaceGeometry.Y_POS_INDEX] = [v1, v2, v5, v6];//[v1, v2, v5, v5, v2, v6];
vertices[VoxelFaceGeometry.Y_NEG_INDEX] = [v0, v3, v4, v7];//[v0, v4, v3, v3, v4, v7];
vertices[VoxelFaceGeometry.Z_POS_INDEX] = [v4, v5, v6, v7];//[v4, v5, v6, v4, v6, v7];
vertices[VoxelFaceGeometry.Z_NEG_INDEX] = [v0, v1, v2, v3];//[v0, v2, v1, v0, v3, v2];

// these are the normals for each face
const xPosn = [1, 0, 0];
const xNegn = [-1, 0, 0];
const yPosn = [0, 1, 0];
const yNegn = [0, -1, 0];
const zPosn = [0, 0, 1];
const zNegn = [0, 0, -1];

const normals = [];

normals[VoxelFaceGeometry.X_POS_INDEX] = xPosn;
normals[VoxelFaceGeometry.X_NEG_INDEX] = xNegn;
normals[VoxelFaceGeometry.Y_POS_INDEX] = yPosn;
normals[VoxelFaceGeometry.Y_NEG_INDEX] = yNegn;
normals[VoxelFaceGeometry.Z_POS_INDEX] = zPosn;
normals[VoxelFaceGeometry.Z_NEG_INDEX] = zNegn;

// indices for each vertex, 2 triangles per face
const xPosi = [1, 2, 0, 1, 3, 2];//[v2, v3, v6, v7]; //[3, 6, 2, 3, 7, 6];
const xNegi = [0, 1, 3, 0, 3, 2];//[v0, v1, v4, v5]; //[0, 1, 5, 0, 5, 4];
const yPosi = [0, 1, 2, 2, 1, 3];//[v1, v2, v5, v6]; //[1, 2, 5, 5, 2, 6];
const yNegi = [0, 2, 1, 1, 2, 3];//[v0, v3, v4, v7]; //[0, 4, 3, 3, 4, 7];
const zPosi = [0, 1, 2, 0, 2, 3];//[v4, v5, v6, v7]; //[4, 5, 6, 4, 6, 7];
const zNegi = [0, 2, 1, 0, 3, 2];//[v0, v1, v2, v3]; //[0, 2, 1, 0, 3, 2];

const indices = [];

indices[VoxelFaceGeometry.X_POS_INDEX] = xPosi;
indices[VoxelFaceGeometry.X_NEG_INDEX] = xNegi;
indices[VoxelFaceGeometry.Y_POS_INDEX] = yPosi;
indices[VoxelFaceGeometry.Y_NEG_INDEX] = yNegi;
indices[VoxelFaceGeometry.Z_POS_INDEX] = zPosi;
indices[VoxelFaceGeometry.Z_NEG_INDEX] = zNegi;

let verticesOut = "[";
let normalsOut = "[";
let indicesOut = "";

// loop though all bitvoxels and generate the array of vertices
// for each bitvoxel position - this will be written to a file
for (let i = 0; i < totalCount; i++) {
    // this tells us the bit-voxel position
    const coord = new VoxelIndex(i);

    // these are the actual voxel positions in the chunk
    const worldX = coord.vx + (coord.bx / bvxRenderInv);
    const worldY = coord.vy + (coord.by / bvxRenderInv);
    const worldZ = coord.vz + (coord.bz / bvxRenderInv);

    // for each face - cube has 6 faces
    for (let index = 0; index < 6; index++) {
        const nx = normals[index];
        const px = vertices[index];

        // write vertices - 4 vertices per face
        for (let j = 0; j < px.length; j++) {
            const vert = px[j];

            // x pos
            verticesOut += "" + ((vert[0] / bvxRenderInv) + worldX) + ",";
            // y pos
            verticesOut += "" + ((vert[1] / bvxRenderInv) + worldY) + ",";
            // z pos
            verticesOut += "" + ((vert[2] / bvxRenderInv) + worldZ) + ",";

            // write the normal corresponding to this particular face
            // x pos
            normalsOut += "" + nx[0] + ",";
            // y pos
            normalsOut += "" + nx[1] + ",";
            // z pos
            normalsOut += "" + nx[2] + ",";
        }
    }
}

// generate indices for each bit-voxel variation. There are 64
// variations in total
for (let i = 0; i < 64; i++) {
    const bvx = i;

    let bvxgen = "new Int32Array([";

    let offset = 0;

    // generate the index to render +x
    if (BitOps.bitAt(bvx, VoxelFaceGeometry.X_POS_INDEX) === 1) {
        const windex = indices[VoxelFaceGeometry.X_POS_INDEX];

        for (let j = 0; j < windex.length; j++) {
            bvxgen += (windex[j] + offset) + ",";
        }
    }

    offset += 4;

    // generate the index to render -x
    if (BitOps.bitAt(bvx, VoxelFaceGeometry.X_NEG_INDEX) === 1) {
        const windex = indices[VoxelFaceGeometry.X_NEG_INDEX];

        for (let j = 0; j < windex.length; j++) {
            bvxgen += (windex[j] + offset) + ",";
        }
    }

    offset += 4;

    // generate the index to render +y
    if (BitOps.bitAt(bvx, VoxelFaceGeometry.Y_POS_INDEX) === 1) {
        const windex = indices[VoxelFaceGeometry.Y_POS_INDEX];

        for (let j = 0; j < windex.length; j++) {
            bvxgen += (windex[j] + offset) + ",";
        }
    }

    offset += 4;

    // generate the index to render -y
    if (BitOps.bitAt(bvx, VoxelFaceGeometry.Y_NEG_INDEX) === 1) {
        const windex = indices[VoxelFaceGeometry.Y_NEG_INDEX];

        for (let j = 0; j < windex.length; j++) {
            bvxgen += (windex[j] + offset) + ",";
        }
    }

    offset += 4;

    // generate the index to render +z
    if (BitOps.bitAt(bvx, VoxelFaceGeometry.Z_POS_INDEX) === 1) {
        const windex = indices[VoxelFaceGeometry.Z_POS_INDEX];

        for (let j = 0; j < windex.length; j++) {
            bvxgen += (windex[j] + offset) + ",";
        }
    }

    offset += 4;

    // generate the index to render -z
    if (BitOps.bitAt(bvx, VoxelFaceGeometry.Z_NEG_INDEX) === 1) {
        const windex = indices[VoxelFaceGeometry.Z_NEG_INDEX];

        for (let j = 0; j < windex.length; j++) {
            bvxgen += (windex[j] + offset) + ",";
        }
    }

    bvxgen = bvx !== 0 ? (bvxgen.slice(0, -1) + "])") : bvxgen + "])";

    indicesOut += bvxgen + ",";
}

// strip last character and close the array
verticesOut = verticesOut.slice(0, -1) + "]";
normalsOut = normalsOut.slice(0, -1) + "]";
indicesOut = indicesOut.slice(0, -1) + "";

try {
    fs.unlinkSync(VERTICES_LUT_PATH);
}
catch (e) { }

try {
    fs.unlinkSync(NORMALS_LUT_PATH);
}
catch (e) { }

try {
    fs.unlinkSync(INDICES_LUT_PATH);
}
catch (e) { }

// write out the vertices and normals LUT
fs.ensureFileSync(VERTICES_LUT_PATH);
fs.writeFileSync(VERTICES_LUT_PATH, "export default new Float32Array(" + verticesOut + ");");
fs.ensureFileSync(NORMALS_LUT_PATH);
fs.writeFileSync(NORMALS_LUT_PATH, "export default new Float32Array(" + normalsOut + ");");
fs.ensureFileSync(INDICES_LUT_PATH);
fs.writeFileSync(INDICES_LUT_PATH, "export default new Array<Int32Array>(" + indicesOut + ");");