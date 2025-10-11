// Minimal esolang that uses only one emoji token
export function tokenize(program, tokenChar) {
  const chars = Array.from(program);
  let token = tokenChar || firstSymbol(chars);
  if (!token) return [];
  const nums = [];
  let count = 0;
  for (const ch of chars) {
    if (ch === token) count++;
    else {
      if (count > 0) nums.push(count);
      count = 0;
    }
  }
  if (count > 0) nums.push(count);
  return nums;
}

function firstSymbol(chars) {
  for (const ch of chars) {
    if (!/\s/.test(ch)) return ch;
  }
  return null;
}

export function runProgram(numbers, io = {}) {
  const out = [];
  const readNum = io.readNum || (() => 0);
  const write = io.write || (s => out.push(String(s)));
  const stack = [];
  let ip = 0; // instruction pointer over numbers
  const needArg = op => [1,11].includes(op);

  while (ip < numbers.length) {
    const op = numbers[ip++];
    let arg = null;
    if (needArg(op)) {
      if (ip >= numbers.length) break;
      arg = numbers[ip++];
    }
    switch (op) {
      case 1: stack.push(arg ?? 0); break;
      case 2: binop(stack, (a,b)=>a+b); break;
      case 3: binop(stack, (a,b)=>a-b); break;
      case 4: binop(stack, (a,b)=>a*b); break;
      case 5: binop(stack, (a,b)=>Math.trunc(a/b)); break;
      case 6: write(stack.length ? stack[stack.length-1] : 0); break;
      case 7: if (stack.length) stack.push(stack[stack.length-1]); break;
      case 8: if (stack.length>=2){ const a=stack.pop(), b=stack.pop(); stack.push(a,b);} break;
      case 9: if (stack.length) stack.pop(); break;
      case 10: stack.push(Number(readNum())||0); break;
      case 11: { const top = stack.length ? stack[stack.length-1] : 0; if (top===0) ip += toSigned(arg); } break;
      case 12: ip = numbers.length; break;
      default: /* no-op for unknown */ break;
    }
  }
  return out.join("\n");
}

function binop(stack, fn) {
  const b = stack.pop() ?? 0;
  const a = stack.pop() ?? 0;
  stack.push(fn(a,b));
}

function toSigned(u) {
  // Interpret counts as signed relative by mapping even=>positive, odd=>negative magnitude = floor(u/2)
  // Example: 2 -> +1, 3 -> -1, 4 -> +2, 5 -> -2
  const mag = Math.floor(u/2);
  return (u % 2 === 0) ? mag : -mag;
}

export function makeExample(emoji) {
  // Program: push 1; push 2; add; print; halt
  const seqs = [
    1, 1, // push 1
    1, 2, // push 2
    2,    // add
    6,    // print
    12    // halt
  ];
  return seqs.map(n => emoji.repeat(n)).join(" ");
}

