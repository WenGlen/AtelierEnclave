import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const distPath = join(process.cwd(), 'dist');
const indexPath = join(distPath, 'index.html');

// 读取 index.html
let html = readFileSync(indexPath, 'utf-8');

// 替换资源路径，添加 base path
html = html.replace(/src="\/assets\//g, 'src="/AtelierEnclave/assets/');
html = html.replace(/href="\/assets\//g, 'href="/AtelierEnclave/assets/');

// 写回文件
writeFileSync(indexPath, html, 'utf-8');

console.log('✅ Fixed asset paths in index.html');

