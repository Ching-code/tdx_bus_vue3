import request from '@/utils/request'

// 取得指定縣市的市區公車路線資料
export const getCityRouteData = (City) => {
  try {
    return request.get(`/Route/City/${City}`, {
      params: {
        $format: 'JSON'
      },
      headers: {
        Accept: 'application/json'
      }
    })
  } catch {
    console.log('請求縣市路線失敗')
  }
}

/**
 * 取得指定[縣市], [路線名稱] 的公車預估到站資料
 * @param {String} City
 * @param {String} RouteName
 * @returns
 */
export const getEstimatedTimeOfArrival = (City, RouteName) => {
  return request.get(`/EstimatedTimeOfArrival/City/${City}/${RouteName}`, {
    params: {
      $format: 'JSON'
    },
    headers: {
      Accept: 'application/json'
    }
  })
}

// 取得指定[縣市], [路線名稱] 的公車路線站序資料
export const getStopOfRoute = (City, RouteName) => {
  return request.get(`/StopOfRoute/City/${City}/${RouteName}`, {
    params: {
      $format: 'JSON'
    },
    headers: {
      Accept: 'application/json'
    }
  })
}

// 取得指定[縣市],[路線名稱]的市區公車線型資料
export const getRouteGeometry = (City, RouteName) => {
  return request.get(`/Shape/City/${City}/${RouteName}`, {
    params: {
      $format: 'JSON'
    },
    headers: {
      Accept: 'application/json'
    }
  })
}
