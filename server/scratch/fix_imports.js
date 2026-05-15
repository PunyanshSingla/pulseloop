import fs from 'fs';
import path from 'path';

function walk(dir, callback) {
  fs.readdirSync(dir).forEach( f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walk(dirPath, callback) : callback(path.join(dir, f));
  });
};

const importRegex = /(import|export)(.*?)from\s+["'](\.\.?\/[^"']+)["']/gs;

walk('src', (filePath) => {
  if (filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;
    
    let newContent = content.replace(importRegex, (match, keyword, middle, importPath) => {
      // Skip if it already has an extension
      if (importPath.endsWith('.js') || importPath.endsWith('.json') || importPath.endsWith('.css')) {
        return match;
      }
      
      if (importPath.endsWith('.ts')) {
        changed = true;
        return `${keyword}${middle}from "${importPath.slice(0, -3)}.js"`;
      }
      
      changed = true;
      return `${keyword}${middle}from "${importPath}.js"`;
    });
    
    if (changed) {
      fs.writeFileSync(filePath, newContent);
      console.log(`Updated: ${filePath}`);
    }
  }
});
