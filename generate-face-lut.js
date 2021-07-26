/**
 * This independently executed script generates all required static LUT tables
 * for BVX Rendering. Use the BVX Engine to process these LUT tables correctly.
 */
const { VoxelFaceGeometry, VoxelChunk, VoxelIndex, BitOps } = require("@ovistek/bvx.ts");
const fs = require("fs-extra");

const VERTICES_LUT_PATH = "./src/lut/bvx-vertices.ts";
const NORMALS_LUT_PATH = "./src/lut/bvx-normals.ts";
const INDICES_LUT_PATH = "./src/lut/bvx-indices.ts";
const INDICES_FLIPPED_LUT_PATH = "./src/lut/bvx-indices-flipped.ts";

const normalize = (a) => {
    const length = Math.sqrt((a[0] * a[0]) + (a[1] * a[1]) + (a[2] * a[2]));

    a[0] = a[0] / length;
    a[1] = a[1] / length;
    a[2] = a[2] / length;

    return a;
};

// total nmber of bitvoxels
const vxSize = VoxelChunk.SIZE;
const bvSize = VoxelChunk.BVX_SUBDIV;

// the total number of bitvoxels in a single chunk
const totalCount = (vxSize * vxSize * vxSize) * (bvSize * bvSize * bvSize);
const bvxRenderSize = 1.0;
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
const n0 = normalize([-1, -1, -1]);
const n1 = normalize([-1, 1, -1]);
const n2 = normalize([1, 1, -1]);
const n3 = normalize([1, -1, -1]);
const n4 = normalize([-1, -1, 1]);
const n5 = normalize([-1, 1, 1]);
const n6 = normalize([1, 1, 1]);
const n7 = normalize([1, -1, 1]);

const normals = [];

normals[VoxelFaceGeometry.X_POS_INDEX] = [n2, n3, n6, n7];
normals[VoxelFaceGeometry.X_NEG_INDEX] = [n0, n1, n4, n5];
normals[VoxelFaceGeometry.Y_POS_INDEX] = [n1, n2, n5, n6];
normals[VoxelFaceGeometry.Y_NEG_INDEX] = [n0, n3, n4, n7];
normals[VoxelFaceGeometry.Z_POS_INDEX] = [n4, n5, n6, n7];
normals[VoxelFaceGeometry.Z_NEG_INDEX] = [n0, n1, n2, n3];

// indices for each vertex, 2 triangles per face
const xPosi = [1, 2, 0, 1, 3, 2];
const xNegi = [0, 1, 3, 0, 3, 2];
const yPosi = [0, 1, 2, 2, 1, 3];
const yNegi = [0, 2, 1, 1, 2, 3];
const zPosi = [0, 1, 2, 0, 2, 3];
const zNegi = [0, 2, 1, 0, 3, 2];

// flipped indices
const xPosif = [1, 0, 2, 1, 2, 3];
const xNegif = [0, 3, 1, 0, 2, 3];
const yPosif = [0, 2, 1, 2, 3, 1];
const yNegif = [0, 1, 2, 1, 3, 2];
const zPosif = [0, 2, 1, 0, 3, 2];
const zNegif = [0, 1, 2, 0, 2, 3];

const indices = [];
const indicesf = [];

indices[VoxelFaceGeometry.X_POS_INDEX] = xPosi;
indices[VoxelFaceGeometry.X_NEG_INDEX] = xNegi;
indices[VoxelFaceGeometry.Y_POS_INDEX] = yPosi;
indices[VoxelFaceGeometry.Y_NEG_INDEX] = yNegi;
indices[VoxelFaceGeometry.Z_POS_INDEX] = zPosi;
indices[VoxelFaceGeometry.Z_NEG_INDEX] = zNegi;

indicesf[VoxelFaceGeometry.X_POS_INDEX] = xPosif;
indicesf[VoxelFaceGeometry.X_NEG_INDEX] = xNegif;
indicesf[VoxelFaceGeometry.Y_POS_INDEX] = yPosif;
indicesf[VoxelFaceGeometry.Y_NEG_INDEX] = yNegif;
indicesf[VoxelFaceGeometry.Z_POS_INDEX] = zPosif;
indicesf[VoxelFaceGeometry.Z_NEG_INDEX] = zNegif;

let verticesOut = "[";
let normalsOut = "[";
let indicesOut = "";
let indicesFlippedOut = "";

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
            const norm = nx[j];

            // x pos
            verticesOut += "" + ((vert[0] / bvxRenderInv) + worldX) + ",";
            // y pos
            verticesOut += "" + ((vert[1] / bvxRenderInv) + worldY) + ",";
            // z pos
            verticesOut += "" + ((vert[2] / bvxRenderInv) + worldZ) + ",";

            // write the normal corresponding to this particular face
            // x pos
            normalsOut += "" + norm[0] + ",";
            // y pos
            normalsOut += "" + norm[1] + ",";
            // z pos
            normalsOut += "" + norm[2] + ",";
        }
    }
}

