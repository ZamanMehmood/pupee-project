import {IS_NUMBER, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, ValidateNested} from 'class-validator';
import {Type} from "class-transformer";
import {DefaultPaymentMethodTypesEnum} from "../../enums/user.enum";


class Card {
    @IsString()
    @IsNotEmpty()
    number;

    @IsNotEmpty()
    exp_month;

    @IsNotEmpty()
    exp_year;

    @IsString()
    @IsNotEmpty()
    cvc;

}



class BillingDetails {

    @IsString()
    @IsNotEmpty()
    email;

    @IsNotEmpty()
    name;

}



class AU_BECS {
    @IsString()
    @IsNotEmpty()
    account_number;

    @IsNotEmpty()
    @IsString()
    bsb_number;
}


export class CreateUserStripeCardsDto {
    @IsString()
    @IsNotEmpty()
    user_id;

    @IsNotEmpty()
    @IsEnum(DefaultPaymentMethodTypesEnum)
    type;



    @IsOptional()
    @ValidateNested()
    @Type(() => Card)
    card;


    @IsOptional()
    @ValidateNested()
    @Type(() => AU_BECS)
    au_becs_debit;


    @IsOptional()
    @ValidateNested()
    @Type(() => BillingDetails)
    billing_details;


}


export class UpdatePaymentMethod {
    @IsString()
    @IsNotEmpty()
    payment_method_id;

    @IsNotEmpty()
    @IsEnum(DefaultPaymentMethodTypesEnum)
    type;
}


export class CreateUserPaymentCardsDto {
    @IsString()
    @IsNotEmpty()
    user_id;

    @IsString()
    @IsNotEmpty()
    card;

    @IsString()
    @IsNotEmpty()
    card_number;

    @IsString()
    @IsNotEmpty()
    expiry;

    @IsString()
    @IsNotEmpty()
    cvv;
}

export class UpdateUserPaymentCardsDto {
    @IsString()
    @IsNotEmpty()
    user_payment_card_id;

    @IsString()
    @IsOptional()
    card_holder_name;

    @IsString()
    @IsOptional()
    card_number;

    @IsString()
    @IsOptional()
    expiry;

    @IsString()
    @IsOptional()
    cvv;
}



export class AddCreditDto {
    @IsString()
    @IsNotEmpty()
    payment_method_id;

    @IsInt()
    @IsNotEmpty()
    amount;

    @IsString()
    @IsOptional()
    userId;
}

export class WithdrawalDto {
    @IsInt()
    @IsNotEmpty()
    amount;
}