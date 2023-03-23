import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import mongoose, {Model} from 'mongoose';
import {errorResponse, successResponse} from '../utils/response';
import {UserPaymentCardsDocument} from "../user-payment-cards/models/user-payment-cards.model";
import {ModelingDocument} from "./models/modeling.model";
import {
    AddModelPortfolio,
    AddRatingCategoryDto,
    AddSearchDto,
    AddVoteDto, BuyPortfolio,
    CreateModelDto,
    UpdateModelDto,
    UpdatePortfolioDto
} from "./dto/modeling.dto";
import {diffDays, getAge} from "../utils/date";
import {VoteDocument} from "./models/vote.models";
import {UserDocument} from "../users/models/users.model";
import {FilterDto} from "./dto/filter.dto";
import {AssetType, OrderByEnum} from "../enums/modeling.enum";
import {ModelingStatsDocument} from "./models/stats.model";
import {AddStatsDto} from "./dto/stats.dto";
import {ModelChatDocument} from "./models/chat.model";
import {CreateModelChatMessageDto} from "./dto/chat.dto";
import {ModelRatingCategoryDocument} from "./models/rating-category.models";
import {ContactDocument} from "../users/models/contacts.model";

const moment = require("moment");

import {Socket, Server} from 'socket.io';
import {ModelingGateway} from "./modeling.gateway";
import {id} from "aws-sdk/clients/datapipeline";
import {countPortfolioType, groupArray} from "../utils/array";

@Injectable()
export class ModelingService {

    constructor(
        @InjectModel('models') private readonly modelingModel: Model<ModelingDocument>,
        @InjectModel('votes')
        private readonly voteModel: Model<VoteDocument>,
        @InjectModel('users') private readonly userModel: Model<UserDocument>,
        @InjectModel('model-stats') private readonly stats: Model<ModelingStatsDocument>,
        @InjectModel('model-chats') private readonly modelChats: Model<ModelChatDocument>,
        @InjectModel('model-rating-category') private readonly modelRatingCategory: Model<ModelRatingCategoryDocument>,
        @InjectModel('contacts') private readonly contactModel: Model<ContactDocument>,
        @InjectModel('buy-portfolios') private readonly buyPortfolioModel: Model<ContactDocument>,
        private readonly modelingGateway: ModelingGateway
    ) {
    }


    create = async (payload: CreateModelDto) => {
        const user = await this.userModel.findById(payload.userId).lean();
        delete user._id;
        if (user) {
            payload.model = {...payload.model, age: getAge(new Date(payload.model.birth_date)), ...user};
            const model = new this.modelingModel({...payload.model, userId: payload.userId});
            const saveModel: any = await model.save();
            const vote = new this.voteModel({modelId: saveModel.id});
            const stats = new this.stats({modelId: saveModel.id});
            const saveVote = await vote.save();
            const saveStats = await stats.save();
            saveModel.statId = saveStats._id;
            saveModel.voteId = saveVote._id;
            const updateModels = await saveModel.save();
            return successResponse(200, 'Model created', {model: updateModels});
        } else {
            return errorResponse(404, 'user not found');
        }
    }


    async findAll() {
        const allModels = await this.modelingModel.find({}).select('-password');
        return allModels;
    }

    update = async (id: String, payload: UpdateModelDto) => {
        const model: any = await this.modelingModel.findById(id);
        if (model) {
            model.set(payload.model);
            const saveModel = await model.save();
            return successResponse(200, 'Model created', saveModel);
        } else {
            return errorResponse(404, "model not found");
        }
    }


    isVoteValid = (selectedVote, payload) => {
        let count = 0;
        for (let v of selectedVote) {
            const diff = diffDays(payload.date, v._doc.date);
            if (diff === 0) {
                return false;
            }
        }
        return true;
    }


