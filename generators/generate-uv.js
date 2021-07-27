const { VoxelChunk, VoxelFaceGeometry } = require("@ovistek/bvx.ts");
const fs = require("fs-extra");
const { Vector2 } = require("three");

// uv mapping a cube
const u0 = new Vector2(0, 0);
const u1 = new Vector2(0, 1);
const u2 = new Vector2(1, 0);
const u3 = new Vector2(1, 1);

const uv = [];

uv[VoxelFaceGeometry.X_POS_INDEX] = [u3, u2, u1, u0];
uv[VoxelFaceGeometry.X_NEG_INDEX] = [u0, u1, u2, u3];//[u2, u3, u0, u1];//[u0, u1, u2, u3];
uv[VoxelFaceGeometry.Y_POS_INDEX] = [u0, u1, u2, u3];
uv[VoxelFaceGeometry.Y_NEG_INDEX] = [u0, u1, u2, u3];
uv[VoxelFaceGeometry.Z_POS_INDEX] = [u0, u1, u3, u2];
uv[VoxelFaceGeometry.Z_NEG_INDEX] = [u2, u3, u1, u0];//[u0, u2, u3, u1];//[u2, u3, u1, u0];

const generator = (path) => {

    // total nmber of bitvoxels
    const vxSize = VoxelChunk.SIZE;
    const bvSize = VoxelChunk.BVX_SUBDIV;

    // the total number of bitvoxels in a single chunk
    const totalCount = (vxSize * vxSize * vxSize) * (bvSize * bvSize * bvSize);

    let uvOut = "[";

    for (let i = 0; i < totalCount; i++) {

        for (let index = 0; index < 6; index++) {
            const ux = uv[index];

            for (let j = 0; j < ux.length; j++) {
                const uvc = ux[j];

                uvOut += "" + uvc.x + ",";
                uvOut += "" + uvc.y + ",";
            }
        }
    }

    uvOut = uvOut.slice(0, -1) + "]";

    try {
        fs.unlinkSync(path);
    }
    catch (e) { }

    fs.ensureFileSync(path);
    fs.writeFileSync(path, "export default new Float32Array(" + uvOut + ");");
};

module.exports = {
    generate: generator,
    uv: uv
};