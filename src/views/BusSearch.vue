<script setup>
import { computed, ref, onMounted, toRaw } from 'vue'
import {
  getCityRouteData,
  getEstimatedTimeOfArrival,
  getStopOfRoute,
  getRouteGeometry
} from '@/api/routedata'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import Wkt from 'wicket'

// 城市名鍵值對
const cityData = [
  { name: '台北市', value: 'Taipei' },
  { name: '新北市', value: 'NewTaipei' },
  { name: '桃園市', value: 'Taoyuan' },
  { name: '台中市', value: 'Taichung' },
  { name: '台南市', value: 'Tainan' },
  { name: '高雄市', value: 'Kaohsiung' },
  { name: '基隆市', value: 'Keelung' },
  { name: '新竹市', value: 'Hsinchu' },
  { name: '新竹縣', value: 'HsinchuCounty' },
  { name: '苗栗縣', value: 'MiaoliCounty' },
  { name: '彰化縣', value: 'ChanghuaCounty' },
  { name: '南投縣', value: 'NantouCounty' },
  { name: '雲林縣', value: 'YunlinCounty' },
  { name: '嘉義市', value: 'Chiayi' },
  { name: '嘉義縣', value: 'ChiayiCounty' },
  { name: '屏東縣', value: 'PingtungCounty' },
  { name: '宜蘭縣', value: 'YilanCounty' },
  { name: '花蓮縣', value: 'HualienCounty' },
  { name: '台東縣', value: 'TaitungCounty' },
  { name: '澎湖縣', value: 'PenghuCounty' },
  { name: '金門縣', value: 'KinmenCounty' },
  { name: '連江縣', value: 'LienchiangCounty' }
]

/*  ---------------- 城市 & 路線下拉選單部分 start ----------------- */

// input 選擇的城市
const selectedCity = ref('')
// 路線資料
const cityRouteData = ref([])

// 路線輸入
const selectedRoute = ref({})
const routeInput = ref('')

const showDropdown = ref(false)

// 取得指定縣市的市區公車資料，並把路線取出整理
const handleCityRoute = async () => {
  if (selectedCity.value === '') {
    alert('請選擇縣市')
    return
  }
  try {
    const res = await getCityRouteData(selectedCity.value)

    routeInput.value = ''
    // 篩選出縣市下拉選單的請求回傳值中的 RouteName, 起點名稱與終點名稱
    cityRouteData.value = res.map((item) => {
      return {
        routeName: item.RouteName.Zh_tw,
        routeDeparture: item.DepartureStopNameZh,
        routeDestination: item.DestinationStopNameZh
      }
    })
  } catch (error) {
    console.error('請求錯誤', error.message, error)
  }
}

// 根據輸入篩選出符合的路線 ex: 輸入 101 會顯示 101, 1011...等路線
const filterRoutes = computed(() => {
  if (!routeInput.value) return cityRouteData.value
  return cityRouteData.value.filter((route) =>
    route.routeName.includes(routeInput.value.toLowerCase())
  )
})

// 下拉選擇路線
const getDropDownListRoute = (route) => {
  selectedRoute.value = route
  routeInput.value = route.routeName
  showDropdown.value = false
}

/*  ---------------- 城市 & 路線下拉選單部分 end  ----------------- */

/*  ---------------- 路線資訊 start  ----------------- */

const forwardData = ref([])
const backData = ref([])

