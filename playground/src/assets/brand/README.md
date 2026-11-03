# Yahha UI 品牌图案

正式 Logo 为 **组件碰碰乐**。保留原稿的粉、黄、蓝组件、笑脸及 Yahha UI 字形，不添加副标题。

`yahha-ui-logo.png` 是原稿右侧 F2 字标的独立 824 × 280 PNG，按原有显示像素无损导出，不包含整张候选对照图。网站在系统强制颜色模式下关闭 Logo 的乘色混合，确保深色高对比背景上也能看清图案。

网站使用同尺寸的 `yahha-ui-logo.webp` 无损编码副本，保留 PNG 原稿。用 `cwebp -lossless -exact -m 6 yahha-ui-logo.png -o yahha-ui-logo.webp` 生成，RGBA 像素逐点比较一致；仅减小传输文件，不调整字形、配色、尺寸或比例。

浏览器图标独立使用 `yahha-ui-favicon-16.png`、`yahha-ui-favicon-32.png`。两者从同一稿的独立组件图案区域以正方形视图导出，只包含粉、黄、蓝组件笑脸，不包含字标或对照图。不要用字标 SVG 的 `#symbol` 片段作为 favicon：页面内图片显示正确，不能证明浏览器标签页会使用同一裁切结果。

仓库中的 `yahha-ui-logo.png` 是维护原稿，WebP 和 favicon 是派生展示文件。品牌图形采用项目 MIT 许可，仅用于文档站，不进入组件安装包。
