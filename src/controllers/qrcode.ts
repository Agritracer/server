import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

const crypto = require('crypto');
import CustomError from '../errors';
import {
  CultivationLog,
  Distributor,
  Harvest,
  Herd,
  Processor,
  Product, ProductInfo,
  TraceabilityInfo,
  Treatment,
} from '../models';
import Farm from '../models/Farm';
import Category from '../models/Category';

const getAllTraceabilityInfos = async (req: Request, res: Response) => {
  const traceabilityInfos = await TraceabilityInfo.find({});

  res
    .status(StatusCodes.OK)
    .json({ traceabilityInfos, count: traceabilityInfos.length });
};

const getTraceabilityInfo = async (req: Request, res: Response) => {
  const { id: idProduct } = req.params;

  const product = await Processor.findOne({ _id: idProduct });
  const productInfo = await ProductInfo.findOne({ _id: product.product_info });
  const harvestFindOne = await Harvest.findOne({ _id: product.harvest });
  const herd = await Herd.findOne({ _id: harvestFindOne.herd });
  const harvest = await Harvest.find({ herd: herd._id });
  const cultivationLogs = await CultivationLog.find({ herd: herd._id.toString() });
  const farm = await Farm.findOne({ _id: product.location });
  const category = await Category.findOne({ _id: herd.category });

  const data = {
    date: product.dte,
    harvest: product.harvest,
    net_weight: product.net_weight,
    production_date: product.production_date,
    quantity: product.quantity,
    unit: product.unit,
  };
  const hash = crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex');
  console.log(hash);

  const url = `${process.env.API_URL_DOMAIN}/api/query?id=${product._id}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': process.env.API_KEY,
    },
  });
  const result = await response.json();
  console.log(result);
  const dataArray = result.sha256;

  const dataLine = dataArray.find((line: string) => line.includes('DATA:'));
  const extractedHash = dataLine ? dataLine.split('DATA:')[1].trim() : '';

  if (hash !== extractedHash) {
    return res.status(401).json({ error: true, message: 'Invalid hash' });
  }

  res.status(StatusCodes.OK).json({
    tx_hashes: result.tx_hashes[0],
    harvest,
    harvestFindOne,
    herd,
    cultivationLogs,
    product,
    productInfo,
    farm,
    category,

  });
};

export {
  getAllTraceabilityInfos,
  getTraceabilityInfo,

};
