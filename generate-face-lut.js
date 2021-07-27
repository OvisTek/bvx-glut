/**
 * This independently executed script generates all required static LUT tables
 * for BVX Rendering. Use the BVX Engine to process these LUT tables correctly.
 */
const indices = require("./generators/generate-indices");
const normals = require("./generators/generate-normals");
const vertices = require("./generators/generate-vertices");
const uv = require("./generators/generate-uv");

// run the generators and output the required files
indices.generate("./src/lut/bvx-indices.ts", false);
indices.generate("./src/lut/bvx-indices-flipped.ts", true);
normals.generate("./src/lut/bvx-normals.ts");
vertices.generate("./src/lut/bvx-vertices.ts");
uv.generate("./src/lut/bvx-uv.ts");