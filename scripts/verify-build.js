import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const distPath = join(process.cwd(), 'dist');

console.log('🔍 检查构建产物...\n');

// 检查必要文件
const requiredFiles = [
  'index.html',
  '404.html'
];

let allGood = true;

for (const file of requiredFiles) {
  const filePath = join(distPath, file);
  if (existsSync(filePath)) {
    console.log(`✅ ${file} 存在`);
  } else {
    console.log(`❌ ${file} 不存在`);
    allGood = false;
  }
}

// 检查 index.html 中的路径并提取资源文件
console.log('\n📄 检查 index.html 路径...');
const indexPath = join(distPath, 'index.html');
if (!existsSync(indexPath)) {
  console.log('❌ index.html 不存在');
  allGood = false;
  process.exit(1);
}

const html = readFileSync(indexPath, 'utf-8');

// 从 index.html 中提取实际的资源文件路径
const jsMatch = html.match(/src="([^"]+\.js)"/);
const cssMatch = html.match(/href="([^"]+\.css)"/);

if (jsMatch) {
  // 移除路径前缀 /AtelierEnclave/ 来获取实际文件路径
  const jsPath = jsMatch[1].replace(/^\/AtelierEnclave\//, '');
  const jsFilePath = join(distPath, jsPath);
  if (existsSync(jsFilePath)) {
    console.log(`✅ ${jsPath} 存在`);
  } else {
    console.log(`❌ ${jsPath} 不存在`);
    allGood = false;
  }
} else {
  console.log('❌ 未找到 JS 文件引用');
  allGood = false;
}

if (cssMatch) {
  // 移除路径前缀 /AtelierEnclave/ 来获取实际文件路径
  const cssPath = cssMatch[1].replace(/^\/AtelierEnclave\//, '');
  const cssFilePath = join(distPath, cssPath);
  if (existsSync(cssFilePath)) {
    console.log(`✅ ${cssPath} 存在`);
  } else {
    console.log(`❌ ${cssPath} 不存在`);
    allGood = false;
  }
} else {
  console.log('❌ 未找到 CSS 文件引用');
  allGood = false;
}

const hasCorrectAssetPath = html.includes('/AtelierEnclave/assets/');
const hasRedirectScript = html.includes('Single Page Apps for GitHub Pages');

if (hasCorrectAssetPath) {
  console.log('✅ 资源路径包含 /AtelierEnclave/');
} else {
  console.log('❌ 资源路径不正确');
  allGood = false;
}

if (hasRedirectScript) {
  console.log('✅ 包含重定向脚本');
} else {
  console.log('❌ 缺少重定向脚本');
  allGood = false;
}

// 检查 404.html
console.log('\n📄 检查 404.html...');
const notFoundPath = join(distPath, '404.html');
if (existsSync(notFoundPath)) {
  const notFoundHtml = readFileSync(notFoundPath, 'utf-8');
  if (notFoundHtml.includes('pathSegmentsToKeep = 1')) {
    console.log('✅ 404.html 配置正确');
  } else {
    console.log('⚠️  404.html 可能配置不正确');
  }
}

console.log('\n' + '='.repeat(50));
if (allGood) {
  console.log('✅ 所有检查通过！可以部署了。');
} else {
  console.log('❌ 发现问题，请检查上述错误。');
  process.exit(1);
}

