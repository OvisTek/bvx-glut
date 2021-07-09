<h3 align="center">
  <img src="graphics/icon.png?raw=true" alt="OvisTek Logo" width="150">
</h3>

[![Twitter: @OvisTek](https://img.shields.io/badge/contact-OvisTek-blue.svg?style=flat)](https://twitter.com/OvisTek)
[![install size](https://packagephobia.com/badge?p=@ovistek/bvx-glut)](https://packagephobia.com/result?p=@ovistek/bvx-glut)
[![NPM](https://img.shields.io/npm/v/@ovistek/bvx-glut)](https://www.npmjs.com/package/@ovistek/bvx-glut)
[![License](https://img.shields.io/badge/license-MIT-orange.svg?style=flat)](LICENSE)

#### **Geometry Lookup Table (LUT) for [BitVoxel Engine](https://github.com/OvisTek/bvx.ts)**

* * *

Geometry Lookup Table (LUT) generates **vertices**, **normals** and **indices** used in 3D BitVoxel Rendering. This LUT is designed to work with _6 bit BitVoxel Geometry Indices_ output from the [BitVoxel Engine](https://github.com/OvisTek/bvx.ts).

### _**Installation**_

-   Install using [npm](https://www.npmjs.com/package/@ovistek/bvx-glut)

```console
npm install @ovistek/bvx-glut
```

### _**About**_

This pre-computed static LUT contains all possible different variations and mutations for Voxel Face Rendering. Invisible or fully occluded surfaces will not be rendered.

<h3 align="center">
  <img src="graphics/lut.png?raw=true" alt="BitVoxel LUT Image" width="500">
</h3>

### _**Acknowledgements**_

This tool relies on the following open source projects.

-   [bvx.ts](https://github.com/OvisTek/bvx.ts)
