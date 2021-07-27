const { VoxelFaceGeometry, BitOps } = require("@ovistek/bvx.ts");
const fs = require("fs-extra");

const indices = [];
const indicesFlipped = [];

indices[VoxelFaceGeometry.X_POS_INDEX] = [1, 2, 0, 1, 3, 2];
indices[VoxelFaceGeometry.X_NEG_INDEX] = [0, 1, 3, 0, 3, 2];
indices[VoxelFaceGeometry.Y_POS_INDEX] = [0, 1, 2, 2, 1, 3];
indices[VoxelFaceGeometry.Y_NEG_INDEX] = [0, 2, 1, 1, 2, 3];
indices[VoxelFaceGeometry.Z_POS_INDEX] = [0, 1, 2, 0, 2, 3];
indices[VoxelFaceGeometry.Z_NEG_INDEX] = [0, 2, 1, 0, 3, 2];

indicesFlipped[VoxelFaceGeometry.X_POS_INDEX] = [1, 0, 2, 1, 2, 3];
indicesFlipped[VoxelFaceGeometry.X_NEG_INDEX] = [0, 3, 1, 0, 2, 3];
indicesFlipped[VoxelFaceGeometry.Y_POS_INDEX] = [0, 2, 1, 2, 3, 1];
indicesFlipped[VoxelFaceGeometry.Y_NEG_INDEX] = [0, 1, 2, 1, 3, 2];
indicesFlipped[VoxelFaceGeometry.Z_POS_INDEX] = [0, 2, 1, 0, 3, 2];
indicesFlipped[VoxelFaceGeometry.Z_NEG_INDEX] = [0, 1, 2, 0, 2, 3];

const generator = (path, isFlipped = false) => {
    const ind = isFlipped ? indicesFlipped : indices;

    let indicesOut = "";

    // generate indices for each bit-voxel variation. There are 64
    // variations in total
    for (let i = 0; i < 64; i++) {
        const bvx = i;

        let bvxgen = "new Uint32Array([";
        let offset = 0;

        // generate the index to render +x
        if (BitOps.bitAt(bvx, VoxelFaceGeometry.X_POS_INDEX) === 1) {
            const windex = ind[VoxelFaceGeometry.X_POS_INDEX];

            for (let j = 0; j < windex.length; j++) {
                bvxgen += (windex[j] + offset) + ",";
            }
        }

        offset += 4;

        // generate the index to render -x
        if (BitOps.bitAt(bvx, VoxelFaceGeometry.X_NEG_INDEX) === 1) {
            const windex = ind[VoxelFaceGeometry.X_NEG_INDEX];

            for (let j = 0; j < windex.length; j++) {
                bvxgen += (windex[j] + offset) + ",";
            }
        }

        offset += 4;

        // generate the index to render +y
        if (BitOps.bitAt(bvx, VoxelFaceGeometry.Y_POS_INDEX) === 1) {
            const windex = ind[VoxelFaceGeometry.Y_POS_INDEX];

            for (let j = 0; j < windex.length; j++) {
                bvxgen += (windex[j] + offset) + ",";
            }
        }

        offset += 4;

        // generate the index to render -y
        if (BitOps.bitAt(bvx, VoxelFaceGeometry.Y_NEG_INDEX) === 1) {
            const windex = ind[VoxelFaceGeometry.Y_NEG_INDEX];

            for (let j = 0; j < windex.length; j++) {
                bvxgen += (windex[j] + offset) + ",";
            }
        }

        offset += 4;

        // generate the index to render +z
        if (BitOps.bitAt(bvx, VoxelFaceGeometry.Z_POS_INDEX) === 1) {
            const windex = ind[VoxelFaceGeometry.Z_POS_INDEX];

            for (let j = 0; j < windex.length; j++) {
                bvxgen += (windex[j] + offset) + ",";
            }
        }

        offset += 4;

        // generate the index to render -z
        if (BitOps.bitAt(bvx, VoxelFaceGeometry.Z_NEG_INDEX) === 1) {
            const windex = ind[VoxelFaceGeometry.Z_NEG_INDEX];

            for (let j = 0; j < windex.length; j++) {
                bvxgen += (windex[j] + offset) + ",";
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
    fs.writeFileSync(path, "export default new Array<Uint32Array>(" + indicesOut + ");");
};

module.exports = {
    generate: generator,
    indices: indices,
    indicedFlipped: indicesFlipped
};