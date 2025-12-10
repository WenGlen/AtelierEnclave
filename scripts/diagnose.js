import { readFileSync, existsSync, statSync } from 'fs';
import { join } from 'path';

console.log('🔍 GitHub Pages 部署诊断工具\n');
console.log('='.repeat(60));

const distPath = join(process.cwd(), 'dist');

// 1. 检查构建产物
console.log('\n1️⃣  检查构建产物...');
const files = [
  { path: 'index.html', required: true },
  { path: '404.html', required: true },
  { path: 'assets/index-BFe0Lxwy.js', required: true },
  { path: 'assets/index-D3RPL3yZ.css', required: true },
];

let issues = [];

for (const file of files) {
  const fullPath = join(distPath, file.path);
  if (existsSync(fullPath)) {
    const stats = statSync(fullPath);
    console.log(`   ✅ ${file.path} (${(stats.size / 1024).toFixed(2)} KB)`);
  } else {
    console.log(`   ❌ ${file.path} 不存在`);
    if (file.required) {
      issues.push(`缺少必要文件: ${file.path}`);
    }
  }
}

// 2. 检查 index.html
console.log('\n2️⃣  检查 index.html 配置...');
const indexPath = join(distPath, 'index.html');
if (existsSync(indexPath)) {
  const html = readFileSync(indexPath, 'utf-8');
  
  // 检查资源路径
  const assetMatches = html.match(/src="([^"]+)"/g) || [];
  const cssMatches = html.match(/href="([^"]+)"/g) || [];
  const allAssets = [...assetMatches, ...cssMatches];
  
  console.log('   资源路径:');
  allAssets.forEach(match => {
    const path = match.match(/"([^"]+)"/)[1];
    if (path.includes('/AtelierEnclave/')) {
      console.log(`   ✅ ${path}`);
    } else {
      console.log(`   ❌ ${path} (缺少 /AtelierEnclave/ 前缀)`);
      issues.push(`资源路径不正确: ${path}`);
    }
  });
  
  // 检查重定向脚本
  if (html.includes('Single Page Apps for GitHub Pages')) {
    console.log('   ✅ 包含 SPA 重定向脚本');
  } else {
    console.log('   ❌ 缺少 SPA 重定向脚本');
    issues.push('index.html 缺少重定向脚本');
  }
  
  // 检查 root div
  if (html.includes('<div id="root"></div>')) {
    console.log('   ✅ 包含 root div');
  } else {
    console.log('   ❌ 缺少 root div');
    issues.push('index.html 缺少 root div');
  }
}

// 3. 检查 404.html
console.log('\n3️⃣  检查 404.html 配置...');
const notFoundPath = join(distPath, '404.html');
if (existsSync(notFoundPath)) {
  const notFoundHtml = readFileSync(notFoundPath, 'utf-8');
  
  if (notFoundHtml.includes('pathSegmentsToKeep = 1')) {
    console.log('   ✅ 配置了 pathSegmentsToKeep = 1');
  } else {
    console.log('   ⚠️  pathSegmentsToKeep 可能不正确');
  }
  
  if (notFoundHtml.length >= 512) {
    console.log(`   ✅ 文件大小足够 (${notFoundHtml.length} bytes)`);
  } else {
    console.log(`   ⚠️  文件可能太小 (${notFoundHtml.length} bytes，建议 >= 512)`);
  }
}

// 4. 检查 vite.config.ts
console.log('\n4️⃣  检查 Vite 配置...');
const viteConfigPath = join(process.cwd(), 'vite.config.ts');
if (existsSync(viteConfigPath)) {
  const viteConfig = readFileSync(viteConfigPath, 'utf-8');
  if (viteConfig.includes('base: "/AtelierEnclave/"') || viteConfig.includes('base: \'/AtelierEnclave/\'')) {
    console.log('   ✅ base 配置正确');
  } else {
    console.log('   ⚠️  无法确认 base 配置（但构建产物路径正确，应该没问题）');
    // 不添加为问题，因为构建产物已经正确
  }
}

// 5. 检查 package.json
console.log('\n5️⃣  检查 package.json 配置...');
const packagePath = join(process.cwd(), 'package.json');
if (existsSync(packagePath)) {
  const packageJson = JSON.parse(readFileSync(packagePath, 'utf-8'));
  
  if (packageJson.homepage === 'https://wenglen.github.io/AtelierEnclave/') {
    console.log('   ✅ homepage 配置正确');
  } else {
    console.log(`   ⚠️  homepage: ${packageJson.homepage || '未设置'}`);
  }
  
  if (packageJson.scripts.deploy) {
    console.log('   ✅ 包含 deploy 脚本');
  } else {
    console.log('   ❌ 缺少 deploy 脚本');
  }
}

// 6. 总结
console.log('\n' + '='.repeat(60));
console.log('\n📊 诊断结果:\n');

if (issues.length === 0) {
  console.log('✅ 所有检查通过！构建产物看起来正确。');
  console.log('\n💡 如果 GitHub Pages 仍然有问题，请检查：');
  console.log('   1. GitHub Pages 设置是否正确（gh-pages 分支）');
  console.log('   2. 浏览器控制台的错误信息');
  console.log('   3. Network 标签页中的资源加载状态');
  console.log('   4. 是否等待了足够的时间让 GitHub Pages 更新（5-10 分钟）');
  console.log('   5. 是否清除了浏览器缓存');
} else {
  console.log(`❌ 发现 ${issues.length} 个问题：\n`);
  issues.forEach((issue, index) => {
    console.log(`   ${index + 1}. ${issue}`);
  });
  console.log('\n请修复这些问题后重新构建。');
  process.exit(1);
}

console.log('\n📝 下一步：');
console.log('   1. 运行 npm run deploy 部署到 GitHub Pages');
console.log('   2. 等待 5-10 分钟让 GitHub Pages 更新');
console.log('   3. 访问 https://wenglen.github.io/AtelierEnclave/');
console.log('   4. 打开浏览器开发者工具（F12）检查错误');
console.log('   5. 如果仍有问题，查看 DEBUG.md 获取详细排查步骤\n');

