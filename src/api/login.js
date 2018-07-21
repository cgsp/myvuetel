import { myLocalStorageGet } from '@utils/myStorage';
import { myAxios } from '@utils/myAxios';
import qs from 'qs';

function login(money, rate, amount, kcode) {
  const url = 'https://accountsymtest.phicomm.com/ddwexchange/v1/exchange';
  const time = Date.now();
  const params = { _: time };

  return new Promise((resolve, reject) => {
    myAxios({
      method: 'post',
      url: url,
      data: qs.stringify({
        money: money,
        rate: rate,
        amount: amount,
        kcode: kcode
      }),
      params: params,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        'Authorization': myLocalStorageGet('token', '')
      }
    }).then((res) => {
      resolve(res.data);
    })
      .catch(err => reject(err));
  });
};

export { login };
