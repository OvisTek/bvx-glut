const { VoxelFaceGeometry, BitOps } = require("@ovistek/bvx.ts");
const fs = require("fs-extra");

const generator = (path, isFlipped = false) => {
    const indices = [];

    if (isFlipped == false) {
        // indices for each vertex, 2 triangles per face
        indices[VoxelFaceGeometry.X_POS_INDEX] = [3, 6, 2, 3, 7, 6];
        indices[VoxelFaceGeometry.X_NEG_INDEX] = [0, 1, 5, 0, 5, 4];
        indices[VoxelFaceGeometry.Y_POS_INDEX] = [1, 2, 5, 5, 2, 6];
        indices[VoxelFaceGeometry.Y_NEG_INDEX] = [0, 4, 3, 3, 4, 7];
        indices[VoxelFaceGeometry.Z_POS_INDEX] = [4, 5, 6, 4, 6, 7];
        indices[VoxelFaceGeometry.Z_NEG_INDEX] = [0, 2, 1, 0, 3, 2];
    }
    else {
        // flipped indices
        indices[VoxelFaceGeometry.X_POS_INDEX] = [3, 2, 6, 3, 6, 7];
        indices[VoxelFaceGeometry.X_NEG_INDEX] = [0, 5, 1, 0, 4, 5];
        indices[VoxelFaceGeometry.Y_POS_INDEX] = [1, 5, 2, 5, 6, 2];
        indices[VoxelFaceGeometry.Y_NEG_INDEX] = [0, 3, 4, 3, 7, 4];
        indices[VoxelFaceGeometry.Z_POS_INDEX] = [4, 6, 5, 4, 7, 6];
        indices[VoxelFaceGeometry.Z_NEG_INDEX] = [0, 1, 2, 0, 2, 3];
    }

    let indicesOut = "";

    // generate indices for each bit-voxel variation. There are 64
    // variations in total
    for (let i = 0; i < 64; i++) {
        const bvx = i;

        let bvxgen = "new Int32Array([";

        // generate the index to render +x
        if (BitOps.bitAt(bvx, VoxelFaceGeometry.X_POS_INDEX) === 1) {
            const windex = indices[VoxelFaceGeometry.X_POS_INDEX];

            for (let j = 0; j < windex.length; j++) {
                bvxgen += windex[j] + ",";
            }
        }

        // generate the index to render -x
        if (BitOps.bitAt(bvx, VoxelFaceGeometry.X_NEG_INDEX) === 1) {
            const windex = indices[VoxelFaceGeometry.X_NEG_INDEX];

            for (let j = 0; j < windex.length; j++) {
                bvxgen += windex[j] + ",";
            }
        }

        // generate the index to render +y
        if (BitOps.bitAt(bvx, VoxelFaceGeometry.Y_POS_INDEX) === 1) {
            const windex = indices[VoxelFaceGeometry.Y_POS_INDEX];

            for (let j = 0; j < windex.length; j++) {
                bvxgen += windex[j] + ",";
            }
        }

        // generate the index to render -y
        if (BitOps.bitAt(bvx, VoxelFaceGeometry.Y_NEG_INDEX) === 1) {
            const windex = indices[VoxelFaceGeometry.Y_NEG_INDEX];

            for (let j = 0; j < windex.length; j++) {
                bvxgen += windex[j] + ",";
            }
        }

        // generate the index to render +z
        if (BitOps.bitAt(bvx, VoxelFaceGeometry.Z_POS_INDEX) === 1) {
            const windex = indices[VoxelFaceGeometry.Z_POS_INDEX];

            for (let j = 0; j < windex.length; j++) {
                bvxgen += windex[j] + ",";
            }
        }

        // generate the index to render -z
        if (BitOps.bitAt(bvx, VoxelFaceGeometry.Z_NEG_INDEX) === 1) {
            const windex = indices[VoxelFaceGeometry.Z_NEG_INDEX];

            for (let j = 0; j < windex.length; j++) {
                bvxgen += windex[j] + ",";
            }
        }

        bvxgen = bvx !== 0 ? (bvxgen.slice(0, -1) + "])") : bvxgen + "])";

        indicesOut += bvxgen + ",";
    }

    indicesOut = indicesOut.slice(0, -1) + "";

    try {
        fs.unlinkSync(path);
    }
    catch (e) { }

    fs.ensureFileSync(path);
    fs.writeFileSync(path, "export default new Array<Int32Array>(" + indicesOut + ");");
};

module.exports = generator;