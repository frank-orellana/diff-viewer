class File {
}
class DiffFile {
    constructor() {
        this.A = new File();
        this.B = new File();
    }
}
export function diff(lines) {
    let line = lines.shift();
    let file = new DiffFile();
    const files = [];
    while (line != undefined) {
        let firstLine = line.trim();
        while (firstLine == '')
            firstLine = lines.shift();
        if (firstLine.startsWith('diff')) {
            file.type = 'git-diff';
            file.name = line.match(/[^\/]+$/)[0];
            let tmp = lines.shift();
            while (!tmp.startsWith('index')) {
                switch (tmp.match(/^\w+/)[0]) {
                    case 'new':
                        file.isNew = true;
                        break;
                    case 'deleted':
                        file.isDeleted = true;
                        break;
                }
                tmp = lines.shift();
            }
            file.index = tmp;
            file.A = new File();
            file.B = new File();
            file.A.path = lines.shift();
        }
        else {
            file.type = 'simple';
            file.name = firstLine;
            file.A.path = firstLine;
        }
        file.B.path = lines.shift();
        file.A.lines = file.A.path + "\n";
        file.B.lines = file.B.path + "\n";
        line = lines.shift();
        let linesBefore, linesDeleted, linesInserted, linesAfter;
        while (line != undefined && line.startsWith('@@')) {
            file.A.lines += (file.A.lines ? '\n' : '') + line;
            file.B.lines += (file.B.lines ? '\n' : '') + line;
            line = lines.shift();
            linesBefore = [];
            while (line != undefined && !line.startsWith('-') && !line.startsWith('+')) {
                linesBefore.push(line);
                line = lines.shift();
            }
            while (line != undefined && (line.startsWith('-') || line.startsWith('+'))) {
                linesDeleted = [];
                while (line != undefined && line.startsWith('-')) {
                    linesDeleted.push(line);
                    line = lines.shift();
                }
                linesInserted = [];
                while (line != undefined && line.startsWith('+')) {
                    linesInserted.push(line);
                    line = lines.shift();
                }
                while (linesDeleted.length < linesInserted.length)
                    linesDeleted.push('');
                while (linesDeleted.length > linesInserted.length)
                    linesInserted.push('');
                linesAfter = [];
                while (line != undefined && !line.startsWith('-') && !line.startsWith('+') && !line.startsWith('@@') && !line.startsWith('diff')) {
                    linesAfter.push(line);
                    line = lines.shift();
                }
                file.A.lines += (file.A.lines ? '\n' : '') + [linesBefore.join('\n'), linesDeleted.join('\n'), linesAfter.join('\n')].join('\n');
                file.B.lines += (file.B.lines ? '\n' : '') + [linesBefore.join('\n'), linesInserted.join('\n'), linesAfter.join('\n')].join('\n');
            }
        }
        files.push(file);
        file = new DiffFile();
    }
    return files;
}
