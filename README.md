# MiniGame H5（竖屏小游戏基础设施）

基于 **Vite + TypeScript + HTML5 Canvas** 搭建的移动端竖屏（9:16）小游戏基础框架，已托管到 **GitHub Pages**，可随时本地修改并一键更新公网页面。

## 公网访问地址

- 线上地址：`https://rahkah.github.io/minigame/`
- 代码仓库：`https://github.com/Rahkah/minigame`

## 本地开发

```bash
# 安装依赖
npm install

# 启动本地开发服务（已开启 --host，同一局域网手机可直接通过局域网 IP 访问）
npm run dev

# 类型检查 + 生产构建
npm run build

# 本地预览生产构建结果
npm run preview
```

## 随时更新公网页面

修改代码后，运行一条命令即可自动完成类型检查、打包并发布到 GitHub Pages（`gh-pages` 分支），约 20~60 秒后公网生效：

```bash
npm run deploy
```

同时将源码变更同步到 `main` 分支：

```bash
git add .
git commit -m "feat: 更新游戏内容"
git push
```

> 可选进阶：如果希望以后仅执行 `git push` 到 `main` 分支就由 GitHub Actions 自动构建发布，可以先运行 `gh auth refresh -s workflow`，将 `docs/deploy.workflow.example.yml` 移动到 `.github/workflows/deploy.yml` 并推送，再在仓库 Settings → Pages 中将 Source 切换为 **GitHub Actions**。

## 目录结构

```text
├── scripts/deploy.mjs                  # 一键构建并发布 dist/ 到 gh-pages 分支
├── docs/deploy.workflow.example.yml    # 可选 GitHub Actions 自动部署模板
├── index.html                          # 移动端竖屏适配入口（viewport / safe-area）
├── vite.config.ts                      # Vite 构建配置（相对路径 base: './'）
└── src/
    ├── main.ts                         # 游戏入口与场景切换
    ├── styles/main.css                 # 9:16 竖屏舞台与防误触样式
    ├── engine/
    │   ├── Viewport.ts                 # 720x1280 逻辑分辨率 + DPR 高清缩放
    │   ├── Input.ts                    # 统一触控/鼠标指针输入（逻辑坐标）
    │   └── GameLoop.ts                 # rAF 主循环、dt 限幅与切后台暂停
    └── game/
        ├── Scene.ts                    # 场景生命周期接口
        └── DemoScene.ts                # 示例交互场景（可直接替换为正式玩法）
```
