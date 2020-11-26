import { interpretPSVG } from './interpreter';
import { parsePSVG } from './parser';
import { transpilePSVG } from './transpiler';

export function evalPSVG(js: string): string {
  return Function(`"use strict";${js};return __out;`)();
}

export function compilePSVG(psvg: string): string {
  const prgm = parsePSVG(psvg);
  // console.dir(prgm,{depth:null});
  console.log(interpretPSVG(prgm));
  const js = transpilePSVG(prgm);
  // console.log(js);
  return evalPSVG(js);
}
