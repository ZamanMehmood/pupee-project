import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import mongoose, {Model} from 'mongoose';
import {errorResponse, successResponse} from '../utils/response';
import {CreateServiceOrderMessageDto} from './dtos/service-order-conversation.dto';
import {
    CreateServiceOrderDto, UpdateMultipleServiceOrdersDto,
    UpdateServiceOrderDto,
} from './dtos/service-orders.dto';
import {ServiceOrderConversationDocument} from './models/service-order-conversation.model';
import {ServiceOrdersDocument, STATUS} from './models/service-orders.model';
import {service} from "aws-sdk/clients/health";
import {UserDocument} from "../users/models/users.model";
import {SearchAndFilterDto} from "../users/dtos/search-and-filter.dto";
import {UpdateMultipleServicesDto} from "../services/dtos/services.dto";
import {NotificationService} from "../notifications/notification.service";
import {NotificationType} from "../modeling/type";
import {NotificationTypeEnum} from "../enums/notification.enum";
import {getNotificationMessage} from "../utils/notification";
const moment = require("moment");

@Injectable()
export class ServiceOrdersService {
    constructor(
        @InjectModel('serviceorders')
        private readonly serviceOrdersModel: Model<ServiceOrdersDocument>,
        @InjectModel('serviceorderconversations')
        private readonly serviceOrderConversationModel: Model<ServiceOrderConversationDocument>,
        @InjectModel('users')
        private readonly userModel: Model<UserDocument>,
        private readonly notificationService: NotificationService

    ) {
    }

    create = async (serviceOrdersDto: CreateServiceOrderDto) => {
        const user=await this.userModel.findById(serviceOrdersDto.user_id)

        if(user){
            const serviceOrders = new this.serviceOrdersModel(serviceOrdersDto);
            serviceOrders.total_reviews = 0;
            serviceOrders.rating = 0;
            serviceOrders.reviews = [];
            serviceOrders.deadline_date = new Date(serviceOrders.deadline_date);
            serviceOrders.customer_reviewed = serviceOrdersDto.customer_reviewed;

            let serviceProvider = await this.userModel.findById(serviceOrders.service_provider_id);
            if (serviceProvider.amount_to_pending_clearance && serviceProvider.amount_to_pending_clearance > 0) {
                serviceProvider.amount_to_pending_clearance = serviceOrders.total_price + serviceProvider.amount_to_pending_clearance;
            } else {
                serviceProvider.amount_to_pending_clearance = serviceOrders.total_price;
            }
            serviceOrders.occupation=user.occupation;
            await serviceProvider.save();

            const notificationPayload:NotificationType={user_id:serviceOrdersDto.service_provider_id,type:NotificationTypeEnum.ORDER_RECEIVED,
                message:getNotificationMessage(NotificationTypeEnum.ORDER_RECEIVED,user.first_name,user.last_name),
                profile_info:{first_name:user.first_name,last_name:user.last_name,profile_image_url:user.profile_image_url}}
            await this.notificationService.add(notificationPayload)



            const saveServiceOrders = await serviceOrders.save();
            return successResponse(200, 'Service Order created', saveServiceOrders);
        }else{
            return errorResponse(404, 'user not found.');
        }
    };

    update = async (serviceOrdersDto: UpdateServiceOrderDto) => {
        const serviceOrder: any = await this.serviceOrdersModel.findById(
            serviceOrdersDto.service_order_id,
        );


        if (serviceOrder) {
            if (serviceOrder.history && Array.isArray(serviceOrder.history)) (serviceOrder.history).push(serviceOrdersDto.history);
            else serviceOrder.history = [serviceOrdersDto.history];
            serviceOrder.status = serviceOrdersDto.status;
            serviceOrder.customer_reviewed = serviceOrdersDto.customer_reviewed;
            serviceOrder.blocked = serviceOrdersDto.blocked || serviceOrder.blocked;

            await serviceOrder.save();
            let serviceProvider = await this.userModel.findById(serviceOrder.service_provider_id);

            if (serviceOrder.status === STATUS.completed) {
                if (serviceProvider) {
                    if (serviceProvider.amount_to_withdrawal && serviceProvider.amount_to_withdrawal > 0) {
                        serviceProvider.amount_to_withdrawal = serviceOrder.total_price + serviceProvider.amount_to_withdrawal;
                    } else {
                        serviceProvider.amount_to_withdrawal = serviceOrder.total_price;
                    }
                    serviceProvider.amount_to_pending_clearance = serviceProvider.amount_to_pending_clearance - serviceOrder.total_price;
                    await serviceProvider.save();
                } else {
                    return errorResponse(404, 'Service provider not found');
                }

            }






            return successResponse(200, 'Service Order status updated', serviceOrder);
        } else {
            return errorResponse(404, 'Service Order no found');
        }
    };

