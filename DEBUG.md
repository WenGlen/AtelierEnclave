# GitHub Pages 部署调试指南

## 🔍 问题排查步骤

### 1. 检查构建产物
```bash
npm run build
npm run verify-build  # 如果添加了验证脚本
```

### 2. 检查浏览器控制台
打开 `https://wenglen.github.io/AtelierEnclave/`，按 F12 打开开发者工具：

**Console 标签页：**
- 查看是否有 JavaScript 错误
- 查看是否有资源加载失败的错误

**Network 标签页：**
- 查看哪些资源加载失败（红色）
- 检查失败的资源 URL 是否正确
- 应该看到：
  - ✅ `/AtelierEnclave/assets/index-xxx.js` (200 OK)
  - ✅ `/AtelierEnclave/assets/index-xxx.css` (200 OK)
  - ❌ 如果看到 404，说明路径不对

### 3. 检查 GitHub Pages 设置
1. 进入仓库 Settings → Pages
2. Source 应该选择：**Deploy from a branch**
3. Branch 应该选择：**gh-pages**
4. Folder 应该选择：**/ (root)**

### 4. 检查 gh-pages 分支
```bash
# 查看远程分支
git ls-remote --heads origin | grep gh-pages

# 或者直接在 GitHub 上查看
# https://github.com/wenglen/AtelierEnclave/tree/gh-pages
```

### 5. 手动测试资源路径
直接在浏览器访问：
- `https://wenglen.github.io/AtelierEnclave/assets/index-xxx.js`
- 如果返回 404，说明路径有问题
- 如果返回文件内容，说明路径正确

### 6. 清除浏览器缓存
- Chrome: Ctrl+Shift+Delete (Windows) 或 Cmd+Shift+Delete (Mac)
- 或者使用无痕模式测试

### 7. 检查部署时间
GitHub Pages 更新可能需要几分钟，等待 5-10 分钟后再测试。

## 🛠️ 常见问题

### 问题 1: 白屏 + Console 显示资源 404
**原因：** 资源路径不正确
**解决：** 确保 `vite.config.ts` 中 `base: "/AtelierEnclave/"` 已设置，并且构建脚本正确修复了路径

### 问题 2: 直接访问子路由返回 404
**原因：** GitHub Pages 不支持客户端路由
**解决：** 确保 `public/404.html` 已创建并正确配置

### 问题 3: 主页正常，但子路由不行
**原因：** React Router basename 配置问题
**解决：** 确保 `main.tsx` 中 `basename` 在生产环境设置为 `/AtelierEnclave`

## 🔄 备选方案：使用 HashRouter

如果 BrowserRouter 仍然有问题，可以改用 HashRouter：

```tsx
import { HashRouter } from 'react-router-dom';

<HashRouter>
  <Routes>
    {/* ... */}
  </Routes>
</HashRouter>
```

这样 URL 会变成：`https://wenglen.github.io/AtelierEnclave/#/booking`

## 📝 调试清单

- [ ] 构建成功无错误
- [ ] dist/index.html 中资源路径包含 `/AtelierEnclave/`
- [ ] dist/404.html 存在
- [ ] GitHub Pages 设置正确（gh-pages 分支）
- [ ] 浏览器控制台无错误
- [ ] Network 标签页显示资源加载成功
- [ ] 清除浏览器缓存后测试
- [ ] 等待 GitHub Pages 更新（5-10 分钟）

