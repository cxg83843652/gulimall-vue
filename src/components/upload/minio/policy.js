import http from '@/utils/httpRequest.js'

export function policy(filename) {
  return new Promise((resolve, reject) => {
    http({
      url: http.adornUrl('/thirdparty/minio/policy'),
      method: 'get',
      params: http.adornParams({filename}, false)
    }).then(({data}) => {
      resolve(data)
    })
  })
}
