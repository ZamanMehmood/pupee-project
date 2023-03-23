import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {errorResponse, successResponse} from '../utils/response';
import {UpdateInterestDto} from './dtos/interest.dto';
import {InterestDocument} from './models/interests.model';
import {StorageDocument} from "./models/storage.model";
import {BuyStorageDto, CreateStorage, UpdateStorage} from "./dtos/storage.dto";
import {UserDocument} from "./models/users.model";

@Injectable()
export class StorageService {
    constructor(
        @InjectModel('storages') private readonly storageModel: Model<StorageDocument>,
        @InjectModel('users') private readonly userModel: Model<UserDocument>,

    ) {
    }

    async create(payload: CreateStorage) {
        const storage = new this.storageModel(payload);
        const saveInterest = await storage.save();
        return successResponse(200, 'storage Created', saveInterest);
    }



    async update(id:string,payload: UpdateStorage) {
        const saveInterest = await this.storageModel.findByIdAndUpdate(id,payload);
        return successResponse(200, 'storage updated', saveInterest);
    }

    async buyStorage(id:string,userId:string,payload:BuyStorageDto) {
        const storage = await this.storageModel.findById(id);
        const user = await this.userModel.findById(userId);

        if(storage && user){
            user.storage={id,plan:payload.plan};
            const saveStorage=await user.save();
            return successResponse(200, 'storage created', {storage:saveStorage.storage});
        }else{
            return errorResponse(404, 'invalid request');
        }
    }

    async getById(id: string) {
        const storage = await this.storageModel.findById(id);
        if (storage) {
            return successResponse(200, 'storage', storage);
        } else {
            return errorResponse(404, 'storage not fount');
        }
    }

    async delete(id: string) {
        const storage = await this.storageModel.findByIdAndDelete(id);
        if (storage) {
            return successResponse(200, 'storage', storage);
        } else {
            return errorResponse(404, 'storage not fount');
        }
    }

    async getAll() {
        const interests = await this.storageModel.find({});
        if (interests) {
            return successResponse(200, 'storage', interests);
        } else {
            return errorResponse(404, 'storage not fount');
        }
    }
}
