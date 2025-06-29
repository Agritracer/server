import fetch from 'node-fetch';

const postData = async (dataChange: any, status: string, userID: any) => {

  const data = {
    id: dataChange._id,
    idEditor: userID,
    status: status,
    data: {
      date: dataChange.dte,
      harvest: dataChange.harvest,
      net_weight: dataChange.net_weight,
      production_date: dataChange.production_date,
      quantity: dataChange.quantity,
      unit: dataChange.unit,
    },
  };
  const JsonData = JSON.stringify(data);


  const url = `${process.env.API_URL_DOMAIN}/api/submit`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': process.env.API_KEY,
    },
    body: JsonData,
  });
  const result = await response.json();
  console.log(result);
};

export default postData;
