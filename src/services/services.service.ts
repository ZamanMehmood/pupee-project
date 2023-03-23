import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import mongoose, {Model} from 'mongoose';
import {errorResponse, successResponse} from '../utils/response';
import {CreateServiceDto, UpdateMultipleServicesDto, UpdateServiceDto} from './dtos/services.dto';
import {ServicesDocument} from './models/services.model';
import {SearchAndFilterDto} from "../users/dtos/search-and-filter.dto";
import {UpdateMultiplePostsDto} from "../posts/dtos/posts.dto";
import {UserDocument} from "../users/models/users.model";
import {RatingModel} from "../rating/models/rating.model";

@Injectable()
export class ServicesService {
    constructor(
        @InjectModel('services') private readonly serviceModel: Model<ServicesDocument>,
        @InjectModel('users') private readonly userModel: Model<UserDocument>,
        @InjectModel('ratings') private readonly ratingModel: Model<RatingModel>,

    ) {
    }

    create = async (serviceDto: CreateServiceDto) => {
        const user=await this.userModel.findById(serviceDto.user_id)
        if(user){
            const service = new this.serviceModel(serviceDto);
            service.occupation=user.occupation;
            const saveService = await service.save();
            let rating = new this.ratingModel({user_id: saveService.user_id});
            let saveRating = await rating.save();
            saveService.rating_id = saveRating._id;
            let updatedService = await saveService.save();

            return successResponse(200, 'Service created', updatedService);
        }else{
            return errorResponse(404, 'user not found.');
        }
    };

    getById = async (id: String) => {
        const service = await this.serviceModel.findById(id);
        if (service) {
            const rating=await this.ratingModel.findById(service.rating_id);
            return successResponse(200, 'Service found', service);
        } else {
            return errorResponse(404, 'Service not found.');
        }
    };


    deleteService = async (id: String) => {
        const service = await this.serviceModel.findById(id);
        if (service) {
            await service.remove();
            return successResponse(200, 'Service deleted', service);
        } else {
            return errorResponse(404, 'Service not found.');
        }
    };

    getAll = async () => {
        const services = await this.serviceModel.find({});
        if (services) {
            return successResponse(200, 'Services found', services);
        } else {
            return errorResponse(404, 'Services not found.');
        }
    };


    getByUserId = async (id: string) => {
        const services = await this.serviceModel.find({user_id:new mongoose.Types.ObjectId(id)});
        if (services) {
            return successResponse(200, 'Services found', services);
        } else {
            return errorResponse(404, 'Services not found.');
        }
    };

    updateService = async (id: String,serviceDto: UpdateServiceDto) => {
        const services = await this.serviceModel.findById(id);
        if (services) {
            services.set(serviceDto);
            const saveService=await services.save();
            return successResponse(200, 'services updated', saveService);
        } else {
            return errorResponse(404, 'Services not found.');
        }
    };


    searchByField = async (filter:SearchAndFilterDto) => {
        let users: any = await this.serviceModel.find({[filter.search.field]:{$in:filter.search.value}});
        return successResponse(200, 'filter', users);
    };


    updateMultipleServices = async (payload:UpdateMultipleServicesDto) => {
        let updatedServices=[];
        for(let s of payload.services){
            const service=await this.serviceModel.findById(s.serviceId);
            if(service){
                service.set(s);
                const updatedService=await service.save();
                updatedServices.push(updatedService);

            }
        }
        return successResponse(200, 'service updated ',updatedServices);
    };

}
