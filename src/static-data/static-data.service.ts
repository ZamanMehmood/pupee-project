import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {errorResponse, successResponse} from '../utils/response';
import {CreateStaticDataDto} from './dtos/static-data.dto';
import {StaticDataDocument} from './models/static-data.model';
import { Country, State, City }  from 'country-state-city';

@Injectable()
export class StaticDataService {
    constructor(
        @InjectModel('static-data') private readonly staticDataModel: Model<StaticDataDocument>,
    ) {
    }

    async create(payload: CreateStaticDataDto) {
        const staticData = new this.staticDataModel(payload);
        const saveStaticData = await staticData.save();
        return successResponse(200, 'Static data  saved', saveStaticData);
    }

    async update(id: string,payload: CreateStaticDataDto) {
        const staticData = await this.staticDataModel.findById(id);
        staticData.set(payload);
        const saveStaticData = await staticData.save();
        return successResponse(200, 'Static data  updated', saveStaticData);
    }


    async delete(id: string) {
        const staticData = await this.staticDataModel.findById(id);
        if(staticData){
            await staticData.remove();
            return successResponse(200, 'Static data  removed', staticData);

        }else{
            return errorResponse(404, "Static data not found");
        }

    }

    async getAll() {
        const staticData = await this.staticDataModel.find();
        return successResponse(200, 'static data', staticData);
    }

    async getByType(type:string) {
        const staticData = await this.staticDataModel.find({type});
        return successResponse(200, 'static data', staticData);
    }

    async getAllCountries() {
        const countries = Country.getAllCountries();
        return successResponse(200, 'static data', countries);
    }

    async getStateOfCountry(country) {
        const state = State.getStatesOfCountry(country);
        return successResponse(200, 'static data', state);
    }

    async getCitiesOfState(country,state) {
        const cities = City.getCitiesOfState(country,state);
        return successResponse(200, 'static data', cities);
    }

    async getAllCities() {
        const countries = Country.getAllCountries();
        let countryStateCityList:any=[];
        for(let i=0;i<countries.length;i++){
            const country:any=countries[i];
            const states = State.getStatesOfCountry(country.isoCode);
            for(let j=0;j<states.length;j++){
                const state=states[j];
                 let cities = City.getCitiesOfState(country.isoCode,state.isoCode).map((city)=>city.name);
                 countryStateCityList = countryStateCityList.concat(cities);
            }

        }
        countryStateCityList=countryStateCityList.sort((a, b) => a.localeCompare(b))

        return successResponse(200, 'static data', countryStateCityList);
    }

}