    getByUserId = async (id: String) => {
        const serviceOrders = await this.serviceOrdersModel
            .find({user_id: id})
            .populate('service_id')
            .populate('user_id');
        if (serviceOrders) {
            return successResponse(200, 'Service Orders', serviceOrders);
        } else {
            return errorResponse(404, 'Service Orders Not Found');
        }
    };


    getAllServiceOrders = async () => {
        const serviceOrders = await this.serviceOrdersModel.find()
        return successResponse(200, 'Service Orders', serviceOrders);
    };


    getByServiceProviderId = async (id: String) => {
        const serviceOrders = await this.serviceOrdersModel
            .find({service_provider_id: id})
            .populate('service_id')
            .populate('user_id');
        if (serviceOrders) {
            return successResponse(200, 'Service Orders', serviceOrders);
        } else {
            return errorResponse(404, 'Service Orders Not Found');
        }
    };

    getById = async (id: String) => {
        const serviceOrder = await this.serviceOrdersModel
            .findById(id)
            .populate('service_id')
            .populate('user_id')
            .populate('service_provider_id');
        if (serviceOrder) {
            return successResponse(200, 'Service Order', serviceOrder);
        } else {
            return errorResponse(404, 'Service Order Not Found');
        }
    };


    deleteOrder = async (id: String) => {
        const serviceOrder = await this.serviceOrdersModel.findById(id);
        if (serviceOrder) {
            await serviceOrder.remove();
            return successResponse(200, 'Service Order delete', serviceOrder);
        } else {
            return errorResponse(404, 'Service Order Not Found');
        }
    };

    // Conversations & Messages

    getConversation = async (id: String) => {
        const conversation = await this.serviceOrderConversationModel.findOne({
            service_order_id: id,
        });
        if (conversation) {
            return successResponse(200, 'Service Order Conversation', conversation);
        } else {
            const newConversation = new this.serviceOrderConversationModel({
                service_order_id: id,
            });
            const saveConversation = await newConversation.save();
            return successResponse(
                200,
                'Service Order Conversation',
                saveConversation,
            );
        }
    };

    createConversationMessage = async (
        messageDto: CreateServiceOrderMessageDto,
    ) => {
        const conversation = await this.serviceOrderConversationModel.findById(
            messageDto.conversation_id,
        );
        if (conversation) {
            let messages = [...conversation.messages];
            const newMessage = {
                message_text: messageDto.message_text,
                sender: messageDto.sender,
                receiver: messageDto.receiver,
            };
            messages.push(newMessage);
            conversation.messages = [...messages];
            const saveConversation = await conversation.save();
            return successResponse(
                200,
                'Conversation message created',
                saveConversation,
            );
        } else {
            return errorResponse(404, 'Conversation not found');
        }
    };


    searchByField = async (filter:SearchAndFilterDto) => {
        let users: any = await this.serviceOrdersModel.find({[filter.search.field]:{$in:filter.search.value}});
        return successResponse(200, 'filter', users);
    };


    updateMultipleServices = async (payload:UpdateMultipleServiceOrdersDto) => {
        let updatedServiceOrders=[];
        for(let so of payload.serviceOrders){
            const serviceOrder=await this.serviceOrdersModel.findById(so.service_order_id);
            if(serviceOrder){
                serviceOrder.set(so);
                const updatedServiceOrder=await serviceOrder.save();
                updatedServiceOrders.push(updatedServiceOrder);

            }
        }
        return successResponse(200, 'service orders updated ',updatedServiceOrders);
    };


