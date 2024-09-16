# F2E 巴士動態時刻查詢應用服務

## 使用技術

- vue3
- tailwind
- axios
- leaflet 地圖
- wicket 將座標做類型轉換
- pinia
- vue-router

API 平台:
[公共運輸-公車 v2](https://tdx.transportdata.tw/api-service/swagger#/CityBus/CityBusApi_StopOfRoute_2039_1)

## 使用到的 API

在 /api/routedata.js 中發出請求

1. 取得指定縣市的市區公車路線資料
2. 取得指定[縣市], [路線名稱] 的公車預估到站資料
3. 取得指定[縣市], [路線名稱] 的公車路線站序資料
4. 取得指定[縣市],[路線名稱]的市區公車線型資料

## 遇到的困難

問題: 使用地圖服務 leaflet popup 顯示站點資訊時，縮放地圖或是切換路線，會出現報錯: 無法獲取 latlng。

經過查詢是因為 vue3 的響應式數據深層代理會和 leaflet 的 dom 操作發生衝突。

解決方法: 不需要將地圖宣告成 ref 響應式數據，並且將地圖會用到的數據經過 toRaw 轉換回原始數據。

## 可改進部分(待新增功能)

組件封裝優化

- [ ] 縣市 & 路線輸入組件
- [ ] 往返路線列表組件
- [ ] 地圖組件

功能

- [ ] 定時刷新(30s)
- [ ] 沒有發車的公車將 下一班發車時間資訊擷取出來顯示在預估到站中
- [ ] popup 新增站牌會經過的路線資訊
- [ ] 最愛路線/站牌

樣式

- [ ] 重新設計樣式等等
- [ ] 路線輸入可以有鍵盤 (藍線、綠線...等等和數字)

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
