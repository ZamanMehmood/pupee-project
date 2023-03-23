import {
    ArrayMinSize,
    IsArray,
    IsBoolean, IsEnum,
    IsNotEmpty, IsNumber, IsObject,
    IsOptional,
    IsString, ValidateNested,
} from 'class-validator';
import {Transform, Type} from "class-transformer";
import {Block} from "../../enums/user.enum";
import {validateMongoId} from "../../utils/mongo";
import {Types} from "mongoose"

class LocationType {
    readonly type = ['Point'];

}


class Location {

    @IsNotEmpty()
    @IsString()
    type;

    @IsArray()
    @ArrayMinSize(2)
    coordinates: [Number]
};


class SlotType {

    @IsNotEmpty()
    @IsString()
    time_slot;

};


class WeddingSynced {
    @IsNotEmpty()
    @IsBoolean()
    sync;

    @IsOptional()
    @Type(() => Types.ObjectId)
    @Transform(validateMongoId)
    wedding: String;
}


export class CreateUserProfileDto {
    @IsString()
    @IsNotEmpty()
    userId: string;

    @IsString()
    @IsOptional()
    phone_number: string;

    @IsBoolean()
    @IsOptional()
    is_phone_number_verified: boolean;

    @IsString()
    @IsOptional()
    country: string;

    @IsString()
    @IsOptional()
    city: string;

    @IsString()
    @IsOptional()
    gender: string;

    @IsString()
    @IsOptional()
    birth_day: string;

    @IsString()
    @IsOptional()
    occupation: string;

    @IsString()
    @IsOptional()
    main_language: string;

    @IsString()
    @IsOptional()
    profile_image_url: string;

    @IsString()
    @IsOptional()
    patch_video_url: string;

    @IsArray()
    @IsOptional()
    past_work_images: [string];

    @IsArray()
    @IsOptional()
    interests: [string];

    @IsArray()
    @IsOptional()
    seller_affiliate_link: [string];

    @IsString()
    @IsOptional()
    business_title: string;


    @IsString()
    @IsOptional()
    first_name: string;

    @IsString()
    @IsOptional()
    last_name: string;

    @IsString()
    @IsOptional()
    service_provider_image: string;

    @IsArray()
    @IsOptional()
    i_am_a: [string];

    @IsString()
    @IsOptional()
    user_type;

    @IsBoolean()
    @IsOptional()
    is_online;

    @IsString()
    @IsOptional()
    state;

    @IsString()
    @IsOptional()
    cover_image;

    @IsString()
    @IsOptional()
    country_code;

    @IsString()
    @IsOptional()
    country_phone_code;

    @IsString()
    @IsOptional()
    seller_stripe_account_id;

    @IsOptional()
    @IsString()
    expertise;

    @IsOptional()
    @IsObject()
    @ValidateNested()
    @Type(() => Location)
    location;

    @IsOptional()
    @IsNumber()
    rating;

    @IsOptional()
    @IsEnum(Block)
    blocked;

    @IsOptional()
    @IsArray()
    @ValidateNested()
    @Type(() => SlotType)
    slots;


    @IsOptional()
    @IsString()
    fcm: string;


    @IsArray()
    @IsOptional()
    preferences: [string];

    @IsOptional()
    @IsObject()
    @ValidateNested({each: true})
    @Type(() => WeddingSynced)
    wedding_synced: WeddingSynced;

}

export class CreatePaymentMethodDto {
    @IsString()
    @IsNotEmpty()
    userId: string;

    @IsString()
    @IsNotEmpty()
    card_holder_name: string;

    @IsString()
    @IsNotEmpty()
    card_number: string;

    @IsString()
    @IsNotEmpty()
    expiry: string;

    @IsString()
    @IsNotEmpty()
    cvv: string;
}

export class CreateQualificationOrDegreeDto {
    @IsString()
    @IsNotEmpty()
    userId: string;

    @IsString()
    @IsOptional()
    image_url: string;

    @IsString()
    @IsNotEmpty()
    institute_name: string;

    @IsString()
    @IsNotEmpty()
    degree_title: string;

    @IsString()
    @IsNotEmpty()
    year: string;
}

export class CreateCertificateDto {
    @IsString()
    @IsNotEmpty()
    userId: string;

    @IsString()
    @IsNotEmpty()
    certificate_name: string;

    @IsString()
    @IsNotEmpty()
    year: string;
}

export class UpdateQualificationDto {
    @IsString()
    @IsNotEmpty()
    user_id: string;

    @IsArray()
    @IsNotEmpty()
    qualifications;
}

export class UpdateCertificateDto {
    @IsString()
    @IsNotEmpty()
    user_id: string;

    @IsArray()
    @IsNotEmpty()
    certificates;
}

export class LikeProfileDto {
    @IsString()
    @IsNotEmpty()
    user_id: string;

    @IsString()
    @IsNotEmpty()
    user_id_who_likes: string;
}

export class DisLikeProfileDto {
    @IsString()
    @IsNotEmpty()
    user_id: string;

    @IsString()
    @IsNotEmpty()
    user_id_who_dislikes: string;
}

export class CreateDrivingLicenseDto {
    @IsString()
    @IsNotEmpty()
    user_id: string;

    @IsString()
    @IsNotEmpty()
    front_image_url: string;

    @IsString()
    @IsNotEmpty()
    back_image_url: string;
}

export class CreateOtherDocumentDto {
    @IsString()
    @IsNotEmpty()
    user_id: string;

    @IsArray()
    @IsNotEmpty()
    other_docs
}

export class CreatePassportDto {
    @IsString()
    @IsNotEmpty()
    user_id: string;

    @IsString()
    @IsNotEmpty()
    passport_image: string;
}


export class UpdateMultipleUsersDto {
    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested()
    @Type(() => CreateUserProfileDto)
    users;
}