    getMonthlyOrderCompletedStats=async (user_id:string)=>{
        const FIRST_MONTH = 1
        const LAST_MONTH = 12
        const MONTHS_ARRAY = [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ]

        let TODAY = new Date();
        let YEAR_BEFORE = new Date(moment().subtract(1, 'year').format());
        let momentStart=moment(YEAR_BEFORE)
        let momentEnd=moment(TODAY)

        let sampleDates={};


        while (momentEnd > momentStart || momentStart.format('M') === momentEnd.format('M')) {
            sampleDates={...sampleDates,[momentStart.format('MMMM-YYYY')]:0};
            momentStart.add(1,'month');
        }

        const stats:any=await  this.serviceOrdersModel.aggregate( [
                {
                    $match: {
                        user_id: new mongoose.Types.ObjectId(user_id),
                        status:{$in: ['completed', 'feedback']},
                        timestamp: { $gte: YEAR_BEFORE, $lte: TODAY }
                    }
                },
                {
                    $group: {
                        _id: { "year_month": { $substrCP: [ "$timestamp", 0, 7 ] } },
                        count: { $sum: 1 }
                    }
                },
                {
                    $sort: { "_id.year_month": 1 }
                },
                {
                    $project: {
                        _id: 0,
                        count: 1,
                        month_year: {
                            $concat: [
                                { $arrayElemAt: [ MONTHS_ARRAY, { $subtract: [ { $toInt: { $substrCP: [ "$_id.year_month", 5, 2 ] } }, 1 ] } ] },
                                "-",
                                { $substrCP: [ "$_id.year_month", 0, 4 ] }
                            ]
                        }
                    }
                },
                {
                    $group: {
                        _id: null,
                        data: { $push: { k: "$month_year", v: "$count" } }
                    }
                },
                {
                    $addFields: {
                        start_year: { $substrCP: [ YEAR_BEFORE, 0, 4 ] },
                        end_year: { $substrCP: [ TODAY, 0, 4 ] },
                        months1: { $range: [ { $toInt: { $substrCP: [ YEAR_BEFORE, 5, 2 ] } }, { $add: [ LAST_MONTH, 1 ] } ] },
                        months2: { $range: [ FIRST_MONTH, { $add: [ { $toInt: { $substrCP: [ TODAY, 5, 2 ] } }, 1 ] } ] }
                    }
                },
                {
                    $addFields: {
                        template_data: {
                            $concatArrays: [
                                { $map: {
                                        input: "$months1", as: "m1",
                                        in: {
                                            count: 0,
                                            month_year: {
                                                $concat: [ { $arrayElemAt: [ MONTHS_ARRAY, { $subtract: [ "$$m1", 1 ] } ] }, "-",  "$start_year" ]
                                            }
                                        }
                                    } },
                                { $map: {
                                        input: "$months2", as: "m2",
                                        in: {
                                            count: 0,
                                            month_year: {
                                                $concat: [ { $arrayElemAt: [ MONTHS_ARRAY, { $subtract: [ "$$m2", 1 ] } ] }, "-",  "$end_year" ]
                                            }
                                        }
                                    } }
                            ]
                        }
                    }
                },
                {
                    $addFields: {
                        data: {
                            $map: {
                                input: "$template_data", as: "t",
                                in: {
                                    k: "$$t.month_year",
                                    v: {
                                        $reduce: {
                                            input: "$data", initialValue: 0,
                                            in: {
                                                $cond: [ { $eq: [ "$$t.month_year", "$$this.k"] },
                                                    { $add: [ "$$this.v", "$$value" ] },
                                                    { $add: [ 0, "$$value" ] }
                                                ]
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                {
                    $project: {
                        data: { $arrayToObject: "$data" },
                        _id: 0
                    }
                }
            ] )


        if(stats.length===0){
            return successResponse(200, 'stats ',sampleDates);
        }else{
            return successResponse(200, 'stats ',stats[0].data);
        }

    }

}
