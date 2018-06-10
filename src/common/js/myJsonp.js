import originJsonp from 'jsonp';

function myJsonp(url, params, option) {
  params = (url.indexOf('?') < 0) ? '?' : '&' + transParams(params);
  url += params;
  return new Promise((resolve, reject) => {
    originJsonp(url, option, (err, res) => {
      if (!err) {
        resolve(res);
      } else {
        reject(err);
      }
    });
  });
}

function transParams(params) {
  let url = '';
  for (let k in params) {
    let value = params[k] === undefined ? '' : params[k];
    url += `&${k}=${encodeURIComponent(value)}`;
  }

  return url ? url.substr(1) : '';
}

export { myJsonp };