// 取得指定路線的預估時間
const handleEstimatedTime = async () => {
  if (routeInput.value === '') {
    alert('請選擇路線')
    return
  }
  try {
    const res = await getEstimatedTimeOfArrival(selectedCity.value, routeInput.value)

    // 正在路線上的公車
    // const buses = res.filter((item) => item.PlateNumb)
    // console.log(buses)

    // 去/返程公車分類
    const forwardDirectionBuses = res.filter((bus) => !bus.Direction)
    const backDirectionBuses = res.filter((bus) => bus.Direction)

    // 組合出想要的資料格式 forwardData
    // 說明: 紀錄 每一台 在 forward 方向中的 bus 車號(PlateNumb)、所有會到的站別和預測時間
    // 到時候取得站序，把站別和站序 (StopUID) 比對就可以對上
    const forwardDataMap = new Map()
    forwardDirectionBuses.forEach((bus) => {
      if (!forwardDataMap.has(bus.PlateNumb)) {
        forwardDataMap.set(bus.PlateNumb, {
          PlateNumb: bus.PlateNumb,
          stops: [
            {
              EstimateTime: bus.EstimateTime,
              StopUID: bus.StopUID
            }
          ]
        })
      } else {
        forwardDataMap.get(bus.PlateNumb).stops.push({
          EstimateTime: bus.EstimateTime,
          StopUID: bus.StopUID
        })
      }

      // 一開始的方法: 使用 indexof 找出沒有的資料
      // const index = forwardData.value.map((item) => item.PlateNumb).indexOf(bus.PlateNumb)

      // // 沒找到的話就新增
      // if (index === -1) {
      //   forwardData.value.push({
      //     PlateNumb: bus.PlateNumb,
      //     stops: [
      //       {
      //         EstimateTime: bus.EstimateTime,
      //         StopUID: bus.StopUID
      //       }
      //     ]
      //   })
      // } else {
      //   forwardData.value[index].stops.push({
      //     EstimateTime: bus.EstimateTime,
      //     StopUID: bus.StopUID
      //   })
      // }
    })
    forwardData.value = Array.from(forwardDataMap.values())

    const backDataMap = new Map()
    backDirectionBuses.forEach((bus) => {
      if (!backDataMap.has(bus.PlateNumb)) {
        backDataMap.set(bus.PlateNumb, {
          PlateNumb: bus.PlateNumb,
          stops: [
            {
              EstimateTime: bus.EstimateTime,
              StopUID: bus.StopUID
            }
          ]
        })
      } else {
        backDataMap.get(bus.PlateNumb).stops.push({
          EstimateTime: bus.EstimateTime,
          StopUID: bus.StopUID
        })
      }
    })
    backData.value = Array.from(backDataMap.values())
  } catch (error) {
    console.error('請求錯誤', error.message, error)
  }
}

const stops = ref([])
const forwardStop = ref([])
const backStop = ref([])

const finalForward = ref([])
const finalBack = ref([])

// 取得指定路線的站序
const handleStopRoute = async () => {
  const res = await getStopOfRoute(selectedCity.value, routeInput.value)
  stops.value = res

  // 取得的站序需要篩選，像是 routeInput = 30，會返回 30, 300, 301... 等
  const filterStop = stops.value.filter((stop) => stop.RouteName.Zh_tw === routeInput.value)

  // 去/返程站序
  forwardStop.value = filterStop.filter((route) => route.Direction === 0)
  backStop.value = filterStop.filter((route) => route.Direction === 1)
}

// 取得路線的經緯度並劃出路線
const geoJson = ref({})
const routeGeoLayer = ref(null)
const routeGeometry = ref([])
const handleRouteGeometry = async () => {
  const res = await getRouteGeometry(selectedCity.value, routeInput.value)

  routeGeometry.value = res.filter((item) => item.RouteName.Zh_tw === routeInput.value)

  // const wkt = new Wkt.Wkt()
  // wkt.read(res[0].Geometry)
  // geoJson.value = wkt.toJson()
  // // 把已經有的路線 Layer 移除
  // if (routeGeoLayer.value) map.value.removeLayer(routeGeoLayer.value)
  // if (map.value) {
  //   routeGeoLayer.value = L.geoJSON(geoJson.value).addTo(map.value)
  //   routeGeoLayer.value.addData(geoJson.value)
  //   map.value.fitBounds(routeGeoLayer.value.getBounds())
  // }
}

