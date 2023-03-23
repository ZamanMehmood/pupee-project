import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {errorResponse, successResponse} from '../utils/response';
import {
    AddCreditDto,
    CreateUserPaymentCardsDto,
    CreateUserStripeCardsDto,
    UpdatePaymentMethod, WithdrawalDto
} from './dtos/user-payment-cards.dto';
import {UserPaymentCardsDocument} from './models/user-payment-cards.model';
import {UserDocument} from "../users/models/users.model";

const stripe = require('stripe')("sk_test_51L5qqGClYFsBJMtmr6mZXJgnlM5xV2wEU9jjoP1XhAUBuH8pG5dMo02pA24LVscakTih8HqLpqCEFxylMfrbv8Rf00Hyh8bIXv");

@Injectable()
export class UserPaymentCardsService {
    constructor(
        @InjectModel('userpaymentcards')
        private readonly userPaymentCardsModel: Model<UserPaymentCardsDocument>,
        @InjectModel('users')
        private readonly userModel: Model<UserDocument>,
    ) {
    }

    create = async (userPaymentCardsDto: CreateUserPaymentCardsDto) => {
        const userPaymentCard = new this.userPaymentCardsModel(userPaymentCardsDto);
        const saveUserPaymentCard = await userPaymentCard.save();
        return successResponse(200, 'UserPaymentCard created', saveUserPaymentCard);
    };


    createSetupIntent = async (user_id:string) => {
        try {
            const user = await this.userModel.findById(user_id);
            if(!user) return errorResponse(500, "user not found");
            const setupIntent = await stripe.setupIntents.create({
                customer: user.stripe_id,
                payment_method_types: ['bancontact', 'card', 'ideal'],
            });

            return successResponse(200, 'Setup intent created', setupIntent);

        } catch (e) {
            return errorResponse(500, e)
        }
    };

    createPaymentMethod = async (userPaymentCardsDto: CreateUserStripeCardsDto) => {
        try {
            const user = await this.userModel.findById(userPaymentCardsDto.user_id);
            if(!user) return errorResponse(500, "user not found");
            const paymentMethod = await stripe.paymentMethods.create({
                type: userPaymentCardsDto.type,
                card: userPaymentCardsDto.card,
                au_becs_debit:userPaymentCardsDto.au_becs_debit,
                billing_details:userPaymentCardsDto.billing_details
            });
            const attachPaymentMethod = await stripe.paymentMethods.attach(
                paymentMethod.id,
                {customer: user.stripe_id}
            );


            return successResponse(200, 'Payment method created', paymentMethod);

        } catch (e) {
            return errorResponse(500, e)
        }
    };


    updateDefaultPaymentMethod = async (updatePaymentMethod: UpdatePaymentMethod,user_id:string) => {
        try {
            const user = await this.userModel.findById(user_id);
            if(!user) return errorResponse(401, "user not found");


            const customer = await stripe.customers.update(
                user.stripe_id,
                {
                    invoice_settings: {
                        default_payment_method: updatePaymentMethod.payment_method_id,
                    },

                }
            );

            const paymentMethod = await stripe.paymentMethods.attach(
                updatePaymentMethod.payment_method_id,
                {customer: user.stripe_id}
            );

            user.defaultPaymentMethods[updatePaymentMethod.type]=updatePaymentMethod.payment_method_id;
            const saveUser=await user.save();
            paymentMethod.userDefaultPaymentMethods=saveUser.defaultPaymentMethods;
            return successResponse(200, 'Payment method attached', paymentMethod);

        } catch (e) {
            return errorResponse(500, e)
        }
    };



    getAllPaymentMethods = async (user_id:string) => {
        try {
            const user = await this.userModel.findById(user_id);
            if(!user) return errorResponse(500, "user not found");
            const paymentMethodsCard = await stripe.customers.listPaymentMethods(
                user.stripe_id,
                {type: 'card'}
            );
            const paymentMethodsAuBecs = await stripe.customers.listPaymentMethods(
                user.stripe_id,
                {type: 'au_becs_debit'}
            );
            const customer = await stripe.customers.retrieve(user.stripe_id);

            return successResponse(200, 'Payment method attached',
                {paymentMethods:paymentMethodsCard,paymentMethodsAuBecs,defaultPayment:customer.invoice_settings.default_payment_method});

        } catch (e) {
            return errorResponse(500, e)
        }
    };



    createCreditPayment = async (addCreditDto: AddCreditDto) => {

        try {
            const amount = addCreditDto.amount * 100;

            const user = await this.userModel.findById(addCreditDto.userId);

            if(!user) return errorResponse(500, "user not found");



            const paymentIntent = await stripe.paymentIntents.create({
                amount,
                currency: "usd",
                customer: user.stripe_id,
                payment_method:addCreditDto.payment_method_id,
                metadata: {
                    user_id:addCreditDto.userId,
                    credit:addCreditDto.amount
                }
            });
            return paymentIntent;
        } catch (e) {
            throw new Error(e.message);
        }
    };


    withdrawalAmount = async (userId,withdrawal: WithdrawalDto) => {
        const user = await this.userModel.findById(userId);

        try {
            const amount = withdrawal.amount * 100;

            if(withdrawal.amount>user.amount_to_withdrawal) return errorResponse(400, "not a valid amount");

            if(!user) return errorResponse(500, "user not found");

            const transfer = await stripe.transfers.create({
                amount: 1,
                currency: 'aud',
                destination: user.stripe_connected_id,
            });

            user.amount_to_withdrawal=user.amount_to_withdrawal-withdrawal.amount;
            const saveUser= await user.save();
            return {transfer,user:saveUser.amount_to_withdrawal};
        } catch (e) {
            //const stripeAccount=await stripe.accounts.retrieve(user.stripe_connected_id);
            return errorResponse(500, e)
        }
    };


    getAllCard = async (id:string) => {
        try {
            const user = await this.userModel.findById(id);
            if(!user) return errorResponse(500, "user not found");
            const paymentMethods = await stripe.customers.listPaymentMethods(
                user.stripe_id,
                {type: 'card'}
            );

            return successResponse(200, 'UserPaymentCard created', paymentMethods);

        } catch (e) {
            return errorResponse(500, e)
        }
    };

    getById = async (id: String) => {
        const userPaymentCard = await this.userPaymentCardsModel.findById(id);
        if (userPaymentCard) {
            return successResponse(200, 'UserPaymentCard found', userPaymentCard);
        } else {
            return errorResponse(404, 'UserPaymentCard not found');
        }
    };

    getByUserId = async (id: String) => {
        const userPaymentCards = await this.userPaymentCardsModel.find({
            user_id: id,
        });
        if (userPaymentCards) {
            return successResponse(200, 'UserPaymentCards found', userPaymentCards);
        } else {
            return errorResponse(404, 'UserPaymentCards not found');
        }
    };

    getAll = async () => {
        const userPaymentCards = await this.userPaymentCardsModel.find({});
        if (userPaymentCards) {
            return successResponse(200, 'UserPaymentCards found', userPaymentCards);
        } else {
            return errorResponse(404, 'UserPaymentCards not found');
        }
    };


    deletePaymentMethod = async (userId,paymentMethodId) => {

        try {

            const user = await this.userModel.findById(userId);

            if(!user) return errorResponse(500, "user not found");
            const paymentIntent = await stripe.paymentMethods.detach(paymentMethodId);
            return successResponse(200, 'deleted', paymentIntent);
        } catch (e) {
            return errorResponse(404, 'payment method not found');
        }
    };


}
