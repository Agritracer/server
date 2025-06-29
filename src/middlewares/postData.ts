import fetch from 'node-fetch';

const postData = async (dataChange: any, status: string, userID: any) => {
  const url = 'http://0.tcp.jp.ngrok.io:12942/api/submit';
  const data = {
    id: 'sp001',
    idEditor: userID,
    status: status,
    dataChange,
  };
  console.log(data)
  // const response = await fetch(url, {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'X-API-Key': 'DLU2025',
  //   },
  //   body: JSON.stringify(data),
  // });
  // const result = await response.json();
  // console.log(result);
};

export default postData;
