/**
 * This independently executed script generates all required static LUT tables
 * for BVX Rendering. Use the BVX Engine to process these LUT tables correctly.
 */
const generateIndices = require("./generators/generate-indices");
const generateNormals = require("./generators/generate-normals");
const generateVertices = require("./generators/generate-vertices");

const VERTICES_LUT_PATH = "./src/lut/bvx-vertices.ts";
const NORMALS_LUT_PATH = "./src/lut/bvx-normals.ts";
const NORMALS_FLIPPED_LUT_PATH = "./src/lut/bvx-normals-flipped.ts";
const INDICES_LUT_PATH = "./src/lut/bvx-indices.ts";
const INDICES_FLIPPED_LUT_PATH = "./src/lut/bvx-indices-flipped.ts";

generateIndices(INDICES_LUT_PATH, false);
generateIndices(INDICES_FLIPPED_LUT_PATH, true);
generateNormals(NORMALS_LUT_PATH, false);
generateNormals(NORMALS_FLIPPED_LUT_PATH, true);
generateVertices(VERTICES_LUT_PATH);