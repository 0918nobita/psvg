import { pipe } from 'fp-ts/lib/pipeable';
import * as E from 'fp-ts/lib/Either';
import { Either, left, right } from 'fp-ts/lib/Either';

export type PSVGExpr = PSVGBinExpr | PSVGUnaryExpr | PSVGLiteral;

type PSVGBinOp = '+' | '-' | '*' | '/';

interface PSVGBinExpr {
  kind: 'binExpr';
  lhs: PSVGExpr;
  op: PSVGBinOp;
  rhs: PSVGExpr;
}

interface PSVGUnaryExpr {
  kind: 'unaryExpr';
  op: '+' | '-';
  expr: PSVGExpr;
}

interface PSVGLiteral {
  kind: 'literal';
  value: PSVGValue;
}

export type PSVGValue = PSVGNum | PSVGArray;

interface PSVGNum {
  kind: 'number';
  value: number;
}

interface PSVGArray {
  kind: 'array';
  value: PSVGValue[];
}

function isNum(value: PSVGValue): value is PSVGNum {
  return value.kind === 'number';
}

function isArray(value: PSVGValue): value is PSVGArray {
  return value.kind === 'array';
}

export const evalExpr = (expr: PSVGExpr): Either<string, PSVGValue> => {
  switch (expr.kind) {
    case 'binExpr':
      const { lhs, op, rhs } = expr;
      return pipe(
        evalExpr(lhs),
        E.chain((lhs) =>
          pipe(
            evalExpr(rhs),
            E.chain((rhs) => evalBinExpr(lhs, op, rhs))
          )
        )
      );
  }
};

function evalBinExpr(
  lhs: PSVGValue,
  op: PSVGBinOp,
  rhs: PSVGValue
): Either<string, PSVGValue> {
  if (!isNum(lhs))
    return left('lefthand-side of the operator + must be number');
  if (!isNum(rhs))
    return left('righthand-side of the operator + must be number');
  const { value: lhsVal } = lhs;
  const { value: rhsVal } = rhs;
  let value: number;
  switch (op) {
    case '+':
      value = lhsVal + rhsVal;
      break;
    case '-':
      value = lhsVal - rhsVal;
      break;
    case '*':
      value = lhsVal * rhsVal;
      break;
    case '/':
      value = lhsVal / lhsVal;
      break;
    default:
      return left(`unexpected operator: ${op}`);
  }
  return right({ kind: 'number', value });
}