    addVote = async (modelId: string, categoryId: string, payload: AddVoteDto) => {
        let vote: any = await this.voteModel.findOne({
            categoryId: new mongoose.Types.ObjectId(categoryId),
            modelId: new mongoose.Types.ObjectId(modelId)
        });

        let categoryVotesList: any = await this.voteModel.find({
            categoryId: new mongoose.Types.ObjectId(categoryId),
        });

        let votesList = [];
        for (let vote of categoryVotesList) {
            votesList = votesList.concat(vote.list);
        }

        if (!vote) {
            let createVote = new this.voteModel({modelId, categoryId});
            vote = await createVote.save();
        }

        let list = vote.list;
        const selectedVote = votesList.filter((l) => (l.userId).toString() === (payload.userId).toString());

        const diffInDays = diffDays(payload.date, new Date().toISOString());

        if (this.isVoteValid(selectedVote, payload) && diffInDays === 0) {
            (vote.list).push(payload);
            const saveVote = await vote.save();
            return successResponse(200, 'vote inserted', saveVote);
        } else {
            if (diffInDays < 0) {
                return errorResponse(500, 'You are using past date for voting.');
            } else if (diffInDays > 0) {
                return errorResponse(500, 'You are using future date for voting.');
            } else {
                return errorResponse(500, 'You already have voted today.');
            }
        }
    }

    removeVote = async (modelId: String, voteId: String, listId: String) => {
        const vote: any = await this.voteModel.findById(voteId);
        if (vote) {
            let list = vote.list;
            const filteredList = list.filter((l) => (l._id).toString() !== listId);
            vote.list = filteredList;
            const saveVote = await vote.save();
            return successResponse(200, 'vote remote', saveVote);
        } else {
            return errorResponse(404, 'not found');
        }
    }