// generate indices for each bit-voxel variation. There are 64
// variations in total
for (let i = 0; i < 64; i++) {
    const bvx = i;

    let bvxgen = "new Int32Array([";
    let bvxgenf = "new Int32Array([";

    let offset = 0;

    // generate the index to render +x
    if (BitOps.bitAt(bvx, VoxelFaceGeometry.X_POS_INDEX) === 1) {
        const windex = indices[VoxelFaceGeometry.X_POS_INDEX];

        for (let j = 0; j < windex.length; j++) {
            bvxgen += (windex[j] + offset) + ",";
        }

        const windexf = indicesf[VoxelFaceGeometry.X_POS_INDEX];

        for (let j = 0; j < windexf.length; j++) {
            bvxgenf += (windexf[j] + offset) + ",";
        }
    }

    offset += 4;

    // generate the index to render -x
    if (BitOps.bitAt(bvx, VoxelFaceGeometry.X_NEG_INDEX) === 1) {
        const windex = indices[VoxelFaceGeometry.X_NEG_INDEX];

        for (let j = 0; j < windex.length; j++) {
            bvxgen += (windex[j] + offset) + ",";
        }

        const windexf = indicesf[VoxelFaceGeometry.X_NEG_INDEX];

        for (let j = 0; j < windexf.length; j++) {
            bvxgenf += (windexf[j] + offset) + ",";
        }
    }

    offset += 4;

    // generate the index to render +y
    if (BitOps.bitAt(bvx, VoxelFaceGeometry.Y_POS_INDEX) === 1) {
        const windex = indices[VoxelFaceGeometry.Y_POS_INDEX];

        for (let j = 0; j < windex.length; j++) {
            bvxgen += (windex[j] + offset) + ",";
        }

        const windexf = indicesf[VoxelFaceGeometry.Y_POS_INDEX];

        for (let j = 0; j < windexf.length; j++) {
            bvxgenf += (windexf[j] + offset) + ",";
        }
    }

    offset += 4;

    // generate the index to render -y
    if (BitOps.bitAt(bvx, VoxelFaceGeometry.Y_NEG_INDEX) === 1) {
        const windex = indices[VoxelFaceGeometry.Y_NEG_INDEX];

        for (let j = 0; j < windex.length; j++) {
            bvxgen += (windex[j] + offset) + ",";
        }

        const windexf = indicesf[VoxelFaceGeometry.Y_NEG_INDEX];

        for (let j = 0; j < windexf.length; j++) {
            bvxgenf += (windexf[j] + offset) + ",";
        }
    }

    offset += 4;

    // generate the index to render +z
    if (BitOps.bitAt(bvx, VoxelFaceGeometry.Z_POS_INDEX) === 1) {
        const windex = indices[VoxelFaceGeometry.Z_POS_INDEX];

        for (let j = 0; j < windex.length; j++) {
            bvxgen += (windex[j] + offset) + ",";
        }

        const windexf = indicesf[VoxelFaceGeometry.Z_POS_INDEX];

        for (let j = 0; j < windexf.length; j++) {
            bvxgenf += (windexf[j] + offset) + ",";
        }
    }

    offset += 4;

    // generate the index to render -z
    if (BitOps.bitAt(bvx, VoxelFaceGeometry.Z_NEG_INDEX) === 1) {
        const windex = indices[VoxelFaceGeometry.Z_NEG_INDEX];

        for (let j = 0; j < windex.length; j++) {
            bvxgen += (windex[j] + offset) + ",";
        }

        const windexf = indicesf[VoxelFaceGeometry.Z_NEG_INDEX];

        for (let j = 0; j < windexf.length; j++) {
            bvxgenf += (windexf[j] + offset) + ",";
        }
    }

    bvxgen = bvx !== 0 ? (bvxgen.slice(0, -1) + "])") : bvxgen + "])";
    bvxgenf = bvx !== 0 ? (bvxgenf.slice(0, -1) + "])") : bvxgenf + "])";

    indicesOut += bvxgen + ",";
    indicesFlippedOut += bvxgenf + ",";
}

// strip last character and close the array
verticesOut = verticesOut.slice(0, -1) + "]";
normalsOut = normalsOut.slice(0, -1) + "]";
indicesOut = indicesOut.slice(0, -1) + "";
indicesFlippedOut = indicesFlippedOut.slice(0, -1) + "";

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

try {
    fs.unlinkSync(INDICES_FLIPPED_LUT_PATH);
}
catch (e) { }

// write out the vertices and normals LUT
fs.ensureFileSync(VERTICES_LUT_PATH);
fs.writeFileSync(VERTICES_LUT_PATH, "export default new Float32Array(" + verticesOut + ");");
fs.ensureFileSync(NORMALS_LUT_PATH);
fs.writeFileSync(NORMALS_LUT_PATH, "export default new Float32Array(" + normalsOut + ");");
fs.ensureFileSync(INDICES_LUT_PATH);
fs.writeFileSync(INDICES_LUT_PATH, "export default new Array<Int32Array>(" + indicesOut + ");");
fs.ensureFileSync(INDICES_FLIPPED_LUT_PATH);
fs.writeFileSync(INDICES_FLIPPED_LUT_PATH, "export default new Array<Int32Array>(" + indicesFlippedOut + ");");