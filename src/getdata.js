
import axios from 'axios';

const getData = function (mark, data) {
	return new Promise(async (resolve, reject) => {
		return axios({
			method: 'post',
			url: `${getData.url}${mark}`,
			data: data,
			withCredentials: true,
		}).then(response=>{
			const res = response.data;
			if (!res || typeof res.code !== 'number' || typeof res.msg !== 'string' || typeof res.data !== 'object') {
				return reject({code: 500, msg: '返回错误', data: { res } })
			}
			if (res.code !== 200) { return reject(res) }
			return resolve(res.data, res.msg, res.code);
		}, err=>{
			if (err.response && err.response.status && err.response.statusText) {
				return reject({code: err.response.status, msg: err.response.statusText, data: { err } })
			} else {
				return reject({code: 404, msg: '访问错误', data: { err } })
			}
		})
	});
};


getData.url = 'http://localhost:3000/api/';






export default getData