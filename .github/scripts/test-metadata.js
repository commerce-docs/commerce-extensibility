// This script validates that all .md files have required YAML metadata (aka frontmatter).
// Required metadata includes title, description, and keywords (for site search).
// Documentation for the actions/github-script:
// https://github.com/actions/github-script#run-a-separate-file

module.exports = testMetadata

const {glob} = require("glob")
const markdownFiles = glob('**/*.md', {ignore: 'node_modules/**'})

console.log('\x1b[35m ==== FRONTMATTER REPORT - STARTING ==================== \x1b[0m');
console.info('\x1b[36m [cmd + click] on the file path to open \x1b[0m');
  
function testMetadata() {
    return [
        markdownFiles.forEach(file => {
            if (!file.description || !file.keywords || !file.title) {
              console.log('\n\x1b[41mFail\x1b[0m - ' + file.fileAbsolutePath + ': ');
              if (!file.title) console.error('\x1b[33m\tMissing Title \x1b[0m');
              if (!file.description) console.error('\x1b[33m\tMissing Description \x1b[0m');
              if (!file.keywords) console.warn('\x1b[33m\tMissing Keywords \x1b[0m');
            } else {
                console.log('\x1b[42mPass\x1b[0m - ' + file.fileAbsolutePath);
                }
            }),
    ]
}

console.log('\x1b[35m ==== FRONTMATTER REPORT - FINISHED ==================== \x1b[0m');
