import { Injectable } from '@nestjs/common';
import IStockData from '../models/common/IStockData';
import IStockResult from '../models/common/IStockResult';
import { StockErrorType } from '../models/common/IStockError';
import { isNumber, isDate } from 'lodash';

@Injectable()
export class ValidatorService {
    validateResponse<T extends IStockData>(data: T[]): IStockResult<T> {
        const result: IStockResult<T> = {
            data,
            errors: []
        }

        result.data = result.data.filter(e => {
            const values = Object.values(e)

            const valid = values.reduce((acc,val) => {
                return acc && (isNumber(val) || isDate(val) || val !== null)
            }, true)
            
            if (!valid)
                result.errors.push({
                    type: StockErrorType.Missing,
                    date: e.date,
                    message: e
                })

            return valid
        })

        return result
    }
}
