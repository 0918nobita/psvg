import { PSVGElement } from '../element';
import { PSVGValue } from './expr';
import { Either, left, right } from 'fp-ts/lib/Either';

interface Binding {
  name: string;
  value: PSVGValue;
}

type Env = Binding[];

export function interpretPSVG(prgm: PSVGElement[]): Either<string, unknown> {
  if (prgm.length === 0) return left('No element found');

  const first = prgm[0];

  if (first.tagName.toUpperCase() !== 'PSVG') return left('PSVG tag expected');

  const width = parseInt(first.attributes.width);
  const height = parseInt(first.attributes.height);

  const env: Env = [];

  for (const child of first.children) {
    switch (child.tagName.toUpperCase()) {
      case 'VAR':
        interpretVarDecl(child, env);
        break;
    }
  }

  return right({ width, height, env });
}

function interpretVarDecl(element: PSVGElement, env: Env) {
  if (element.tagName.toUpperCase() !== 'VAR') return left('VAR tag expected');

  for (const attr in element.attributes)
    env.push({
      name: attr,
      value: { kind: 'number', value: parseInt(element.attributes[attr]) },
    });
}
