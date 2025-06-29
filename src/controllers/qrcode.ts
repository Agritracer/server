import {Request, Response} from 'express';
import {StatusCodes} from 'http-status-codes';
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
        .json({traceabilityInfos, count: traceabilityInfos.length});
};

const getTraceabilityInfo = async (req: Request, res: Response) => {
    const {id: idProduct} = req.params;

    const product = await Processor.findOne({_id: idProduct})
    const productInfo = await ProductInfo.findOne({_id: product.product_info});
    const harvestFindOne = await Harvest.findOne({_id: product.harvest});
    const herd = await Herd.findOne({_id: harvestFindOne.herd});
    const harvest = await Harvest.find({herd: herd._id})
    const cultivationLogs = await CultivationLog.find({herd: herd._id.toString()});
    const farm = await Farm.findOne({_id: product.location})
    const category = await Category.findOne({_id: herd.category})
    res.status(StatusCodes.OK).json({
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
