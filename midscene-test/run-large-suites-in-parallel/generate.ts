import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { parse, stringify } from 'yaml';

const count = Number(process.argv[2] || process.env.CASE_COUNT || 300);
if (!Number.isSafeInteger(count) || count < 1 || count > 10_000)
  throw new Error('CASE_COUNT must be an integer from 1 to 10000.');
const targets = ['web', 'android', 'ios'];
const template = readFileSync(
  new URL('./cases/todo.yaml', import.meta.url),
  'utf8',
);
const output = new URL('./generated/', import.meta.url);
rmSync(output, { recursive: true, force: true });
for (const target of targets)
  mkdirSync(new URL(`${target}/`, output), { recursive: true });

for (let index = 0; index < count; index++) {
  const id = String(index + 1).padStart(4, '0');
  const target = targets[index % targets.length];
  const document = parse(template.replaceAll('CASE_ID', id));
  // Rotate flows after each group of targets; each target sees all six flows.
  const selected =
    document.cases[Math.floor(index / targets.length) % document.cases.length];
  selected.name += ` #${id}`;
  writeFileSync(
    new URL(`${target}/${id}.yaml`, output),
    stringify({
      beforeEach: document.beforeEach,
      cases: [selected],
    }),
  );
}
console.log(
  `${count} unique cases → ${targets.join(' / ')}. YAML: ${fileURLToPath(output)}`,
);
