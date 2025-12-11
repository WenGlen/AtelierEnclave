import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const distPath = join(process.cwd(), 'dist');

// 檢查必要檔案
const requiredFiles = ['index.html', '404.html'];
const errors = [];

// 檢查必要檔案
for (const file of requiredFiles) {
  const filePath = join(distPath, file);
  if (!existsSync(filePath)) {
    errors.push(`${file} 不存在`);
  }
}

// 檢查 index.html 中的路徑並提取資源檔案
const indexPath = join(distPath, 'index.html');
if (!existsSync(indexPath)) {
  errors.push('index.html 不存在');
  console.log('❌ 檢查失敗：index.html 不存在');
  process.exit(1);
}

const html = readFileSync(indexPath, 'utf-8');

// 從 index.html 中提取實際的資源檔案路徑
const jsMatch = html.match(/src="([^"]+\.js)"/);
const cssMatch = html.match(/href="([^"]+\.css)"/);

if (jsMatch) {
  const jsPath = jsMatch[1].replace(/^\/AtelierEnclave\//, '');
  const jsFilePath = join(distPath, jsPath);
  if (!existsSync(jsFilePath)) {
    errors.push(`JS 檔案 ${jsPath} 不存在`);
  }
} else {
  errors.push('未找到 JS 檔案引用');
}

if (cssMatch) {
  const cssPath = cssMatch[1].replace(/^\/AtelierEnclave\//, '');
  const cssFilePath = join(distPath, cssPath);
  if (!existsSync(cssFilePath)) {
    errors.push(`CSS 檔案 ${cssPath} 不存在`);
  }
} else {
  errors.push('未找到 CSS 檔案引用');
}

const hasCorrectAssetPath = html.includes('/AtelierEnclave/assets/');
const hasRedirectScript = html.includes('Single Page Apps for GitHub Pages');

if (!hasCorrectAssetPath) {
  errors.push('資源路徑不正確');
}

if (!hasRedirectScript) {
  errors.push('缺少重定向腳本');
}

// 檢查 404.html
const notFoundPath = join(distPath, '404.html');
if (existsSync(notFoundPath)) {
  const notFoundHtml = readFileSync(notFoundPath, 'utf-8');
  if (!notFoundHtml.includes('pathSegmentsToKeep = 1')) {
    errors.push('404.html 配置可能不正確');
  }
}

// 輸出結果
if (errors.length === 0) {
  console.log('✅ 所有檢查通過！可以部署了。');
} else {
  console.log('❌ 發現問題：');
  errors.forEach(err => console.log(`  - ${err}`));
  process.exit(1);
}

