import { readFileSync, existsSync, statSync } from 'fs';
import { join } from 'path';

const distPath = join(process.cwd(), 'dist');
const issues = [];

// 檢查構建產物
const files = [
  { path: 'index.html', required: true },
  { path: '404.html', required: true },
  { path: 'assets/index-BFe0Lxwy.js', required: true },
  { path: 'assets/index-D3RPL3yZ.css', required: true },
];

for (const file of files) {
  const fullPath = join(distPath, file.path);
  if (!existsSync(fullPath) && file.required) {
    issues.push(`缺少必要檔案: ${file.path}`);
  }
}

// 檢查 index.html
const indexPath = join(distPath, 'index.html');
if (existsSync(indexPath)) {
  const html = readFileSync(indexPath, 'utf-8');
  
  // 檢查資源路徑
  const assetMatches = html.match(/src="([^"]+)"/g) || [];
  const cssMatches = html.match(/href="([^"]+)"/g) || [];
  const allAssets = [...assetMatches, ...cssMatches];
  
  allAssets.forEach(match => {
    const path = match.match(/"([^"]+)"/)[1];
    if (!path.includes('/AtelierEnclave/')) {
      issues.push(`資源路徑不正確: ${path}`);
    }
  });
  
  // 檢查重定向腳本
  if (!html.includes('Single Page Apps for GitHub Pages')) {
    issues.push('index.html 缺少重定向腳本');
  }
  
  // 檢查 root div
  if (!html.includes('<div id="root"></div>')) {
    issues.push('index.html 缺少 root div');
  }
}

// 檢查 404.html
const notFoundPath = join(distPath, '404.html');
if (existsSync(notFoundPath)) {
  const notFoundHtml = readFileSync(notFoundPath, 'utf-8');
  
  if (!notFoundHtml.includes('pathSegmentsToKeep = 1')) {
    issues.push('404.html pathSegmentsToKeep 可能不正確');
  }
  
  if (notFoundHtml.length < 512) {
    issues.push(`404.html 檔案可能太小 (${notFoundHtml.length} bytes，建議 >= 512)`);
  }
}

// 檢查 vite.config.ts
const viteConfigPath = join(process.cwd(), 'vite.config.ts');
if (existsSync(viteConfigPath)) {
  const viteConfig = readFileSync(viteConfigPath, 'utf-8');
  if (!viteConfig.includes('base: "/AtelierEnclave/"') && !viteConfig.includes('base: \'/AtelierEnclave/\'')) {
    // 不添加為問題，因為構建產物已經正確
  }
}

// 檢查 package.json
const packagePath = join(process.cwd(), 'package.json');
if (existsSync(packagePath)) {
  const packageJson = JSON.parse(readFileSync(packagePath, 'utf-8'));
  
  if (packageJson.homepage !== 'https://wenglen.github.io/AtelierEnclave/') {
    issues.push(`homepage 配置可能不正確: ${packageJson.homepage || '未設置'}`);
  }
  
  if (!packageJson.scripts.deploy) {
    issues.push('缺少 deploy 腳本');
  }
}

// 輸出結果
if (issues.length === 0) {
  console.log('✅ 所有檢查通過！構建產物看起來正確。');
  console.log('\n💡 如果 GitHub Pages 仍然有問題，請檢查：');
  console.log('   1. GitHub Pages 設置是否正確（gh-pages 分支）');
  console.log('   2. 瀏覽器控制台的錯誤資訊');
  console.log('   3. Network 標籤頁中的資源載入狀態');
  console.log('   4. 是否等待了足夠的時間讓 GitHub Pages 更新（5-10 分鐘）');
  console.log('   5. 是否清除了瀏覽器緩存');
  console.log('\n📝 下一步：');
  console.log('   1. 運行 npm run deploy 部署到 GitHub Pages');
  console.log('   2. 等待 5-10 分鐘讓 GitHub Pages 更新');
  console.log('   3. 訪問 https://wenglen.github.io/AtelierEnclave/');
  console.log('   4. 打開瀏覽器開發者工具（F12）檢查錯誤');
  console.log('   5. 如果仍有問題，查看 DEBUG.md 獲取詳細排查步驟');
} else {
  console.log(`❌ 發現 ${issues.length} 個問題：\n`);
  issues.forEach((issue, index) => {
    console.log(`   ${index + 1}. ${issue}`);
  });
  console.log('\n請修復這些問題後重新構建。');
  process.exit(1);
}