const renderRouteGeometry = (direct) => {
  const wkt = new Wkt.Wkt()
  if (direct === 0) {
    wkt.read(routeGeometry.value[0].Geometry)
    geoJson.value = wkt.toJson()
  } else {
    wkt.read(routeGeometry.value[1].Geometry)
    geoJson.value = wkt.toJson()
  }
  // 把已經有的路線 Layer 移除
  if (routeGeoLayer.value) map.removeLayer(routeGeoLayer.value)
  if (map) {
    routeGeoLayer.value = L.geoJSON(geoJson.value).addTo(map)
    routeGeoLayer.value.addData(geoJson.value)
    map.fitBounds(routeGeoLayer.value.getBounds())
  }
}

// 按鈕點擊事件
const handleBusRouteList = async (e) => {
  e.preventDefault()
  if (selectedCity.value === '') {
    alert('請選擇縣市')
    return
  }
  if (routeInput.value === '') {
    alert('請選擇路線')
    return
  }
  await handleEstimatedTime()
  await handleStopRoute()
  await handleRouteGeometry()
  renderRouteGeometry(0)

  let busId = ''
  let timeText = ''

  finalForward.value = []
  forwardStop.value[0].Stops.forEach((routeStop) => {
    forwardData.value.forEach((bus) => {
      bus.stops.forEach((busStop) => {
        if (busStop.StopUID === routeStop.StopUID) {
          busId = bus.PlateNumb
          const time = Math.floor(busStop.EstimateTime / 60)
          timeText = ''
          if (time === 0) timeText = '進站中'
          else if (time <= 1 && time > 0) timeText = '即將進站'
          else if (!time) timeText = '---'
          else timeText = `${time} 分鐘`
        }
      })
    })
    finalForward.value.push({
      routeStop,
      busId,
      timeText
    })
  })

  createMarkers(toRaw(finalForward.value))

  finalBack.value = []
  backStop.value[0].Stops.forEach((routeStop) => {
    backData.value.forEach((bus) => {
      bus.stops.forEach((busStop) => {
        if (busStop.StopUID === routeStop.StopUID) {
          busId = bus.PlateNumb
          const time = Math.floor(busStop.EstimateTime / 60)
          timeText = ''
          if (time === 0) timeText = '進站中'
          else if (time <= 1 && time > 0) timeText = '即將進站'
          else if (!time) timeText = '---'
          else timeText = `${time} 分鐘`
        }
      })
    })
    finalBack.value.push({
      routeStop,
      busId,
      timeText
    })
  })
}

const activeTab = ref('forward')
const activeClass = ref('bg-red-400 text-white')

const forwardTabClick = () => {
  activeTab.value = 'forward'
  renderRouteGeometry(0)
  createMarkers(toRaw(finalForward.value))
}

const backTabClick = () => {
  activeTab.value = 'back'
  renderRouteGeometry(1)
  createMarkers(toRaw(finalBack.value))
}

/*  ---------------- 路線資訊 end  ----------------- */

/*  ---------------- 地圖 start  ----------------- */

const mapContainer = ref(null)
let map = null

// 初始化
onMounted(() => {
  map = L.map(toRaw(mapContainer.value)).setView([24.165, 120.642], 18)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map)
})

const handleRefresh = () => {
  console.log('刷新地圖')
  map.invalidateSize()
}

// 列表項點擊跳轉到對應 marker 並彈出 popup
const listClickPopup = (stop) => {
  const { PositionLat, PositionLon } = toRaw(stop).routeStop.StopPosition

  const marker = markers[toRaw(stop).routeStop.StopUID]

  if (marker) {
    map.setView([PositionLat, PositionLon], 18)
    marker.openPopup()
  }
}

let markers = {}
const createMarkers = (stops) => {
  clearMarkers()
  stops.forEach((stop) => {
    const { PositionLat, PositionLon } = stop.routeStop.StopPosition

    const marker = L.marker([PositionLat, PositionLon]).addTo(map)
    const popupContent = `<p>${stop.routeStop.StopName.Zh_tw}</p>`
    marker.bindPopup(popupContent)

    markers[stop.routeStop.StopUID] = marker
  })
}

