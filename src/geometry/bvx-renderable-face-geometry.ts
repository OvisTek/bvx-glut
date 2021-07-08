import vertices from "../lut/bvx-vertices";
import normals from "../lut/bvx-normals";
import { VoxelFaceGeometry } from "@ovistek/bvx.ts";

/**
 * Allows computing a renderable geometry to visualise BitVoxels in a rendering engine
 */
export class BVXRenderableFaceGeometry {
    public static getVertices(): Float32Array {
        return vertices;
    }

    public static getNormals(): Float32Array {
        return normals;
    }

    public static getIndices(geometry: VoxelFaceGeometry, optres: Int32Array | null = null): Int32Array {
        const numerOfFaces: number = geometry.popCount();
        const numberOfIndices: number = numerOfFaces * 6;
        const result = optres || new Int32Array(numberOfIndices);

        // we must have enough room to store all our indices
        // each face has 2 triangles and each triangle has 3 indices
        if (result.length !== numberOfIndices) {
            throw new RangeError("FaceRenderableFaceGeometry.getIndices() - optional parameter does not have a valid length, expected " + numberOfIndices + " but was " + result.length);
        }

        return result;
    }
}