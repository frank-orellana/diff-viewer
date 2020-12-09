import { diff } from './diff.js';
const test1 = `--- file1.txt   2018-01-11 10:39:38.237464052 +0000                                                                                              
+++ file2.txt   2018-01-11 10:40:00.323423021 +0000                                                                                              
@@ -1,4 +1,4 @@                                                                                                                                  
 cat                                                                                                                                             
-mv                                                                                                                                              
-comm                                                                                                                                            
 cp                                                                                                                                              
+diff                                                                                                                                            
+comm`;

import fs from 'fs';
import path from 'path';

const test2 = fs.readFileSync(path.join(process.cwd(),'tests/multi1.diff')).toString();

test('Basic diff file', () => {
	const diffString = test1;
	const files = diff(diffString.split('\n').map(l => l.trim()));
	expect(files).toHaveLength(1)
})

test('Diff 1 compared ok', () => {
	const diffString = test1;
	const files = diff(diffString.split('\n').map(l => l.trim()));

	expect(files[0].A.lines.split('\n')).toHaveLength(files[0].B.lines.split('\n').length);

})

test('Multi file diff', () => {
	const diffString = test2;
	const files = diff(diffString.split('\n').map(l => l.trim()));
	expect(files).toHaveLength(3);
})

test('Multi file diff 1 compared ok', () => {
	const diffString = test2;
	const files = diff(diffString.split('\n').map(l => l.trim()));

	expect(files[0].A.lines.split('\n')).toHaveLength(files[0].B.lines.split('\n').length);

})