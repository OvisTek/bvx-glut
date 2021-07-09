import vertices from "../lut/bvx-vertices";
import normals from "../lut/bvx-normals";
import indices from "../lut/bvx-indices";
import { VoxelFaceGeometry } from "@ovistek/bvx.ts";

/**
 * Allows computing a renderable geometry to visualise BitVoxels in a rendering engine
 */
export class BVXRenderableFaceGeometry {
    /**
     * Returns a static vertices array that represents a single chunk of 
     * 4x4x4 Voxels or 16x16x16 BitVoxels.
     * 
     * NOTE: The returned array is a reference and should not be modified
     */
    public static getVertices(): Float32Array {
        return vertices;
    }

    /**
     * Returns a static normals array that represents a single chunk of
     * 4x4x4 Voxels or 16x16x16 BitVoxels.
     *
     * NOTE: The returned array is a reference and should not be modified
     */
    public static getNormals(): Float32Array {
        return normals;
    }

    /**
     * Provided a fully-configured and computed Voxel Geometry, generate the required indices
     * to be used for rendering purposes. These indices will refer to vertex and normal positions
     * as defined in getVertices() and getNormals().
     * 
     * Index computation must be re-done when Voxel Configuration changes
     * @param geometry - The compited Vixel Geometry to use for generating Renderable Indices
     * @param optres - (optional) results buffer to use, if missing will re-create
     * @returns - Index Array to be used for Rendering
     */
    public static getIndices(geometry: VoxelFaceGeometry, optres: Int32Array | null = null): Int32Array {
        const numerOfFaces: number = geometry.popCount();
        const numberOfIndices: number = numerOfFaces * 6;
        const result = optres || new Int32Array(numberOfIndices);

        // we must have enough room to store all our indices
        // each face has 2 triangles and each triangle has 3 indices
        if (result.length !== numberOfIndices) {
            throw new RangeError("BVXRenderableFaceGeometry.getIndices() - optional parameter does not have a valid length, expected " + numberOfIndices + " but was " + result.length);
        }

        const geometryIndices: Uint8Array = geometry.indices;
        const length: number = geometryIndices.length;
        const renderableIndices: Array<Int32Array> = indices;

        let counter = 0;

        for (let index: number = 0; index < length; index++) {
            const gi: number = geometryIndices[index];

            // there is nothing to render for this index, just skip
            if (gi === 0) {
                continue;
            }

            // otherwise, we need to add and offset indices, check which
            // voxel configuration we want to render
            const configuration: Int32Array = renderableIndices[gi];
            const clength: number = configuration.length;

            // offset the indices to the desired voxel position and
            // add to the total
            for (let cindex: number = 0; cindex < clength; cindex++) {
                result[counter] = configuration[cindex] + (index * 24);
                counter++;
            }
        }

        return result;
    }
}