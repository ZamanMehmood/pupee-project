import mongoose, {Types} from 'mongoose';
import {BadRequestException} from "@nestjs/common";

const isMongoIdValid = (id: string) => {
  const isValid = Types.ObjectId.isValid(id);
  return isValid;
};


const validateMongoId=({ value, key }): Types.ObjectId =>{
    if (!value ||  Types.ObjectId.isValid(value)) {
        return value;
    } else {
        throw new BadRequestException(`${key} is not a valid MongoId`);
    }
}



const getStaticMongooseId=()=>{
    return new mongoose.Types.ObjectId();
}

export { isMongoIdValid ,validateMongoId,getStaticMongooseId};