    buildQuery = (filter: FilterDto) => {


        let query: any = [];
        let queryIndex = 0;

        if (filter.sort_by && filter.sort_by.near_by && filter.sort_by.near_by.latitude !== 0) {
            let location = {
                $geoNear: {
                    near: {
                        type: "Point",
                        coordinates: [filter.sort_by.near_by.latitude, filter.sort_by.near_by.longitude]
                    },
                    distanceField: "dist.calculated",
                    key: "location",
                    spherical: true
                }
            }
            query.push(location)
            query.push({"$sort": {"score": -1}});
            queryIndex = 2;
        } else if (filter.sort_by && filter.sort_by.rating) {
            let lookUp;
            if (filter.sort_by.rating.categoryId) {
                lookUp = {
                    $lookup: {
                        from: 'votes',
                        //localField: '_id',
                        //foreignField: 'modelId',
                        let: {id: "$_id"}, //localField
                        as: 'votesInfo',
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            {$eq: ["$categoryId", new mongoose.Types.ObjectId(filter.sort_by.rating.categoryId)]},
                                            {
                                                $eq: [
                                                    "$$id", //localField variable it can be used only in $expr
                                                    "$modelId" //foreignField
                                                ]
                                            }
                                        ]
                                    }
                                },
                            }
                        ]
                    }
                }

            } else {
                lookUp = {
                    $lookup: {
                        from: 'votes',
                        localField: '_id',
                        foreignField: 'modelId',
                        as: 'votesInfo',
                    }
                }

            }

            let unwind = {$unwind: {path: '$votesInfo', preserveNullAndEmptyArrays: true}};
            let project = {
                $project: {
                    country: 1,
                    city: 1,
                    gender: 1,
                    location: 1,
                    cover_photo: 1,
                    profile_image: 1,
                    pitch_video: 1,
                    age: 1,
                    questionnaires: 1,
                    past_experience: 1,
                    comments: 1,
                    work_type_looking_for: 1,
                    piercing_tattoos_description: 1,
                    tattoos: 1,
                    piercing: 1,
                    size: 1,
                    color: 1,
                    race: 1,
                    languages_spoken: 1,
                    weight: 1,
                    height: 1,
                    current_city: 1,
                    birth_date: 1,
                    selected_category: 1,
                    portfolio: 1,
                    statId: 1,
                    first_name: 1,
                    last_name: 1,
                    rating: 1,
                    voteId: 1,
                    vote_count: {$size: {"$ifNull": ["$votesInfo.list", []]}},
                    vote_casted: {$indexOfArray: ["$votesInfo.list.userId", new mongoose.Types.ObjectId(filter.user_id)]}
                }
            }

            query.push(lookUp);
            query.push(unwind);
            query.push(project);
            if (filter.sort_by.rating.order === OrderByEnum.ASCENDING) {
                query.push({"$sort": {"vote_count": 1}});
            } else if ((filter.sort_by.rating.order === OrderByEnum.DESCENDING)) {
                query.push({"$sort": {"vote_count": -1}});
            }
            queryIndex = 4;
        }

        query.push({$match: {}})

        if (filter.user_type) {
            query[queryIndex].$match.user_type = filter.user_type;
        }

        if (filter.search_query) {
            query[queryIndex].$match.$or = [{
                first_name: {
                    '$regex': `^${filter.search_query}$`,
                    $options: 'i'
                }
            }, {last_name: {'$regex': `^${filter.search_query}$`, $options: 'i'}}];
        }


        if (filter.filters && filter.filters.min_rating) {
            query[queryIndex].$match.rating = {$lte: filter.filters.min_rating}
        }

        if (filter.filters && filter.filters.looking_for) {
            query[queryIndex].$match.occupation = {$in: filter.filters.looking_for}
        }


        if (filter.user_id && filter.search_by_user) {
            query[queryIndex].$match.userId = new mongoose.Types.ObjectId(filter.user_id);
        } else if (filter.model_id) {
            query[queryIndex].$match._id = new mongoose.Types.ObjectId(filter.model_id);
        }

        if (filter.search_area && filter.search_area.cities_countries) {
            if (filter.search_area.cities_countries.cities) {
                query[queryIndex].$match.city = {$in: filter.search_area.cities_countries.cities}
            }

            if (filter.search_area.cities_countries.countries) {
                query[queryIndex].$match.country = {$in: filter.search_area.cities_countries.countries}
            }
        }


        if (filter.gender && (filter.gender).length > 0) {
            query[queryIndex].$match.gender = {$in: filter.gender}
        }

        if (filter.gender && (filter.gender).length > 0) {
            query[queryIndex].$match.gender = {$in: filter.gender}
        }


        if (filter.height) {
            const height = {
                height: {
                    value: {$gte: filter.height.min, $lte: filter.height.max},
                    unit: filter.height.unit
                }
            };
            query[queryIndex].$match = {...query[queryIndex].$match, ...height};
        }


        if (filter.weight) {
            const weight = {
                weight: {
                    value: {$gte: filter.weight.min, $lte: filter.weight.max},
                    unit: filter.weight.unit
                }
            };
            query[queryIndex].$match = {...query[queryIndex].$match, ...weight};
        }


        if (filter.color && filter.color) {
            let hair_color = [], eye_color = [], skin_color = [];
            if (filter.color.hair_color) hair_color = filter.color.hair_color;
            if (filter.color.eye_color) eye_color = filter.color.eye_color;
            if (filter.color.skin_color) skin_color = filter.color.skin_color;


            query[queryIndex].$match = {
                $or: [
                    {'color.hair_color': {$in: hair_color}},
                    {'color.eye_color': {$in: eye_color}},
                    {'color.skin_color': {$in: skin_color}}
                ]
            };


        }


        if (filter.race) {
            query[queryIndex].$match.race = filter.race;
        }

        if (filter.birth_date) {
            query[queryIndex].$match.birth_date = filter.birth_date;
        }

        if (filter.languages_spoken) {
            query[queryIndex].$match.languages_spoken = {$in: filter.languages_spoken};
        }


        if (filter.size) {
            query[queryIndex].$match.size = {...filter.size};
        }

        if (filter.past_experience) {
            query[queryIndex].$match.past_experience = {...filter.past_experience};
        }


        if (filter.pagination) {
            const page = filter.pagination.page;
            const perPage = filter.pagination.per_page;
            query.push({$skip: perPage * page});
            query.push({$limit: perPage});
        } else if (filter.limit && filter.limit > 0) {
            query.push({$limit: filter.limit});
        }

        return query;
    };


    filterModel = async (filter: FilterDto) => {
        let models: any;
        models = await this.modelingModel.aggregate(this.buildQuery(filter));


        for (let i = 0; i < models.length; i++) {
            const model = models[i];
            if (model.statId) {
                await this.saveStats(model.statId, {stats: filter.type, asset: ""});
            }
        }


        return successResponse(200, 'filter', models);
    };


    addSearchResult = async (id: String, payload: AddSearchDto) => {
        const model: any = await this.modelingModel.findById(id);
        if (model) {
            if (model.saved_searches) {
                (model.saved_searches).push(payload.saved_searches);
            } else {
                model.set(payload);
            }
            const saveModel = await model.save();
            return successResponse(200, 'Saved search', saveModel);
        } else {
            return errorResponse(404, "model not found");
        }
    }

    updateSearchResult = async (id: String, searchId: String, payload: AddSearchDto) => {
        const model: any = await this.modelingModel.findById(id);
        if (model) {
            const index = (model.saved_searches).findIndex((search) => (search._id).toString() === searchId);
            if (index !== -1) {
                model.saved_searches[index] = payload.saved_searches;
                const saveModel = await model.save();
                return successResponse(200, 'Search updated', saveModel);

            } else {
                return errorResponse(404, "search not found");
            }
        } else {
            return errorResponse(404, "model not found");
        }
    }


    deleteSearch = async (id: String, searchId: String) => {
        const model: any = await this.modelingModel.findById(id);
        if (model) {
            const filteredSearches = (model.saved_searches).filter((search) => (search._id).toString() !== searchId);
            model.saved_searches = filteredSearches;
            const saveModel = await model.save();
            return successResponse(200, 'Search updated', saveModel);
        } else {
            return errorResponse(404, "model not found");
        }
    }


    getModelById = async (id: String) => {
        const model: any = await this.modelingModel.findById(id);
        if (model) {
            if (model.statId) {
                await this.saveStats(model.statId, {stats: "profile", asset: ""});
            }
            return successResponse(200, 'model', model);
        } else {
            return errorResponse(404, "model not found");
        }
    }


    getModelByUserId = async (userId: string) => {
        const model: any = await this.modelingModel.find({userId});
        if (model) {
            return successResponse(200, 'model', model);
        } else {
            return errorResponse(404, "model not found");
        }
    }


    saveStats = async (statId: String, payload: AddStatsDto) => {
        const stats: any = await this.stats.findById(statId);
        if (stats) {
            if (!stats[payload.stats]) stats[payload.stats] = [];
            stats[payload.stats].push({createdAt: new Date().toISOString(), asset: payload.asset});
            const saveStats = await stats.save();
            return saveStats;
        } else {
            return null;
        }
    }

    addModelStats = async (modelId: String, statId: String, payload: AddStatsDto) => {
        const stats: any = await this.saveStats(statId, payload);
        if (stats) {
            return successResponse(200, 'stat added', {});
        } else {
            return errorResponse(404, "stat not found");
        }
    }

    groupBy = (data, key) => {
        let result = {};
        const lastDate = new Date();
        lastDate.setDate(lastDate.getDate() - 7);
        for (let d of data) {
            let prevCount = result[d[key]] || {count: 0, last_7_days: 0};
            result[d[key]] = {
                last_7_days: new Date(d.createdAt) >= lastDate ? prevCount.last_7_days + 1 : prevCount.last_7_days,
                count: prevCount.count + 1
            };
        }

        let convertedArray = [];
        for (const prop in result) {
            convertedArray.push({...result[prop], asset: prop});
        }
        return convertedArray;
    };
    getModelStats = async (modelId: string, statId: string) => {
        const d = new Date();
        d.setDate(d.getDate() - 7);
        //"profile.createdAt": {$gt: d}
        const stats: any = await this.stats.aggregate([
            {$match: {_id: new mongoose.Types.ObjectId(statId)}},
            {
                $project: {
                    portfolio_views: {$size: {"$ifNull": ["$portfolio", []]}},
                    basic_search: {$size: {"$ifNull": ["$basic", []]}},
                    advanced_search: {$size: {"$ifNull": ["$advance", []]}},
                    profile_visits_7_days: {
                        $size: {
                            $filter: {
                                input: "$profile",
                                as: "p",
                                cond: {$gte: ["$$p.createdAt", d]}
                            }
                        }
                    },
                    photos: 1
                },
            },

        ]);

        if (stats && stats.length > 0) {
            const photos_views: any = this.groupBy(stats[0].photos, "asset");
            stats[0].photos_views = photos_views.sort((a, b) => b.count - a.count);
            delete stats[0].photos;
            return successResponse(200, 'stats', stats);
        } else {
            return errorResponse(404, "stat not found");
        }
    }


    addChatMessage = async (payload: CreateModelChatMessageDto) => {
        const chatMessage = new this.modelChats(payload);

        let senderContacts = await this.contactModel.findOne({user_id: payload.senderId});
        let receiverContacts = await this.contactModel.findOne({user_id: payload.receiverId});

        if (!senderContacts) {
            const contact = new this.contactModel({user_id: payload.senderId, list: []});
            senderContacts = await contact.save();
        }

        if (!receiverContacts) {
            const contact = new this.contactModel({user_id: payload.receiverId, list: []});
            receiverContacts = await contact.save();
        }

        const senderIndex = (senderContacts.list).findIndex((user: any) => user.id === payload.receiverId);
        const receiverIndex = (receiverContacts.list).findIndex((user: any) => user.id === payload.senderId);

        const receiverData = {
            last_message: payload.message,
            count: receiverIndex !== -1 ? receiverContacts.list[receiverIndex].count + 1 : 1,
            userInfo: payload.senderInfo,
            id: payload.senderId,
            updated_at: new Date().toISOString()
        };


        const senderData = {
            last_message: payload.message,
            count: senderIndex !== -1 ? senderContacts.list[senderIndex].count : 0,
            id: payload.receiverId,
            userInfo: payload.receiverInfo,
            updated_at: new Date().toISOString()
        }

        if (senderIndex >= 0) {
            senderContacts.list[senderIndex] = senderData;
        } else {
            (senderContacts.list).push(senderData)
        }


        if (receiverIndex >= 0) {
            receiverContacts.list[receiverIndex] = receiverData;
        } else {
            (receiverContacts.list).push(receiverData)
        }


        const savedSenderContacts = await senderContacts.save();
        const savedReceiverContacts = await receiverContacts.save();
        const saveChatMessage = await chatMessage.save();
        this.modelingGateway.server.emit("message", saveChatMessage);
        this.modelingGateway.server.emit("contacts" + (payload.senderId).toString(), savedSenderContacts);
        this.modelingGateway.server.emit("contacts" + (payload.receiverId).toString(), savedReceiverContacts);

        return successResponse(200, 'message saved', saveChatMessage);
    }


    updateContactsCountZero = async (userId, receiverId) => {
        let senderContacts = await this.contactModel.findOne({user_id: new mongoose.Types.ObjectId(userId)});
        const senderIndex = (senderContacts.list).findIndex((user: any) => user.id === receiverId);
        if (senderIndex >= 0) {
            senderContacts.list[senderIndex].count = 0;
            const savedContactsList = await senderContacts.save();
            this.modelingGateway.server.emit("contacts" + (userId).toString(), savedContactsList);
        }

    }

    getModelChatMessages = async (senderId: string, receiverId: string) => {
        const convertedSenderId = new mongoose.Types.ObjectId(senderId);
        const convertedReceiverId = new mongoose.Types.ObjectId(receiverId);
        const messages: any = await this.modelChats.find(
            {
                $or: [
                    {$and: [{senderId: convertedSenderId}, {receiverId: convertedReceiverId}]},
                    {$and: [{senderId: convertedReceiverId}, {receiverId: convertedSenderId}]}
                ]
            });


        let senderContacts = await this.contactModel.findOne({user_id: senderId});
        const senderIndex = (senderContacts.list).findIndex((user: any) => user.id === receiverId);
        if (senderIndex >= 0) {
            senderContacts.list[senderIndex].count = 0;
            const savedContactsList = await senderContacts.save();
            this.modelingGateway.server.emit("contacts" + (senderId).toString(), savedContactsList);
        }


        return successResponse(200, 'messages', messages);
    }

    deleteMessage = async (messageId: string) => {
        const message = await this.modelChats.findById(messageId);
        if (message) {
            await message.remove();
            return successResponse(200, 'message', message);
        } else {
            return errorResponse(404, 'message not found.');
        }
    }


    addRatingCategory = async (payload: AddRatingCategoryDto) => {
        const ratingCategory = new this.modelRatingCategory(payload.category);
        const saveRatingCategory = await ratingCategory.save();
        return successResponse(200, 'rating category saved', saveRatingCategory);
    }

    getAllRatingCategories = async () => {
        const ratingCategory = await this.modelRatingCategory.find();
        return successResponse(200, 'rating category saved', ratingCategory);
    }

    updateRatingCategory = async (id: string, payload: AddRatingCategoryDto) => {
        const ratingCategory = await this.modelRatingCategory.findById(id);
        if (ratingCategory) {
            ratingCategory.set({...payload.category});
            const saveRating = await ratingCategory.save();
            return successResponse(200, 'rating category updated', ratingCategory);
        } else {
            return errorResponse(404, "rating category not found");

        }
    }

    getRatingCategoryById = async (id: string) => {
        const ratingCategory = await this.modelRatingCategory.findById(id);
        return successResponse(200, 'rating categories', ratingCategory);
    }

    deleteRatingCategory = async (id: string) => {
        const ratingCategory = await this.modelRatingCategory.findById(id);
        if (ratingCategory) {
            const deleteRatingCategory = await ratingCategory.remove();
            return successResponse(200, 'rating category deleted', deleteRatingCategory);
        } else {
            return errorResponse(404, "rating category not found");
        }
    }


    updateModelPortfolio = async (id: string, payload: UpdatePortfolioDto) => {
        const model = await this.modelingModel.findById(id);
        const updatedPortfolios = payload.portfolio;
        if (model) {
            const modelPortfolio = model.portfolio;
            for (let i = 0; i < (updatedPortfolios).length; i++) {
                const newPortfolio = updatedPortfolios[i];
                const index = modelPortfolio.findIndex((portfolio) => (portfolio._id).toString() === (newPortfolio._id).toString());
                if (index !== -1) {
                    const prevPortfolio = JSON.parse(JSON.stringify(modelPortfolio[index]));
                    modelPortfolio[index] = {...prevPortfolio, ...newPortfolio}
                }
            }
            const updatedModel = await model.save();
            return successResponse(200, 'updated', updatedModel);
        } else {
            return errorResponse(404, "model not found");
        }
    }


    addModelPortfolio = async (id: string, payload: AddModelPortfolio) => {
        const model = await this.modelingModel.findById(id);
        if (model) {
            let modelPortfolio = model.portfolio;
            if (modelPortfolio) {
                modelPortfolio.push(payload.portfolio);
            } else {
                modelPortfolio = [payload.portfolio]
            }
            model.portfolio = modelPortfolio;
            const updatedModel = await model.save();
            return successResponse(200, 'updated', updatedModel);
        } else {
            return errorResponse(404, "model not found");
        }
    }


    deletePortfolio = async (id: string, portfolioId: string) => {
        const model = await this.modelingModel.findById(id);
        if (model) {
            const modelPortfolio = model.portfolio;
            const filteredModelPortfolio = modelPortfolio.filter((portfolio) => (portfolio._id).toString() !== portfolioId.toString())
            model.portfolio = filteredModelPortfolio;
            const updatedModel = await model.save();
            return successResponse(200, 'updated', updatedModel);
        } else {
            return errorResponse(404, "model not found");
        }
    }


    buyModelPortfolios = async (id: string, portfolioId: string, payload: BuyPortfolio) => {
        const model = await this.modelingModel.findById(id);

        if (model) {
            const modelPortfolio = model.portfolio;
            const findIndex = modelPortfolio.findIndex((portfolio) => (portfolio._id).toString() === (portfolioId).toString());
            if (findIndex !== -1) {
                const selectedPortfolio = modelPortfolio[findIndex];
                if (selectedPortfolio && selectedPortfolio[payload.portfolio_type]) {
                    const portfolioType = selectedPortfolio[payload.portfolio_type];
                    const data = {
                        price: portfolioType.value,
                        type: selectedPortfolio.type || "image",
                        country: payload.country,
                        modelId: id,
                        license_type: payload.portfolio_type,
                        portfolioId,
                        asset: selectedPortfolio.asset
                    }
                    const buyPortfolio = new this.buyPortfolioModel(data);
                    const saveBuyPortfolio = await buyPortfolio.save();
                    return successResponse(200, 'saveBuyPortfolio', saveBuyPortfolio);

                } else {
                    return errorResponse(404, "invalid request");
                }
            } else {
                return errorResponse(404, "portfolio not found");
            }

        } else {
            return errorResponse(404, "model not found");
        }

    }


    getModelBuyPortfolioStats = async (id: string) => {
        const buyStats: any = await this.buyPortfolioModel.find({modelId: new mongoose.Types.ObjectId(id)}).lean()
        const totalSales = buyStats.length;
        const imagesSold = buyStats.filter((stats: any) => stats.type === AssetType.IMAGE).length;
        const videosSold = buyStats.filter((stats: any) => stats.type === AssetType.VIDEO).length;
        const totalEarnings = buyStats.reduce((a: any, b: any) => a + b["price"], 0);
        const countryStats = groupArray(buyStats, 'country', "count");
        const filteredBuyStats: any = buyStats.filter((stat) => {
            const formattedDateCreated = moment(stat.date_created);
            const currentDate = moment(new Date())
            const diff = currentDate.diff(formattedDateCreated, 'days');
            return diff < 8;
        }).map((stat) => {
            stat.date_created = moment(stat.date_created).format("YYYY-MM-DD");
            stat.portfolioId = (stat.portfolioId).toString()
            return stat;
        }).sort((a: any, b: any) => {
            const date1: any = new Date(a.date_created);
            const date2: any = new Date(b.date_created);
            return date2 - date1;
        });


        const licenseStatsGlobal = groupArray(filteredBuyStats.filter((stat)=>stat.license_type!=='single_use'), 'date_created', "global_count")
        const licenseStatsSingle = groupArray(filteredBuyStats.filter((stat)=>stat.license_type==='single_use'), 'date_created', "single_use_count");

        let licenseStats=[...licenseStatsGlobal,...licenseStatsSingle];

        let filteredLicenseStats=[]
        for(let i=0;i<licenseStats.length;i++){
            let stat:any=licenseStats[i];
            const index=filteredLicenseStats.findIndex((l:any)=>l.date_created===(stat.date_created));
            if(index===-1){
                filteredLicenseStats.push(stat)
            }else{
                delete stat["date_created"];
                const selected=filteredLicenseStats[index];
                filteredLicenseStats[index]={...selected,...stat};
            }
        }


        const topPortfolioStats:any = groupArray(buyStats, 'portfolioId', "count")
            .sort((a: any, b: any) => {
                return b.count - a.count;
            });

        let formattedTopPortfolioStats=[];

        for(let stats of topPortfolioStats){
            stats.single_use=countPortfolioType(buyStats,stats.portfolioId,"single_use");
            stats.UNLIMITED_USE_COUNTRY=countPortfolioType(buyStats,stats.portfolioId,"unlimited_use_country")
            stats.UNLIMITED_USE_GLOBAL=countPortfolioType(buyStats,stats.portfolioId,"unlimited_use_global");
            stats.asset=stats.single_use.asset || stats.UNLIMITED_USE_COUNTRY.asset || stats.UNLIMITED_USE_GLOBAL.asset
        }

        return successResponse(200, 'saveBuyPortfolio',
            {
                totalSales,
                imagesSold,
                videosSold,
                totalEarnings,
                countryStats,
                licenseStats:filteredLicenseStats,
                topPortfolioStats
            });
    }

}
