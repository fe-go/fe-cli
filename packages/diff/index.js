require('colors')
const Diff = require('diff')

const one = `require('colors');
const Diff = require('diff');
 
const one = 'beep boop';
const other = 'beep boob blah';
 
const diff = Diff.diffChars(one, other);
 
diff.forEach((part) => {
  // green for additions, red for deletions
  // grey for common parts
  const color = part.added ? 'green' :
    part.removed ? 'red' : 'grey';
  process.stderr.write(part.value[color]);
});
 
console.log();`
const other = `require('colors');
const Diff = require('diff');
 
const one = 'beep boop';
const other = 'beep boob blah';
 
const diffd = Diff.diffChars(one, other);
 
diff.forEach((part) => {
  // green for additions, red for deletions
  // grey for common parts
  const color = part.added ? 'green' :
    part.removed ? 'red' : 'grey';
//   process.stderr.write(part.value[color]);
});
 
console.log();`

const diff = Diff.diffLines(one, other)

diff.forEach((part) => {
  // green for additions, red for deletions
  // grey for common parts
  let text = ''
  if (part.added) {
    text = `+ ${part.value}`['green']
  } else if (part.removed) {
    text = `- ${part.value}`['red']
  } else {
    text = `\b\b${part.value}`['grey']
  }
  process.stdout.write(text)
})

console.log()