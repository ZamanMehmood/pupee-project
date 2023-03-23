import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import mongoose, {Model} from 'mongoose';
import {errorResponse, successResponse} from '../utils/response';
import {UserPaymentCardsDocument} from "../user-payment-cards/models/user-payment-cards.model";
import {ModelingDocument} from "./models/modeling.model";
import {AddRatingCategoryDto, AddSearchDto, AddVoteDto, CreateModelDto, UpdateModelDto} from "./dto/modeling.dto";
import {diffDays, getAge} from "../utils/date";
import {VoteDocument} from "./models/vote.models";
import {UserDocument} from "../users/models/users.model";
import {FilterDto} from "./dto/filter.dto";
import {OrderByEnum} from "../enums/modeling.enum";
import {ModelingStatsDocument} from "./models/stats.model";
import {AddStatsDto} from "./dto/stats.dto";
import {ModelChatDocument} from "./models/chat.model";
import {CreateModelChatMessageDto} from "./dto/chat.dto";
import {ModelRatingCategoryDocument} from "./models/rating-category.models";
import {ContactDocument} from "../users/models/contacts.model";

const moment = require("moment");

import { Socket, Server } from 'socket.io';
import {ModelingGateway} from "./modeling.gateway";

@Injectable()
export class ChatService {
    private readonly modelingGateway: ModelingGateway

    constructor(
        @InjectModel('contacts') private readonly contactModel: Model<ContactDocument>,
        @InjectModel('users') private readonly userModel: Model<UserDocument>,
        @InjectModel('models') private readonly modelingModel: Model<ModelingDocument>,

    ) {
    }





    updateContactsCountZero=async (userId,receiverId,socket)=>{
        let senderContacts=await this.contactModel.findOne({user_id:new mongoose.Types.ObjectId(userId)});
        const senderIndex=(senderContacts.list).findIndex((user:any)=>user.id===receiverId);
        if(senderIndex>=0){
            senderContacts.list[senderIndex].count=0;
            const savedContactsList=await senderContacts.save();

            socket.emit("contacts"+(userId).toString(),savedContactsList);

        }

    }


    getUserStatus=async (userId:string,socket)=>{
        const user=await this.userModel.findById(new mongoose.Types.ObjectId(userId));

        if(user){
            socket.emit("user_status"+(userId).toString(),{status:user.blocked});
        }
    }

    getModelStatus=async (modelId:string,socket)=>{
        const model=await this.modelingModel.findById(new mongoose.Types.ObjectId(modelId));
        if(model){
            socket.emit("model_status"+(modelId).toString(),{status:model.approval_status});
        }
    }

}
