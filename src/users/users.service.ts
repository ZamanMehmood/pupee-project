import {
    BadRequestException, Body,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import {UserDocument} from './models/users.model';
import mongoose, {Model} from 'mongoose';
import {InjectModel} from '@nestjs/mongoose';
import {
    CreateUserDto,
    EmailExistDto,
    EmailVerifyDto,
} from './dtos/create-user.dto';
import {
    CreateCertificateDto,
    CreateDrivingLicenseDto,
    CreateOtherDocumentDto,
    CreatePassportDto,
    CreatePaymentMethodDto,
    CreateQualificationOrDegreeDto,
    CreateUserProfileDto,
    DisLikeProfileDto,
    LikeProfileDto,
    UpdateCertificateDto, UpdateMultipleUsersDto,
    UpdateQualificationDto,
} from './dtos/create-user-profile.dto';
import {errorResponse, successResponse} from '../utils/response';
import * as SgMail from '@sendgrid/mail';
import {VerifyUserDocument} from "./models/verify-users.model";
import {ServiceOrdersDocument} from "../service-orders/models/service-orders.model";
import {UpdateRecipientDto} from "../wedding/dtos/wedding.dto";
import {CreateMyListDto} from "./dtos/my-list.dto";
import {FilterDto} from "./dtos/filter.dto";
import {SearchAndFilterDto} from './dtos/search-and-filter.dto';
import {RatingModel} from "../rating/models/rating.model";
import {ReportProblemModel} from "./models/report-problem.model";
import {CreateReportProblem} from "./dtos/report-problem.dto";
import {CreateAdminDto, UpdateAdminDto, UpdateAdminPasswordDto, ValidateAdminDto} from "./dtos/admin.dto";
import {randomBytes} from "crypto";
import {createPasswordHash, validatePasswordHash} from '../utils/password';
import {ModelingDocument} from "../modeling/models/modeling.model";
import {ContactDocument} from "./models/contacts.model";
import {NotificationService} from "../notifications/notification.service";
import {InvitationService} from "./invitation.service";
import {PostsDocument} from "../posts/models/posts.model";
import {ServicesDocument} from "../services/models/services.model";
import {DeleteUserImageDto, FeedbackDto} from "./dtos/user.dto";
import {DeleteUserType, SenderReportProblem} from "../enums/user.enum";
import {FeedbackDocument} from "./models/feedback.model";
import {StorageDocument} from "./models/storage.model";

const shortId = require("shortid");
SgMail.setApiKey(
    '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',
);
const stripe = require('stripe')("sk_test_51L5qqGClYFsBJMtmr6mZXJgnlM5xV2wEU9jjoP1XhAUBuH8pG5dMo02pA24LVscakTih8HqLpqCEFxylMfrbv8Rf00Hyh8bIXv");

@Injectable()
export class UsersService {
    constructor(
        @InjectModel('users') private readonly userModel: Model<UserDocument>,
        @InjectModel('verifyusers') private readonly verifyUserModel: Model<VerifyUserDocument>,
        @InjectModel('serviceorders') private readonly serviceOrdersModel: Model<ServiceOrdersDocument>,
        @InjectModel('ratings') private readonly ratingModel: Model<RatingModel>,
        @InjectModel('report-problems') private readonly reportProblemModel: Model<ReportProblemModel>,
        @InjectModel('admin') private readonly adminModel: Model<ReportProblemModel>,
        @InjectModel('models') private readonly modelingModel: Model<ModelingDocument>,
        @InjectModel('contacts') private readonly contactModel: Model<ContactDocument>,
        @InjectModel('posts') private readonly postModel: Model<PostsDocument>,
        @InjectModel('services') private readonly serviceModel: Model<ServicesDocument>,
        @InjectModel('feedbacks') private readonly feedbackModel: Model<FeedbackDocument>,
        private invitationService: InvitationService,
    ) {
    }

    //  creating a user
    async create(user: CreateUserDto) {
        const newUser = new this.userModel(user);
        const stripeUser = await stripe.customers.create({email: user.email,});
        const account = await stripe.accounts.create({
            type: 'custom',
            country: 'au',
            email: user.email,
            capabilities: {
                card_payments: {requested: true},
                transfers: {requested: true},
                au_becs_debit_payments: {requested: true}
            },
            business_profile: {
                mcc: "6011",
                url: "https://music-pass-f227c.web.app/dashboard/home",
            },
            business_type: "individual",
            individual: {
                address: {
                    city: "The Gurdies",
                    line1: "84 Nerrigundah Drive",
                    postal_code: "3984",
                    state: "Victoria",
                },
                dob: {
                    day: "01",
                    month: "01",
                    year: "1901"
                },
                email: user.email,
                first_name: "first_name",
                last_name: "last_name",
                id_number: "000000000",
                phone: "+12544600144",
                verification: {
                    document: {
                        front: "file_identity_document_success"
                    }
                }
            },
            external_account: {
                object: "bank_account",
                account_number: "000123456",
                country: "au",
                currency: "aud",
                account_holder_name: "test",
                routing_number: "110000"
            }

        });
        newUser.short_id = shortId.generate();
        newUser.stripe_id = stripeUser.id;
        newUser.stripe_connected_id = account.id;
        const updateAccount = await stripe.accounts.update(
            account.id,
            {tos_acceptance: {date: 1609798905, ip: '8.8.8.8'}}
        );


        let saveUser = await newUser.save();
        let rating = new this.ratingModel({user_id: saveUser._id});
        let saveRating = await rating.save();
        let contact = new this.contactModel({user_id: saveUser._id, list: []});
        saveUser.rating_id = saveRating._id;
        let updateUser = await saveUser.save();
        let saveContact = await contact.save();


        return successResponse(200, 'User created', {saveUser: updateUser});
    }

    async findByEmail(email: string) {
        const findUser = await this.userModel.findOne({email});
        return findUser;
    }


    async findByUsername(user_name: string) {
        const findUser = await this.userModel.findOne({user_name});
        return findUser;
    }

    async findVerifyUserByEmail(email: string) {
        const findUser = await this.verifyUserModel.findOne({email});
        return findUser;
    }


    async findById(id: string) {
        const user = await this.userModel.findById(id);
        // .select('-password');
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return successResponse(200, 'User', user);
    }


    async findByOccupation(occupation: string) {
        const user = await this.userModel.find({occupation});
        // .select('-password');
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return successResponse(200, 'User', user);
    }

    async findByUserType(name: string) {
        const user = await this.userModel.find({user_type: name});
        // .select('-password');
        if (!user) {
            throw new NotFoundException('Users not found');
        }
        return successResponse(200, 'Users', user);
    }

    async emailExists(email: string) {
        const user = await this.findByEmail(email);
        if (user) {
            return successResponse(200, 'User exists', user);
        } else {
            return errorResponse(404, 'User not exist');
        }
    }

    async delete(id: string) {
        const user = await this.userModel.findById(id).select('-password');
        if (!user) {
            throw new NotFoundException('User not found');
        }
        await user.remove();
        return successResponse(200, 'User Deleted', {});
    }

    async findAll() {
        const allUsers = await this.userModel.find({}).select('-password');
        return allUsers;
    }

    async updateProfileInfo(profile: CreateUserProfileDto) {
        const user = await this.userModel.findById(profile.userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        if (profile.phone_number && (profile.phone_number).length > 0 &&
            (!user.phone_number || user.phone_number !== profile.phone_number)) {
            await this.invitationService.handleInvitation(profile.phone_number, profile);
        }

        user.phone_number = profile.phone_number || user.phone_number;
        user.is_phone_number_verified =
            profile.is_phone_number_verified || user.is_phone_number_verified;
        user.country = profile.country || user.country;
        user.city = profile.city || user.city;
        user.gender = profile.gender || user.gender;
        user.birth_day = profile.birth_day || user.birth_day;
        user.occupation = profile.occupation || user.occupation;
        user.main_language = profile.main_language || user.main_language;
        user.profile_image_url =
            profile.profile_image_url || user.profile_image_url;
        user.patch_video_url = profile.patch_video_url || user.patch_video_url;
        user.past_work_images = profile.past_work_images || user.past_work_images;
        user.interests = profile.interests || user.interests;
        user.seller_affiliate_link =
            profile.seller_affiliate_link || user.seller_affiliate_link;
        user.business_title = profile.business_title || user.business_title;
        user.first_name = profile.first_name || user.first_name;
        user.last_name = profile.last_name || user.last_name;
        user.i_am_a = profile.i_am_a || user.i_am_a;
        user.service_provider_image =
            profile.service_provider_image || user.service_provider_image;
        user.user_type = profile.user_type || user.user_type;
        user.state = profile.state || user.state;
        user.cover_image = profile.cover_image || user.cover_image;
        user.country_code = profile.country_code || user.country_code;
        user.country_phone_code =
            profile.country_phone_code || user.country_phone_code;
        user.seller_stripe_account_id =
            profile.seller_stripe_account_id || user.seller_stripe_account_id;
        user.rating =
            profile.rating || user.rating;
        user.location =
            profile.location || user.location;

        user.blocked =
            profile.blocked || user.blocked;


        user.slots =
            profile.slots || user.slots;




        user.preferences =
            profile.preferences || user.preferences;


        user.fcm =
            profile.fcm || user.fcm;


        user.wedding_synced =
            profile.wedding_synced || user.wedding_synced;


        let value = profile.is_online?.toString();
        if (value) {
            user.is_online = value == 'true' ? true : false;
        }

        try {


            const saveUser = await user.save();


            const models = await this.modelingModel.find({userId: user._id});

            for (let i = 0; i < models.length; i++) {
                const model = models[i];
                if (profile.birth_day && (profile.birth_day).length > 0) {
                    let birthDate;
                    if (model.birth_date && model.birth_date.value) {
                        birthDate = model.birth_date;
                        birthDate.value = profile.birth_day;
                    } else {
                        birthDate = {hide: false, value: profile.birth_day};
                    }
                    model.set({...profile, ...birthDate});
                } else {
                    model.set({...profile});
                }
                await model.save();
            }

            return successResponse(200, 'User updated', saveUser);
        } catch (e) {
            throw new BadRequestException(e);
        }
    }

    async likeUserProfile(likeProfileDto: LikeProfileDto) {
        const user = await this.userModel.findById(likeProfileDto.user_id);
        if (!user) {
            return errorResponse(404, 'User not found');
        }
        let userPostsLikes = [...user.liked_posts];
        let userPostsDisLikes = [...user.disliked_posts];
        const filerLikePosts = userPostsLikes.filter(
            (d) => d == likeProfileDto.user_id_who_likes,
        );
        const filerDisLikePosts = userPostsDisLikes.filter(
            (d) => d != likeProfileDto.user_id_who_likes,
        );
        if (filerLikePosts.length > 0) {
            return errorResponse(500, 'User already liked this post');
        }
        userPostsLikes.push(likeProfileDto.user_id_who_likes);
        user.liked_posts = userPostsLikes;
        user.disliked_posts = filerDisLikePosts;
        await user.save();
        return successResponse(200, 'User liked post successfully', user);
    }

    async disLikeUserProfile(likeProfileDto: DisLikeProfileDto) {
        const user = await this.userModel.findById(likeProfileDto.user_id);
        if (!user) {
            return errorResponse(404, 'User not found');
        }
        let userPostsLikes = [...user.liked_posts];
        let userPostsDisLikes = [...user.disliked_posts];
        const filerLikePosts = userPostsLikes.filter(
            (d) => d != likeProfileDto.user_id_who_dislikes,
        );
        const filerDisLikePosts = userPostsDisLikes.filter(
            (d) => d == likeProfileDto.user_id_who_dislikes,
        );
        if (filerDisLikePosts.length > 0) {
            return errorResponse(500, 'User already dis_liked this post');
        }
        userPostsDisLikes.push(likeProfileDto.user_id_who_dislikes);
        user.liked_posts = filerLikePosts;
        user.disliked_posts = userPostsDisLikes;
        await user.save();
        return successResponse(200, 'User liked post successfully', user);
    }

    async createPaymentMethod(paymentMethodPayload: CreatePaymentMethodDto) {
        const user = await this.userModel.findById(paymentMethodPayload.userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        const paymentMethod = {
            card_holder_name: paymentMethodPayload.card_holder_name,
            card_number: paymentMethodPayload.card_number,
            expiry: paymentMethodPayload.expiry,
            cvv: paymentMethodPayload.cvv,
        };

        user.payment_method = paymentMethod;
        await user.save();
        return successResponse(200, 'Payment method added', user);
    }

    async createDegreeOrQualification(
        degreePayload: CreateQualificationOrDegreeDto,
    ) {
        const user = await this.userModel.findById(degreePayload.userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        const createDegree = {
            image_url: degreePayload.image_url,
            institute_name: degreePayload.institute_name,
            degree_title: degreePayload.degree_title,
            year: degreePayload.year,
        };
        let userDegrees = user.qualifications_or_degree;
        userDegrees.push(createDegree);

        user.qualifications_or_degree = userDegrees;

        await user.save();
        return successResponse(200, 'Degree and qualification', user);
    }

    async createCertificate(certificatePayload: CreateCertificateDto) {
        const user = await this.userModel.findById(certificatePayload.userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        const createDegree = {
            certificate_name: certificatePayload.certificate_name,
            year: certificatePayload.year,
        };
        let userCertificate = user.certificates;
        userCertificate.push(createDegree);

        user.certificates = userCertificate;

        await user.save();
        return successResponse(200, 'Cretificate', user);
    }

    async updateCertificate(certificatePayload: UpdateCertificateDto) {
        const user = await this.userModel.findById(certificatePayload.user_id);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        user.certificates = certificatePayload.certificates;

        await user.save();
        return successResponse(200, 'Cretificates added', user);
    }

    async updateQualification(qualificationPayload: UpdateQualificationDto) {
        const user = await this.userModel.findById(qualificationPayload.user_id);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        user.qualifications_or_degree = qualificationPayload.qualifications;

        await user.save();
        return successResponse(200, 'Qualifications added', user);
    }

    async updateDrivingLicense(drivingLicensePayload: CreateDrivingLicenseDto) {
        const user = await this.userModel.findById(drivingLicensePayload.user_id);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        const driving_lic = {
            front_image_url: drivingLicensePayload.front_image_url,
            back_image_url: drivingLicensePayload.back_image_url,
        };

        user.driving_license = driving_lic;

        await user.save();
        return successResponse(200, 'Driving License added', user);
    }

    async updateOtherDocument(otherDocumentPayload: CreateOtherDocumentDto) {
        const user = await this.userModel.findById(otherDocumentPayload.user_id);
        if (!user) {
            throw new NotFoundException('User not found');
        }


        user.other_document = otherDocumentPayload.other_docs;

        await user.save();
        return successResponse(200, 'Other Document added', user);
    }

    async updatePassport(passportPayload: CreatePassportDto) {
        const user = await this.userModel.findById(passportPayload.user_id);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        user.passport_image = passportPayload.passport_image;

        await user.save();
        return successResponse(200, 'Passport added', user);
    }

    async sendVerifcationCode(emailDto: EmailExistDto) {
        const {email} = emailDto;
        let findUser = await this.verifyUserModel.findOne({email});


        var randomFourNumbers = (Math.floor(Math.random() * 10000) + 10000)
            .toString()
            .substring(1);
        if (findUser) {
            findUser.verification_code = randomFourNumbers;
            findUser.save();
        } else {
            const user = new this.verifyUserModel({email, verification_code: randomFourNumbers});
            user.save();
        }
        const msg = {
            to: email,
            from: 'hello@PupEEE.com',
            subject: 'Pupeee Verification Code',
            html: `<h2><strong>Please enter your PupEEE verification code ${randomFourNumbers} to confirm your User registration. And a very big welcome to you from the PupEEE Team</strong></h2>`,
        };
        await SgMail.send(msg);
        return successResponse(200, `Verification code sent to ${email}`, {});
    }

    async verifyEmail(emailDto: EmailVerifyDto) {
        const {email, code} = emailDto;
        let findUser = await this.verifyUserModel.findOne({email});
        if (!findUser) {
            return errorResponse(404, 'User not exist');
        }


        if (findUser.verification_code == code) {
            findUser.verification_code = '';
            findUser.is_email_verified = true;

            const msg = {
                to: email,
                from: 'hello@PupEEE.com',
                subject: 'Pupeee Verification Code',
                html: `<strong>Welcome and thank you for joining the PupEEE community. Your email has been verified successfully</strong>`,
            };
            await SgMail.send(msg);
            await findUser.save();
            return successResponse(200, `Email verified successfully`, {});
        } else {
            return errorResponse(403, 'Wrong verification code');
        }
    }


    async getEarnings(id: String) {
        const user = await this.userModel.findById(id);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        const serviceOrders = await this.serviceOrdersModel.find({
            service_provider_id: id,
            status: {$in: ["completed", "feedback"]}
        })
        let {amount_to_pending_clearance, amount_to_withdrawal} = user;


        if (!amount_to_withdrawal) amount_to_withdrawal = 0;
        if (!amount_to_pending_clearance) amount_to_pending_clearance = 0;

        let total = amount_to_pending_clearance + amount_to_withdrawal;

        return successResponse(200, 'User earnings', {
            amount_to_pending_clearance,
            amount_to_withdrawal,
            total,
            serviceOrders
        });
    }


    addNewList = async (id: string, payload: CreateMyListDto) => {
        const user: any = await this.userModel.findById(id);

        if (user) {
            if (user.my_list && (user.my_list).length > 0) {
                (user.my_list).push(payload.my_list)
            } else {
                user.my_list = [payload.my_list];
            }
            await user.save();
            return successResponse(200, 'added', user);
        } else {
            return errorResponse(404, 'user not found');
        }
    };


    updateMyList = async (id: string, listId: string, payload: CreateMyListDto) => {
        const user: any = await this.userModel.findById(id);

        if (user) {
            const index = (user.my_list).findIndex((l) => (l._id).toString() === listId);
            if (index !== -1) {
                user.my_list[index] = payload.my_list;
                await user.save();
                return successResponse(200, 'updated', user);
            } else {
                return errorResponse(404, 'list not found');
            }
        } else {
            return errorResponse(404, 'user not found');
        }
    };


    removeMyList = async (id: string, listId: string) => {
        const user: any = await this.userModel.findById(id);

        if (user) {
            const filteredList = (user.my_list).filter((l) => (l._id).toString() !== listId);
            user.my_list = filteredList;
            await user.save();
            return successResponse(200, 'updated', user);
        } else {
            return errorResponse(404, 'user not found');
        }
    };


    getMyList = async (id: string) => {
        const user: any = await this.userModel.findById(id);
        if (user) {
            return successResponse(200, 'updated', user.my_list);
        } else {
            return errorResponse(404, 'user not found');
        }
    };


    buildQuery = (filter: FilterDto) => {
        let query: any = {};
        if (filter.user_type) {
            query.user_type = filter.user_type;
        }

        if (filter.search_query) {
            query.$or = [{
                first_name: {
                    '$regex': `^${filter.search_query}$`,
                    $options: 'i'
                }
            }, {last_name: {'$regex': `^${filter.search_query}$`, $options: 'i'}},
                {email: {'$regex': `^${filter.search_query}$`, $options: 'i'}}];
        }


        if (filter.filters && filter.filters.min_rating) {
            query.rating = {$lte: filter.filters.min_rating}
        }

        if (filter.filters && filter.filters.looking_for) {
            query.occupation = {$in: filter.filters.looking_for}
        }

        if (filter.search_area && filter.search_area.cities_countries) {
            if (filter.search_area.cities_countries.cities) {
                query.city = {$in: filter.search_area.cities_countries.cities}
            }

            if (filter.search_area.cities_countries.countries) {
                query.country = {$in: filter.search_area.cities_countries.countries}
            }
        }


        if (filter.search_area && filter.search_area.custom_radius) {
            query.location = {
                $near:
                    {
                        $geometry:
                            {
                                type: "Point",
                                coordinates: [filter.search_area.custom_radius.latitude, filter.search_area.custom_radius.longitude]
                            },
                        $maxDistance: filter.search_area.custom_radius.distance
                    }
            }
        }

        return query;
    };

    excludeFrom = (users: any, filter: FilterDto) => {

        if (filter.exclude && filter.exclude.service_providers) {
            users = users.filter((user) =>
                (filter.exclude.service_providers).findIndex((provider: string) => (user._id).toString() === provider) === -1)
        }

        if (filter.exclude && filter.exclude.cities_countries) {
            if (filter.exclude.cities_countries.cities) {
                users = users.filter((user) =>
                    (filter.exclude.cities_countries.cities).findIndex((city: string) => (user.city) === city) === -1)
            }


            if (filter.exclude.cities_countries.countries) {
                users = users.filter((user) =>
                    (filter.exclude.cities_countries.countries).findIndex((country: string) => (user.country) === country) === -1)
            }
        }

        return users;
    };


    filterUser = async (filter: FilterDto) => {
        let users: any = await this.userModel.find(this.buildQuery(filter));
        let filteredUsers = this.excludeFrom(users, filter);
        return successResponse(200, 'filter', filteredUsers);
    };


    searchByField = async (filter: SearchAndFilterDto) => {
        let users: any = await this.userModel.find({[filter.search.field]: {$in: filter.search.value}});
        return successResponse(200, 'filter', users);
    };


    updateMultipleUsers = async (payload: UpdateMultipleUsersDto) => {
        let updatedUsers = [];
        for (let u of payload.users) {
            const user = await this.userModel.findById(u.userId);
            if (user) {
                user.set(u);
                const updatedUser = await user.save();
                updatedUsers.push(updatedUser);
            }
        }
        return successResponse(200, 'users updated ', updatedUsers);
    };


    async createReportProblem(userId: string, payload: CreateReportProblem) {
        payload.userId = userId;
        const user=await this.userModel.findById(userId);
        if(user){
            const userCount=(user.report_problem_count && user.report_problem_count.user) || 0
            const adminCount=(user.report_problem_count && user.report_problem_count.admin) || 0

            if(payload.sender===SenderReportProblem.ADMIN){
                user.report_problem_count={user:userCount+1,admin:adminCount};
            }else{
                user.report_problem_count={user:userCount,admin:adminCount+1};
            }

            await user.save();
            const newReportProblem = new this.reportProblemModel(payload);
            const saveReportProblem = await newReportProblem.save();
            return successResponse(200, 'report problem added', saveReportProblem);
        }else{
            return errorResponse(404, 'user not found');
        }
    }

    async getAllReportProblems() {
        const reportProblems = await this.reportProblemModel.find().populate('userId', 'first_name last_name user_name email');
        return successResponse(200, 'report problem', reportProblems);
    }

    async getAllReportProblemsOfUser(userId: string,type:string) {
        const user=await this.userModel.findById(userId);

        if(user && type===SenderReportProblem.ADMIN || type===SenderReportProblem.USER){

            const userCount=(user.report_problem_count && user.report_problem_count.user) || 0
            const adminCount=(user.report_problem_count && user.report_problem_count.admin) || 0


            if(type===SenderReportProblem.ADMIN){
                user.report_problem_count={user:userCount,admin:0};
            }else{
                user.report_problem_count={user:0,admin:adminCount};
            }

            await user.save();
            const reportProblems = await this.reportProblemModel.find({userId:new mongoose.Types.ObjectId(userId)});
            return successResponse(200, 'report problem', reportProblems);
        }else{
            return errorResponse(400, 'invalid request');
        }
    }


    async createAdminUser(payload: CreateAdminDto) {
        const admin = await this.adminModel.findOne({username: payload.username});
        if (admin) {
            return errorResponse(400, 'username already exist');
        } else {
            const passwordHash = await createPasswordHash(payload.password);
            payload.password = passwordHash;
            const newAdmin = new this.adminModel(payload);
            const saveAdmin = await newAdmin.save();
            return successResponse(200, 'admin added', saveAdmin);
        }
    }


    async getAdminByRole(role: String) {
        const admin = await this.adminModel.find({role});
        return successResponse(200, 'admin users', admin);
    }

    async updateAdminUser(id: String, payload: UpdateAdminDto) {
        const admin = await this.adminModel.findById(id);

        if (admin) {

            admin.set({...payload});
            const saveAdmin = await admin.save();
            return successResponse(200, 'admin updated', saveAdmin);
        } else {
            return errorResponse(404, 'user not found');
        }
    }


    async updateAdminPassword(id: String, payload: UpdateAdminPasswordDto) {
        const admin: any = await this.adminModel.findById(id);

        if (admin) {
            const validateAdmin = await validatePasswordHash(payload.old_password, admin.password);
            if (validateAdmin) {
                const passwordHash = await createPasswordHash(payload.new_password);
                admin.password = passwordHash;
                const saveAdmin = await admin.save();
                return successResponse(200, 'admin updated', saveAdmin);
            } else {
                return errorResponse(401, 'password not matched');
            }
        } else {
            return errorResponse(404, 'user not found');
        }
    }


    async validateAdminUser(@Body() payload: ValidateAdminDto) {
        const admin: any = await this.adminModel.findOne({username: payload.username});
        if (admin) {
            const validateAdmin = await validatePasswordHash(payload.password, admin.password);
            if (validateAdmin) {
                return successResponse(200, 'admin users', admin);
            } else {
                return errorResponse(401, 'invalid username  or password');
            }
        } else {
            return errorResponse(404, 'user not found');
        }
    }


    async getUserContactsList(userId: string) {
        const contactsList: any = await this.contactModel.findOne({user_id: new mongoose.Types.ObjectId(userId)});
        if (contactsList) {
            const list: any = contactsList.list;
            contactsList.list = list.sort((a, b) => {
                const date1: any = new Date(a.updated_at);
                const date2: any = new Date(b.updated_at);

                return date2 - date1;
            });
            return successResponse(200, 'admin users', contactsList);

        } else {
            return errorResponse(404, 'contacts list not found');
        }
    }


    async getUserImages(userId: string) {
        const user = await this.userModel.findById(userId).select('_id cover_image profile_image_url');
        const posts = await this.postModel.find({userId: new mongoose.Types.ObjectId(userId)}).select('_id post_images');
        const services = await this.serviceModel.find({user_id: new mongoose.Types.ObjectId(userId)}).select('_id photo');


        return {user, posts, services};
    }

    async deleteUserImage(payload: DeleteUserImageDto) {
        const list = payload.list;

        for (let i = 0; i < list.length; i++) {
            const item = list[i];

            if (item.type === DeleteUserType.USER) {
                let user: any = await this.userModel.findById(item.id);
                if (item.cover_image) {
                    user.cover_image = null;
                }
                if (item.profile_image_url) {
                    user.profile_image_url = null;
                }
                await user.save();
            } else if (item.type === DeleteUserType.POST) {
                const posts = await this.postModel.findById(item.id).select('_id post_images');
                const assetIndex = (posts.post_images).findIndex((image) => (image._id).toString() === (item.assetId).toString());

                if (assetIndex !== -1) {
                    posts.post_images[assetIndex].image_url = null;
                    await posts.save();
                }
            } else if (item.type === DeleteUserType.SERVICE) {
                const service = await this.serviceModel.findById(item.id);
                service.photo = null;
                await service.save();
            }

        }

        return {success: true};
    }

    async postFeedback(userId: string, payload: FeedbackDto) {
        const feedback = new this.feedbackModel({...payload, userId});
        const saveFeedback = await feedback.save();
        return saveFeedback;
    }


    async getFeedback(userId: string) {
        const feedback = await this.feedbackModel.find({userId: new mongoose.Types.ObjectId(userId)})
            .populate('userId', 'first_name last_name email profile_image_url')
            .sort({timestamp: -1});
        return feedback;
    }


    async updateFeedback(id: string, payload: FeedbackDto) {
        const feedback = await this.feedbackModel.findById(id);
        feedback.set(payload)
        const saveFeedback = await feedback.save();
        return saveFeedback;
    }


    async getUserHashTags(userId: string) {
        const user = await this.userModel.findById(userId).select('_id searched_results');
        return user;
    }

    async clearHashTags(userId:string){
        const user = await this.userModel.findById(new mongoose.Types.ObjectId(userId));
        if(user){
            user.searched_results=[];
            const updated_user=await user.save();
            return {searched_results:null}
        }else{
            return errorResponse(404, 'user not found');
        }
    }

}




//user->cover_image->profile_image_url

//user->cover_image->profile_image_url