const clearMarkers = () => {
  Object.keys(markers).forEach((key) => {
    const marker = markers[key]
    map.removeLayer(marker)
  })
  markers = {}
}

/*  ---------------- 地圖 end  ----------------- */
</script>

<template>
  <div class="flex h-full w-full flex-col items-center justify-start bg-white">
    <!-- 選單 -->
    <div
      class="selection-box flex w-full flex-shrink-0 items-center justify-center bg-gray-700 p-6"
    >
      <!-- 城市選擇 -->
      <select
        name="city"
        id=""
        v-model="selectedCity"
        @change="handleCityRoute"
        class="mx-3 h-10 w-1/3 p-2 text-black shadow"
      >
        <option selected value="">預設</option>
        <option v-for="city in cityData" :key="city.name" :value="city.value">
          {{ city.name }}
        </option>
      </select>
      <!-- 路線選擇 -->
      <div class="routeInputBox mx-3 h-10 w-1/3 text-black shadow">
        <input
          type="text"
          placeholder="輸入路線"
          v-model="routeInput"
          class="h-full w-full p-2"
          @focus="showDropdown = true"
          @change="showDropdown = true"
          @blur="showDropdown = false"
        />
        <!-- 下拉選單 -->
        <div v-if="showDropdown" class="relative">
          <ul
            class="absolute z-[1001] max-h-60 w-full overflow-auto rounded-md border bg-white shadow-lg"
          >
            <li
              v-for="route in filterRoutes"
              :key="route"
              :class="routeInput === route ? 'bg-gray-700 text-white' : ''"
              class="cursor-pointer px-3 py-2 hover:bg-gray-100 hover:text-black"
              @mousedown.prevent="getDropDownListRoute(route)"
            >
              {{ `[${route.routeName}] ${route.routeDeparture} - ${route.routeDestination}` }}
            </li>
          </ul>
        </div>
      </div>

      <button
        class="mx-3 block h-10 rounded-md border bg-gray-500 p-2 text-white hover:bg-red-600"
        @click="handleBusRouteList"
      >
        <box-icon name="search" color="white"></box-icon>
      </button>
    </div>
    <div class="infoContainer flex w-full flex-grow flex-col overflow-auto md:flex-row">
      <!-- 路線資訊 -->
      <div class="routeInfo relative w-full md:w-1/2 md:overflow-auto">
        <!-- 路線顯示列表 tab -->
        <div
          v-if="stops.length > 0"
          class="routeTabs sticky left-0 top-0 z-10 flex w-full items-center justify-center"
        >
          <button
            class="w-1/2 border px-4 py-2"
            :class="activeTab === 'forward' ? activeClass : 'bg-white'"
            @click="forwardTabClick"
          >
            <span>往</span>
            <span v-if="selectedRoute">
              {{ selectedRoute.routeDestination }}
            </span>
          </button>
          <button
            class="w-1/2 border px-4 py-2"
            :class="activeTab === 'back' ? activeClass : 'bg-white'"
            @click="backTabClick"
          >
            <span>往</span>
            <span v-if="selectedRoute">
              {{ selectedRoute.routeDeparture }}
            </span>
          </button>
        </div>
        <!-- tab content -->
        <div v-if="activeTab === 'forward'" class="tab-content flex w-full flex-col items-center">
          <ul v-if="forwardStop" class="forwardStopRoute flex w-full flex-col items-center">
            <li
              class="flex w-full items-center justify-between gap-10 border-b-2 border-gray-400 bg-gray-300 p-4 text-center"
            >
              <div class="basis-1/5">站序</div>
              <h5 class="basis-3/5">站名</h5>
              <p class="basis-1/5">預估到站</p>
            </li>
            <li
              v-for="(stop, index) in finalForward"
              :key="stop"
              :class="[
                'flex w-full cursor-pointer items-center justify-start gap-10 border-b-2 border-gray-400 p-4 text-center hover:bg-red-100',
                { 'last-seq-no-line': index === finalForward.length - 1 }
              ]"
              @click="listClickPopup(stop)"
            >
              <div
                class="seq relative z-[1] basis-1/3 before:absolute before:left-1/2 before:top-1/2 before:z-[-1] before:h-[300%] before:w-1 before:-translate-x-1/2 before:bg-gray-300 before:content-[''] md:basis-1/5"
              >
                {{ index + 1 }}
                <span
                  class="absolute left-1/2 top-1/2 -z-[1] h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gray-200"
                  :class="{ 'animate-scale-shadow bg-red-400': stop.timeText === '進站中' }"
                ></span>
              </div>
              <h5 class="basis-1/3 md:basis-3/5">
                {{ `${stop.routeStop.StopName.Zh_tw}` }}
              </h5>
              <p
                class="basis-1/3 py-1 text-sm md:basis-1/5 md:text-base"
                :class="{
                  'bg-red-300': stop.timeText === '進站中',
                  'bg-yellow-300': stop.timeText === '即將進站',
                  'bg-green-300':
                    stop.timeText !== '進站中' &&
                    stop.timeText !== '即將進站' &&
                    stop.timeText !== '---' &&
                    stop.timeText,
                  'bg-gray-500 text-white': stop.timeText === '---' || !stop.timeText
                }"
              >
                {{ stop.timeText || '尚未進站' }}
              </p>
              <!-- <p>{{ stop.busId }}</p> -->
            </li>
          </ul>
        </div>
        <div v-if="activeTab === 'back'" class="tab-content flex w-full flex-col items-center">
          <ul v-if="backStop" class="backStopRoute flex w-full flex-col items-center">
            <li
              class="flex w-full items-center justify-between gap-10 border-b-2 border-gray-400 bg-gray-300 p-4 text-center"
            >
              <div class="basis-1/5">站序</div>
              <h5 class="basis-3/5">站名</h5>
              <p class="basis-1/5">預估到站</p>
            </li>
            <li
              v-for="(stop, index) in finalBack"
              :key="stop"
              :class="[
                'flex w-full cursor-pointer items-center justify-start gap-10 border-b-2 border-gray-400 p-4 text-center hover:bg-red-100',
                { 'last-seq-no-line': index === finalBack.length - 1 }
              ]"
              @click="listClickPopup(stop)"
            >
              <div
                class="seq relative z-[1] basis-1/3 before:absolute before:left-1/2 before:top-1/2 before:z-[-1] before:h-[300%] before:w-1 before:-translate-x-1/2 before:bg-gray-300 before:content-[''] md:basis-1/5"
              >
                {{ index + 1 }}
                <span
                  class="absolute left-1/2 top-1/2 -z-[1] h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gray-200"
                  :class="{ 'animate-scale-shadow bg-red-400': stop.timeText === '進站中' }"
                ></span>
              </div>
              <h5 class="basis-1/3 md:basis-3/5">
                {{ `${stop.routeStop.StopName.Zh_tw}` }}
              </h5>
              <p
                class="basis-1/3 py-1 text-sm md:basis-1/5 md:text-base"
                :class="{
                  'bg-red-300': stop.timeText === '進站中',
                  'bg-yellow-300': stop.timeText === '即將進站',
                  'bg-green-300':
                    stop.timeText !== '進站中' &&
                    stop.timeText !== '即將進站' &&
                    stop.timeText !== '---' &&
                    stop.timeText,
                  'bg-gray-500 text-white': stop.timeText === '---' || !stop.timeText
                }"
              >
                {{ stop.timeText || '尚未進站' }}
              </p>
              <!-- <p>{{ stop.busId }}</p> -->
            </li>
          </ul>
        </div>
      </div>
      <!-- 地圖 -->
      <div class="mapInfo relative w-full md:w-1/2">
        <div class="mapContainer aspect-square" ref="mapContainer"></div>
        <button
          class="absolute right-10 top-10 z-[1000] bg-slate-400 px-2 text-lg text-white hover:opacity-80"
          @click="handleRefresh"
        >
          refresh
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.last-seq-no-line .seq::before {
  display: none;
}
</style>
