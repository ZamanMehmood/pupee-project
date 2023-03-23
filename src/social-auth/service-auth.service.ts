import { Injectable} from '@nestjs/common';
import {HttpService} from '@nestjs/axios';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {UserDocument} from "../users/models/users.model";
import {errorResponse, successResponse} from "../utils/response";
import {CreateBudgetDto} from "../wedding/dtos/budget-planner.dto";
import {CreateUser} from "./dtos/social-auth.dto";
import {Provider} from "../enums/user.enum";
import {map} from "rxjs/operators";
const axios=require("axios");
@Injectable()
export class SocialAuthService {
    constructor(
        @InjectModel('users') private readonly userModel: Model<UserDocument>,
        private httpService: HttpService
    ) {
    }



    callApi=(url:string)=>{
        return axios.get(url);
    }

    socialAuth = async (payload: CreateUser) => {
        let url="";
        if(payload.provider===Provider.FACEBOOK){
            url=`https://graph.facebook.com/v14.0/me?access_token=${payload.access_token}&fields=id,name,email,first_name,last_name&format=json&pretty=0`
        }else if(payload.provider===Provider.GOOGLE){
            url=`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${payload.access_token}`
        }

        try{
            const response= await this.callApi(url);
            if(response.data && response.data.email){
                const user:any=await this.userModel.findOne({email:response.data.email});
                if(user && user.email){
                    return successResponse(200, 'social auth', user);
                }else{
                    const newUser = new this.userModel({...response.data,provider:payload.provider});
                    const saveUser=await newUser.save();
                    return successResponse(200, 'social auth', saveUser);
                }
            }else{
                return errorResponse(401, "email not found.");
            }
        }catch (e) {
            return errorResponse(500, e);
        }
    }
}
