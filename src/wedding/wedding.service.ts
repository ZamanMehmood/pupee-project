import {Injectable} from '@nestjs/common';
import {HttpService} from '@nestjs/axios';
import {AxiosResponse} from 'axios'
import {InjectModel} from '@nestjs/mongoose';
import mongoose, {Model} from 'mongoose';
import {errorResponse, successResponse} from '../utils/response';
import {
    CreateWeddingDto, SendAnnouncementDto,
    UpdateCheckListDto,
    UpdateChecklistStatusDto,
    UpdateRecipientDto, UpdateWeddingDto,
    UpdateWeddingVowsDto
} from './dtos/wedding.dto';
import {WeddingDocument} from './models/wedding.model';
import {GroupChatDocument} from "../group-chat/models/group-chat";
import {WeddingAnnouncementDocument} from './models/wedding-annoucement.model';

import {
    AddWeddingAnnouncementDto,
    AddWeddingTemplateDto,
    UpdateWeddingAnnouncementDto, UpdateWeddingTemplateDto
} from "./dtos/wedding-announcement.dto";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {AddWeddingReceptionDto, UpdateWeddingServicesUpdate} from "./dtos/wedding-services.dto";
import {WeddingServicesDocument} from "./models/wedding-services.model";
import {WeddingRegistryDocument} from "./models/wedding-registry.model";
import {AddWeddingRegistry, UpdateWeddingRegistry} from "./dtos/wedding-registry.dto";
import {WeddingMediumTypeEnum} from "../enums/wedding.enum";
import {CreateWeddingAlbumDto, ShareAlbumDto, UpdateWeddingAlbumDto} from "./dtos/wedding-album.dto";
import {WeddingAlbumDocument} from "./models/wedding-album.model";
import {UserDocument} from "../users/models/users.model";
import {
    AddUpdateOrderOfProceedingEventDto,
    CreateOrderOfProceedingDto,
    ShareOrderOfProceedingDto,
} from "./dtos/order-of-proceeding.dto";
import {OrderOfProceedingDocument} from "./models/order-of-proceeding.model";
import {PlaylistDocument} from "./models/playlist.model";
import {AddUpdateEventDto, CreatePlaylistDto, SharePlaylistDto} from "./dtos/playlist.dto";
import {CreateVowDto, UpdateVowDto} from "./dtos/vow.dto";
import {VowDocument} from "./models/vow.model";
import {AddUpdateBudgetDto, CreateBudgetDto, UpdateBudgetTotalDto} from "./dtos/budget-planner.dto";
import {BudgetPlanner} from "./models/budget-planner.model";
import {WeddingAnniversaryDto} from "./dtos/wedding-anniversary.dto";
import * as SgMail from '@sendgrid/mail';
import {formattedDescription} from "./utils/announcement";
import {checkIfString} from "../utils/type-checker";

SgMail.setApiKey(
    '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',
);

@Injectable()
export class WeddingService {
    constructor(
        @InjectModel('wedding') private readonly weddingModel: Model<WeddingDocument>,
        @InjectModel('groups') private readonly groupsChatModel: Model<GroupChatDocument>,
        @InjectModel('wedding-announcements') private readonly weddingAnnouncementModel: Model<WeddingAnnouncementDocument>,
        @InjectModel('wedding-services') private readonly weddingServicesModel: Model<WeddingServicesDocument>,
        @InjectModel('wedding-registries') private readonly weddingRegistryModel: Model<WeddingRegistryDocument>,
        @InjectModel('wedding-albums') private readonly weddingAlbumModel: Model<WeddingAlbumDocument>,
        @InjectModel('users') private readonly userModel: Model<UserDocument>,
        @InjectModel('order-of-proceedings') private readonly orderOfProceedingModel: Model<OrderOfProceedingDocument>,
        @InjectModel('playlists') private readonly playlistModel: Model<PlaylistDocument>,
        @InjectModel('vows') private readonly vowModel: Model<VowDocument>,
        @InjectModel('budget-planners') private readonly budgetPlannerModel: Model<BudgetPlanner>,
        private httpService: HttpService
    ) {
    }

    createWedding = async (payload: CreateWeddingDto) => {
        const wedding = new this.weddingModel(payload);
        const saveWedding = await wedding.save();
        const weddingAnnouncement = new this.weddingAnnouncementModel({
            weddingId: saveWedding._id,
            type: WeddingMediumTypeEnum.ANNOUNCEMENT
        });
        const weddingInvitation = new this.weddingAnnouncementModel({
            weddingId: saveWedding._id,
            type: WeddingMediumTypeEnum.INVITATION
        });
        const weddingSpeech = new this.weddingAnnouncementModel({
            weddingId: saveWedding._id,
            type: WeddingMediumTypeEnum.SPEECHES
        });

        const weddingRegistry = new this.weddingRegistryModel({
            weddingId: saveWedding._id
        });

        const weddingAlbum = new this.weddingAlbumModel({
            weddingId: saveWedding._id
        });

        const orderOfProceedings = new this.orderOfProceedingModel({
            weddingId: saveWedding._id
        });

        const playlist = new this.playlistModel({
            weddingId: saveWedding._id
        });

        const budgetPlanner = new this.budgetPlannerModel({
            weddingId: saveWedding._id
        });


        const vows = new this.vowModel({
            weddingId: saveWedding._id
        });

        const saveWeddingAnnouncement = await weddingAnnouncement.save();
        const saveWeddingInvitation = await weddingInvitation.save();
        const saveWeddingSpeech = await weddingSpeech.save();
        const saveWeddingRegistry = await weddingRegistry.save();
        const saveWeddingAlbum = await weddingAlbum.save();
        const saveOrderOfProceedings = await orderOfProceedings.save();
        const savePlaylist = await playlist.save();
        const saveBudgetPlanner = await budgetPlanner.save();
        const saveVow = await vows.save();

        return successResponse(
            200,
            'Wedding Created',
            {
                wedding: saveWedding,
                weddingAnnouncement: saveWeddingAnnouncement,
                weddingInvitation: saveWeddingInvitation,
                weddingSpeech: saveWeddingSpeech,
                weddingRegistry: saveWeddingRegistry,
                weddingAlbum: saveWeddingAlbum,
                orderOfProceedings: saveOrderOfProceedings,
                playlist: savePlaylist,
                budgetPlanner: saveBudgetPlanner,
                vows: saveVow
            },
        );
    };


    updateWedding = async (id: string, payload: UpdateWeddingDto) => {
        const wedding = await this.weddingModel.findById(id);
        if (wedding) {
            wedding.set(payload)
            const saveWedding = await wedding.save();
            return successResponse(200, 'Wedding updated', wedding);
        } else {
            return errorResponse(404, 'Wedding not found');
        }
    }


    addRecipient = async (id: string, payload: UpdateRecipientDto) => {
        const wedding: any = await this.weddingModel.findById(id);

        if (wedding) {
            if (wedding.recipient) {
                (wedding.recipient).push(payload.recipient)
            } else {
                wedding.recipient = [payload.recipient];
            }
            wedding.announcement = payload.announcement;
            await wedding.save();
            return successResponse(200, 'Recipient added', wedding);
        } else {
            return errorResponse(404, 'Wedding not found');
        }
    };


    removeRecipient = async (id: string, recipient_id: string) => {
        const wedding: any = await this.weddingModel.findById(id);

        if (wedding) {
            let filteredRecipient = (wedding.recipient).filter((r) => (r._id).toString() !== recipient_id);
            wedding.recipient = filteredRecipient;
            await wedding.save();
            return successResponse(200, 'Recipient removed', wedding);
        } else {
            return errorResponse(404, 'Wedding not found');
        }
    };

    addCheckList = async (id: string, payload: UpdateCheckListDto) => {
        const wedding: any = await this.weddingModel.findById(id);

        if (wedding) {
            if (wedding.checkList) {
                (wedding.checkList).push(payload.checkList)
            } else {
                wedding.checkList = [payload.checkList];
            }
            await wedding.save();
            return successResponse(200, 'Checklist added', wedding);
        } else {
            return errorResponse(404, 'Wedding not found');
        }
    };


    updateCheckList = async (id: string, checkListId: string, payload: UpdateChecklistStatusDto) => {
        const wedding: any = await this.weddingModel.findById(id);

        if (wedding) {
            if (wedding.checkList) {
                let index = (wedding.checkList).findIndex((c) => (c._id).toString() === checkListId);
                if (index !== -1) {
                    (wedding.checkList[index]).booked = payload.booked;
                    await wedding.save();
                }
            }
            return successResponse(200, 'Checklist updated', wedding);
        } else {
            return errorResponse(404, 'Wedding not found');
        }
    };


    removeChecklist = async (id: string, checkListId: string) => {
        const wedding: any = await this.weddingModel.findById(id);

        if (wedding) {
            let filteredCheckList = (wedding.checkList).filter((c) => (c._id).toString() !== checkListId);
            wedding.checkList = filteredCheckList;
            await wedding.save();
            return successResponse(200, 'Checklist updated', wedding);
        } else {
            return errorResponse(404, 'Wedding not found');
        }
    };


    getWeddingById = async (id: string) => {
        const wedding: any = await this.weddingModel.findById(id).lean();
        if(wedding && wedding.userId){
            const user = await this.userModel.findById(wedding.userId);
            if (user.wedding_synced && user.wedding_synced.sync && user.wedding_synced.wedding) {
                const syncedWedding: any = await this.weddingModel.findById(user.wedding_synced.wedding);
                if (syncedWedding) {
                    syncedWedding.is_synced = true;
                    return successResponse(200, 'wedding details', [syncedWedding]);
                } else {
                    return errorResponse(404, 'No wedding found.');
                }
            } else {
                if (wedding) {
                    const group: any = await this.groupsChatModel.find({weddingId: wedding._id});
                    wedding.group = group;
                    return successResponse(200, 'wedding details', wedding);
                } else {
                    return errorResponse(404, 'No wedding found.');
                }
            }
        }else {
            return errorResponse(400, 'Invalid request.');
        }


    };


    deleteWeddingById = async (id: string) => {
        const wedding: any = await this.weddingModel.findOneAndRemove({_id: new mongoose.Types.ObjectId(id)});
        return wedding;
    };


    getWeddingByUserId = async (id: string) => {
        const wedding: any = await this.weddingModel.find({userId: id}).lean();
        const user = await this.userModel.findById(id);


        if (user.wedding_synced && user.wedding_synced.sync && user.wedding_synced.wedding) {
            const syncedWedding: any = await this.weddingModel.findById(user.wedding_synced.wedding);
            if (syncedWedding) {
                syncedWedding.is_synced = true;
                return successResponse(200, 'wedding details', [syncedWedding]);
            } else {
                return errorResponse(404, 'No wedding found.');
            }
        } else {
            if (wedding) {
                for (let i = 0; i < wedding.length; i++) {
                    try {
                        const group: any = await this.groupsChatModel.find({weddingId: wedding[i]._id});
                        wedding[i].group = group;
                    } catch (e) {
                    }
                }
                return successResponse(200, 'wedding details', wedding);
            } else {
                return errorResponse(404, 'No wedding found.');
            }
        }
    };

    getWeddingBudget(): Observable<any> {
        return this.httpService.get('http://184.169.179.30:1337/api/wedding-budgets')
            .pipe(map(response => successResponse(200, 'Wedding budget details', response.data)));
    };


    getWeddingGuests = async () => {
        return this.httpService.get('http://184.169.179.30:1337/api/wedding-guests')
            .pipe(map(response => successResponse(200, 'Wedding guest details', response.data)));
    }


    addWeddingAnnouncement = async (weddingId: String, payload: AddWeddingAnnouncementDto) => {
        payload.weddingId = weddingId;
        const weddingAnnouncement = new this.weddingAnnouncementModel(payload);
        const saveWeddingAnnouncement = await weddingAnnouncement.save();
        return successResponse(200, 'Wedding announcement Created', saveWeddingAnnouncement,);
    }


    updateWeddingAnnouncement = async (weddingAnnouncementId: String, payload: UpdateWeddingAnnouncementDto) => {
        payload.weddingAnnouncementId = weddingAnnouncementId;
        let weddingAnnouncement: any = await this.weddingAnnouncementModel.findById(weddingAnnouncementId);
        if (!weddingAnnouncement) {
            return errorResponse(404, 'Wedding announcement not found');
        }
        weddingAnnouncement.template = payload.template;
        weddingAnnouncement.recipient = payload.recipient;

        const saveWeddingAnnouncement = await weddingAnnouncement.save();
        return successResponse(
            200,
            'Wedding announcement Updated',
            saveWeddingAnnouncement,
        );
    }


    addAnnouncementRecipient = async (id: string, payload: UpdateRecipientDto) => {
        const wedding: any = await this.weddingAnnouncementModel.findById(id);

        if (wedding) {
            if (wedding.recipient) {
                (wedding.recipient).push(payload.recipient)
            } else {
                wedding.recipient = [payload.recipient];
            }
            wedding.announcement = payload.announcement;
            await wedding.save();
            return successResponse(200, 'Recipient added', wedding);
        } else {
            return errorResponse(404, 'Wedding announcement not found');
        }
    };

    updateAnnouncementRecipient = async (id: string, recipient_id: string, payload: UpdateRecipientDto) => {
        const wedding: any = await this.weddingAnnouncementModel.findById(id);

        if (wedding && wedding.recipient) {
            const recipientIndex = (wedding.recipient)
                .findIndex((recipient) => recipient_id.toString() === (recipient._id).toString());
            if (recipientIndex !== -1) {
                wedding.recipient[recipientIndex] = payload.recipient;
                await wedding.save();
                return successResponse(200, 'Recipient updated', wedding);

            } else {
                return errorResponse(404, 'Recipient not found');
            }
        } else {
            return errorResponse(404, 'Wedding announcement not found');
        }
    };


    removeAnnouncementRecipient = async (id: string, recipient_id: string) => {
        const wedding: any = await this.weddingAnnouncementModel.findById(id);

        if (wedding) {
            let filteredRecipient = (wedding.recipient).filter((r) => (r._id).toString() !== recipient_id);
            wedding.recipient = filteredRecipient;
            await wedding.save();
            return successResponse(200, 'Recipient removed', wedding);
        } else {
            return errorResponse(404, 'Wedding announcement not found');
        }
    };

    addWeddingTemplate = async (id: string, payload: AddWeddingTemplateDto) => {
        const wedding: any = await this.weddingAnnouncementModel.findById(id);

        if (wedding) {
            if (wedding.template) {
                if (payload.template.default) {
                    const updatedWeddingTemplate = (wedding.template).map((t) => {
                        t.default = false;
                        return t;
                    });
                    (updatedWeddingTemplate).push(payload.template)
                    wedding.template = updatedWeddingTemplate;
                } else {
                    (wedding.template).push(payload.template)
                }
            } else {
                wedding.template = [payload.template];
            }
            await wedding.save();
            return successResponse(200, 'wedding template added', wedding);
        } else {
            return errorResponse(404, 'Wedding announcement not found');
        }
    };


    updateWeddingTemplate = async (weddingId: string, weddingTemplateId: string, payload: UpdateWeddingTemplateDto) => {
        const wedding: any = await this.weddingAnnouncementModel.findById(weddingId);

        if (wedding) {
            let index = (wedding.template).findIndex((r) => (r._id).toString() === weddingTemplateId);

            if (index !== -1) {
                if (payload.template.default) {
                    const updatedWeddingTemplate = (wedding.template).map((t) => {
                        t.default = false;
                        return t;
                    });
                    updatedWeddingTemplate[index] = payload.template;
                    wedding.template = updatedWeddingTemplate;
                } else {
                    (wedding.template)[index] = payload.template;
                }
                await wedding.save();
                return successResponse(200, 'wedding template updated', wedding);
            } else {
                return errorResponse(404, 'template not found');
            }
        } else {
            return errorResponse(404, 'Wedding announcement not found');
        }
    };

    updateWeddingTemplateToDefault = async (weddingId: string, weddingTemplateId: string) => {
        const wedding: any = await this.weddingAnnouncementModel.findById(weddingId);

        if (wedding) {
            let index = (wedding.template).findIndex((r) => (r._id).toString() === weddingTemplateId);

            if (index !== -1) {
                const updatedWeddingTemplate = (wedding.template).map((t) => {
                    t.default = false;
                    return t;
                });
                updatedWeddingTemplate[index].default = true;
                wedding.template = updatedWeddingTemplate;
                await wedding.save();
                return successResponse(200, 'wedding template updated', wedding);
            } else {
                return errorResponse(404, 'template not found');
            }
        } else {
            return errorResponse(404, 'Wedding announcement not found');
        }
    };

    removeWeddingTemplate = async (weddingId: string, weddingTemplateId: string) => {
        const wedding: any = await this.weddingAnnouncementModel.findById(weddingId);

        if (wedding) {
            let index = (wedding.template).findIndex((r) => (r._id).toString() === weddingTemplateId);

            if (index !== -1) {
                let filteredRecipient = (wedding.template).filter((t) => (t._id).toString() !== weddingTemplateId);
                wedding.template = filteredRecipient;
                await wedding.save();
                return successResponse(200, 'wedding template removed', wedding);
            } else {
                return errorResponse(404, 'template not found');
            }
        } else {
            return errorResponse(404, 'Wedding announcement not found');
        }
    };


    getWeddingAnnouncements = async (weddingId: string, type: String) => {
        const wedding: any = await this.weddingAnnouncementModel.find({weddingId, type});

        if (wedding) {
            return successResponse(200, 'wedding announcements', wedding);
        } else {
            return errorResponse(404, 'Wedding announcement not found');
        }
    };


    updateWeddingVows = async (weddingId: String, payload: UpdateWeddingVowsDto) => {
        let wedding: any = await this.weddingModel.findById(weddingId);
        if (!wedding) {
            return errorResponse(404, 'Wedding not found');
        }
        wedding.vows = payload.vows;

        const saveWedding = await wedding.save();
        return successResponse(
            200,
            'Wedding announcement Updated',
            saveWedding,
        );
    }


    getWeddingServices = async () => {
        return this.httpService.get('http://184.169.179.30:1337/api/wedding-services?populate=*')
            .pipe(map(response => successResponse(200, 'Wedding services', {baseUrl: "http://184.169.179.30:1337", ...response.data})));
    }


    addWeddingService = async (weddingId: String, payload: AddWeddingReceptionDto) => {
        payload.weddingId = weddingId;
        const weddingService = new this.weddingServicesModel(payload);
        const saveWeddingService = await weddingService.save();
        return successResponse(200, 'Wedding service Created', saveWeddingService,);
    }


    updateWeddingService = async (weddingServiceId: String, payload: UpdateWeddingServicesUpdate) => {
        payload.weddingServiceId = weddingServiceId;
        let weddingService: any = await this.weddingServicesModel.findById(weddingServiceId);
        if (!weddingService) {
            return errorResponse(404, 'Wedding service not found');
        }

        weddingService.set(payload);

        const saveWeddingService = await weddingService.save();
        return successResponse(
            200,
            'Wedding service Updated',
            saveWeddingService,
        );
    }

    getWeddingService = async (id: string) => {
        const weddingService: any = await this.weddingServicesModel.find({weddingId: id}).lean();
        if (weddingService) {
            return successResponse(200, 'wedding services', weddingService);
        } else {
            return errorResponse(404, 'No wedding service  found.');
        }
    };


    addWeddingRegistry = async (weddingId: String, payload: AddWeddingRegistry) => {
        payload.weddingId = weddingId;
        const weddingRegistry = new this.weddingRegistryModel(payload);
        const saveWeddingRegistry = await weddingRegistry.save();
        return successResponse(200, 'Wedding registry Created', saveWeddingRegistry,);
    }


    updateWeddingRegistry = async (weddingRegistryId: String, payload: UpdateWeddingRegistry) => {
        payload.weddingRegistryId = weddingRegistryId;
        let weddingRegistry: any = await this.weddingRegistryModel.findById(weddingRegistryId);
        if (!weddingRegistry) {
            return errorResponse(404, 'Wedding registry not found');
        }

        weddingRegistry.set(payload);

        const saveWeddingRegistry = await weddingRegistry.save();
        return successResponse(
            200,
            'Wedding registry Updated',
            saveWeddingRegistry,
        );
    }

    getWeddingRegistry = async (id: string) => {
        const weddingRegistry: any = await this.weddingRegistryModel.find({weddingId: id}).lean();
        if (weddingRegistry) {
            return successResponse(200, 'wedding services', weddingRegistry);
        } else {
            return errorResponse(404, 'No wedding service  found.');
        }
    };

    removeWeddingRegistry = async (id: string) => {
        const weddingRegistry: any = await this.weddingRegistryModel.findById(id);
        if (weddingRegistry) {
            await weddingRegistry.remove();
            return successResponse(200, 'wedding removed', weddingRegistry);
        } else {
            return errorResponse(404, 'No wedding service  found.');
        }
    };


    removeAlbumFromUsers = async (userToRemove: any, albumId: String) => {
        for (let i = 0; i < userToRemove.length; i++) {
            const user = await this.userModel.findById(userToRemove[i].userId);
            if (user && user.shared_albums) {
                user.shared_albums = (user.shared_albums).filter((album: any) => album.toString() !== albumId);
                await user.save();
            }
        }
        return;
    }


    addUserToAlbum = async (userToAdd: any,weddingId: String, albumId: String) => {

        for (let i = 0; i < userToAdd.length; i++) {
            const user = await this.userModel.findById(userToAdd[i].userId);
            if (user) {
                if (user.shared_albums) {

                    const index = (user.shared_albums).findIndex((shared) => shared.albumId  && (shared.albumId).toString() === albumId.toString())
                    if (index === -1) {
                        (user.shared_albums).push({albumId, weddingId, can_edit: userToAdd[i].can_edit});
                    }
                    else {
                        user.shared_albums[index] = {albumId, weddingId, can_edit: userToAdd[i].can_edit};
                    }
                } else {
                    user.shared_albums = [{albumId, weddingId, can_edit: userToAdd[i].can_edit}];
                }
                await user.save();
            }
        }

        return;
    }


    createWeddingAlbum = async (weddingId: String, payload: CreateWeddingAlbumDto) => {
        payload.weddingId = weddingId;
        const weddingAlbum = new this.weddingAlbumModel(payload);
        const saveWeddingAlbum = await weddingAlbum.save();
        return successResponse(200, 'Wedding album Created', saveWeddingAlbum,);
    }



    deleteWeddingAlbum = async (id:String) => {
        const deleteAlbum=await this.weddingAlbumModel.findByIdAndDelete(id);
        return successResponse(200, 'Wedding album deleted', deleteAlbum,);
    }

    updateWeddingAlbum = async (weddingId: String, weddingAlbumId: String, payload: UpdateWeddingAlbumDto) => {
        const weddingAlbum: any = await this.weddingAlbumModel.findById(weddingAlbumId);
        if (weddingAlbum) {
            weddingAlbum.title = payload.title || weddingAlbum.title;
            if (payload.album) {
                weddingAlbum.album = payload.album;
            }
            const saveWeddingAlbum = await weddingAlbum.save();
            return successResponse(200, 'Wedding album update', saveWeddingAlbum,);
        } else {
            return errorResponse(404, 'No wedding album  found.');
        }
    }


    shareAlbum = async (weddingId: String, weddingAlbumId: String, payload: ShareAlbumDto) => {
        const weddingAlbum: any = await this.weddingAlbumModel.findById(weddingAlbumId);
        if (weddingAlbum) {
            if (payload.user_to_remove) {
                let userToRemove: any = payload.user_to_remove;
                weddingAlbum.shared_with = userToRemove.filter((user) => (
                    weddingAlbum.shared_with).findIndex(
                    (shared: any) => (shared.userId).toString() === (user.userId).toString()) === -1);
                await this.removeAlbumFromUsers(userToRemove, weddingAlbumId)
            }

            if (payload.user_to_add) {

                let usersToConcat;
                const userToAdd: any = payload.user_to_add || [];
                for (let payloadUser of userToAdd) {
                    const findIndex = (weddingAlbum.shared_with).findIndex((user) => (user.userId).toString() === (payloadUser.userId).toString());
                    if (findIndex === -1) {
                        (weddingAlbum.shared_with).push(payloadUser);
                    } else {
                        weddingAlbum.shared_with[findIndex] = payloadUser;
                    }
                }
                await this.addUserToAlbum(payload.user_to_add, weddingId, weddingAlbumId)
            }

            const saveWeddingAlbum = await weddingAlbum.save();
            return successResponse(200, 'Wedding album update', saveWeddingAlbum);
        } else {
            return errorResponse(404, 'No wedding album  found.');
        }
    }


    getWeddingAlbums = async (weddingId: String, userId: String) => {

        let weddingAlbum;
        if (weddingId != "null") {
            weddingAlbum = await this.weddingAlbumModel.find({weddingId});
        }
        const user = await this.userModel.findById(userId).populate('shared_albums.albumId', '_id album title').lean();
        let sharedAlbums = [];
        if (user && user.shared_albums) {
            for (let i = 0; i < (user.shared_albums).length; i++) {
                if(!checkIfString(user.shared_albums)){
                    const sharedAlbum=(user.shared_albums);
                    const wedding = await this.weddingModel.findById(user.shared_albums[i].weddingId).lean();
                    sharedAlbums.push({wedding, details: user.shared_albums[i]});
                }
            }
            return successResponse(200, 'Wedding albums', {weddingAlbum, sharedAlbums});
        } else {
            return successResponse(200, 'Wedding albums', {weddingAlbum, sharedAlbums});
        }
    }


    removeOrderOfProceedingFromUsers = async (userToRemove: any, weddingId: String, orderOfProceedingId: String) => {
        for (let i = 0; i < userToRemove.length; i++) {
            const user = await this.userModel.findById(userToRemove[i].userId);
            if (user && user.shared_order_of_proceedings) {
                user.shared_order_of_proceedings = (user.shared_order_of_proceedings)
                    .filter((orderOfProceeding: any) => (orderOfProceeding.orderOfProceedingId).toString() !== orderOfProceedingId);
                await user.save();
            }
        }
        return;
    }


    addUserToOrderOfProceeding = async (userToAdd: any, weddingId: String, orderOfProceedingId: String) => {


        for (let i = 0; i < userToAdd.length; i++) {
            const user = await this.userModel.findById(userToAdd[i].userId);
            if (user) {
                if (user.shared_order_of_proceedings) {

                    const index = (user.shared_order_of_proceedings).findIndex((shared) => shared.orderOfProceedingId  && (shared.orderOfProceedingId).toString() === orderOfProceedingId.toString())
                    if (index === -1) {
                        (user.shared_order_of_proceedings).push({orderOfProceedingId, weddingId, can_edit: userToAdd[i].can_edit});
                    }
                    else {
                        user.shared_order_of_proceedings[index] = {orderOfProceedingId, weddingId, can_edit: userToAdd[i].can_edit};
                    }
                } else {
                    user.shared_order_of_proceedings = [{orderOfProceedingId, weddingId, can_edit: userToAdd[i].can_edit}];
                }
                await user.save();
            }
        }


        return;
    }


    createOrderOfProceeding = async (weddingId: String, payload: CreateOrderOfProceedingDto) => {
        payload.weddingId = weddingId;
        const orderOfProceeding = new this.orderOfProceedingModel(payload);
        const saveOrderOfProceeding = await orderOfProceeding.save();
        return successResponse(200, 'Order of proceeding Created', saveOrderOfProceeding,);
    }


    addOrderOfProceedingEvent = async (weddingId: String, orderOfProceedingId: String, payload: AddUpdateOrderOfProceedingEventDto) => {
        const orderOfProceeding: any = await this.orderOfProceedingModel.findById(orderOfProceedingId);
        if (orderOfProceeding) {
            (orderOfProceeding.event).push(payload.event);
            const saveOrderOfProceeding = await orderOfProceeding.save();
            return successResponse(200, 'Order of proceeding updated', saveOrderOfProceeding);
        } else {
            return errorResponse(404, 'No Order of proceeding  found.');
        }
    }


    updateOrderOfProceedingEvent = async (weddingId: String, orderOfProceedingId: String, eventId: String, payload: AddUpdateOrderOfProceedingEventDto) => {
        const orderOfProceeding: any = await this.orderOfProceedingModel.findById(orderOfProceedingId);
        if (orderOfProceeding) {
            const orderOfProceedingIndex = (orderOfProceeding.event).findIndex((event: any) => (event._id).toString() === eventId);
            if (orderOfProceedingIndex !== -1) {
                (orderOfProceeding.event)[orderOfProceedingIndex] = payload.event;
                const savePlaylist = await orderOfProceeding.save();
                return successResponse(200, 'Order of proceeding updated', savePlaylist);
            } else {
                return errorResponse(404, 'No event  found.');
            }
        } else {
            return errorResponse(404, 'No Order of proceeding  found.');
        }
    }


    shareOrderOfProceeding = async (weddingId: String, orderOfProceedingId: String, payload: ShareOrderOfProceedingDto) => {
        const orderOfProceeding: any = await this.orderOfProceedingModel.findById(orderOfProceedingId);
        if (orderOfProceeding) {
            if (payload.user_to_remove) {
                let userToRemove: any = payload.user_to_remove;
                orderOfProceeding.shared_with = userToRemove.filter((user) => (
                    orderOfProceeding.shared_with).findIndex(
                    (shared: any) => (shared.userId).toString() === (user.userId).toString()) === -1);
                await this.removeOrderOfProceedingFromUsers(userToRemove, weddingId, orderOfProceedingId)
            }

            if (payload.user_to_add) {

                let usersToConcat;
                const userToAdd: any = payload.user_to_add || [];
                for (let payloadUser of userToAdd) {
                    const findIndex = (orderOfProceeding.shared_with).findIndex((user) => (user.userId).toString() === (payloadUser.userId).toString());
                    if (findIndex === -1) {
                        (orderOfProceeding.shared_with).push(payloadUser);
                    } else {
                        orderOfProceeding.shared_with[findIndex] = payloadUser;
                    }
                }
                await this.addUserToOrderOfProceeding(payload.user_to_add, weddingId, orderOfProceedingId)
            }



            const saveOrderOfProceeding = await orderOfProceeding.save();
            return successResponse(200, 'Order of proceeding update', saveOrderOfProceeding);
        } else {
            return errorResponse(404, 'Order of proceeding not  found.');
        }
    }


    getOrderOfProceeding = async (weddingId: String, userId: String) => {

        let orderOfProceeding;
        if (weddingId != "null") {
            orderOfProceeding = await this.orderOfProceedingModel.find({weddingId});
        }

        const user = await this.userModel.findById(userId).populate('shared_order_of_proceedings.orderOfProceedingId', '_id event').lean();
        let sharedOrderOfProceeding = [];
        if (user && user.shared_order_of_proceedings) {
            for (let i = 0; i < (user.shared_order_of_proceedings).length; i++) {
                const wedding = await this.weddingModel.findById((user.shared_order_of_proceedings[i]).weddingId).lean();
                sharedOrderOfProceeding.push({details: user.shared_order_of_proceedings[i], wedding});
            }
            return successResponse(200, 'Order of proceeding', {orderOfProceeding, sharedOrderOfProceeding});
        } else {
            return successResponse(200, 'Order of proceeding', {orderOfProceeding, sharedOrderOfProceeding});
        }

    }

    getOrderOfProceedingById = async (weddingId: String, orderOfProceedingId: String) => {
        const orderOfProceeding = await this.orderOfProceedingModel.findById(orderOfProceedingId);
        return successResponse(200, 'order of proceeding', orderOfProceeding);
    }


    removePlaylistFromUsers = async (userToRemove: any, weddingId: String, playlistId: String) => {
        for (let i = 0; i < userToRemove.length; i++) {
            const user = await this.userModel.findById(userToRemove[i].userId);
            if (user && user.shared_playlist) {
                user.shared_playlist = (user.shared_playlist)
                    .filter((playlist: any) => playlist.playlistId.toString() !== playlistId);
                await user.save();
            }
        }
        return;
    }


    addUserToPlaylist = async (userToAdd: any, weddingId: String, playlistId: String) => {
        for (let i = 0; i < userToAdd.length; i++) {
            const user = await this.userModel.findById(userToAdd[i].userId);
            if (user) {
                if (user.shared_playlist) {
                    const index = (user.shared_playlist).findIndex((shared) => (shared.weddingId).toString() === weddingId.toString())
                    if (index === -1) {
                        (user.shared_playlist).push({playlistId, weddingId, can_edit: userToAdd[i].can_edit});
                    }
                    else {
                        user.shared_playlist[index] = {playlistId, weddingId, can_edit: userToAdd[i].can_edit};
                    }
                } else {
                    user.shared_playlist = [{playlistId, weddingId, can_edit: userToAdd[i].can_edit}];
                }
                await user.save();
            }
        }
        return;
    }


    createPlaylist = async (weddingId: String, payload: CreatePlaylistDto) => {
        payload.weddingId = weddingId;
        const playlist = new this.playlistModel(payload);
        const savePlaylist = await playlist.save();
        return successResponse(200, 'playlist Created', savePlaylist);
    }


    addPlaylistEvent = async (weddingId: String, playlistId: String, payload: AddUpdateEventDto) => {
        const playlist: any = await this.playlistModel.findById(playlistId);
        if (playlist) {
            (playlist.event).push(payload.event);
            const savePlaylist = await playlist.save();
            return successResponse(200, 'playlist updated', savePlaylist);
        } else {
            return errorResponse(404, 'No playlist  found.');
        }
    }


    updatePlaylistEvent = async (weddingId: String, playlistId: String, eventId: String, payload: AddUpdateEventDto) => {
        const playlist: any = await this.playlistModel.findById(playlistId);
        if (playlist) {
            const eventIndex = (playlist.event).findIndex((event: any) => (event._id).toString() === eventId);
            if (eventIndex !== -1) {
                (playlist.event)[eventIndex] = payload.event;
                const savePlaylist = await playlist.save();
                return successResponse(200, 'playlist updated', {event: savePlaylist.event[eventIndex]});
            } else {
                return errorResponse(404, 'No event  found.');
            }
        } else {
            return errorResponse(404, 'No playlist  found.');
        }
    }


    sharePlaylist = async (weddingId: String, playlistId: String, payload: SharePlaylistDto) => {
        const playlist: any = await this.playlistModel.findById(playlistId);
        if (playlist) {
            if (payload.user_to_remove) {
                let userToRemove: any = payload.user_to_remove;
                playlist.shared_with = userToRemove.filter((user) => (
                    playlist.shared_with).findIndex(
                    (shared: any) => (shared.userId).toString() === (user.userId).toString()) === -1);
                await this.removePlaylistFromUsers(userToRemove, weddingId, playlistId)
            }

            if (payload.user_to_add) {

                let usersToConcat;
                const userToAdd: any = payload.user_to_add || [];
                for (let payloadUser of userToAdd) {
                    const findIndex = (playlist.shared_with).findIndex((user) => (user.userId).toString() === (payloadUser.userId).toString());
                    if (findIndex === -1) {
                        (playlist.shared_with).push(payloadUser);
                    } else {
                        playlist.shared_with[findIndex] = payloadUser;
                    }
                }
                await this.addUserToPlaylist(payload.user_to_add, weddingId, playlistId)
            }
            const saveOrderOfProceeding = await playlist.save();
            return successResponse(200, 'playlist updated', saveOrderOfProceeding);
        } else {
            return errorResponse(404, 'playlist not  found.');
        }
    }


    getPlaylist = async (weddingId: String, userId: String) => {
        let playlist;
        if (weddingId != "null") {
            playlist = await this.playlistModel.find({weddingId});
        }
        const user = await this.userModel.findById(userId).lean();
        let sharedPlaylist = [];
        if (user && user.shared_playlist) {
            for (let i = 0; i < (user.shared_playlist).length; i++) {
                const wedding = await this.weddingModel.findById((user.shared_playlist[i]).weddingId).lean();
                sharedPlaylist.push({wedding, details: user.shared_playlist[i]});
            }
            return successResponse(200, 'playlist', {playlist, sharedPlaylist});
        } else {
            return successResponse(200, 'playlist', {playlist, sharedPlaylist});
        }
    }


    getPlaylistById = async (weddingId: String, playlistId: String) => {
        const playlist = await this.playlistModel.findById(playlistId);
        return successResponse(200, 'playlist', playlist);
    }


    removePlaylist = async (playlistId, eventId) => {
        let playlist = await this.playlistModel.findById(playlistId);
        if (playlist) {
            playlist.event = (playlist.event).filter((event: any) => (event._id).toString() !== eventId)
            const savePlaylist = await playlist.save();
            return successResponse(200, 'playlist removed', savePlaylist);
        } else {
            return errorResponse(404, 'playlist not found.');
        }
    }


    removeSongFromPlaylist = async (playlistId, eventId, songId) => {
        let playlist = await this.playlistModel.findById(playlistId);
        if (playlist) {
            const eventIndex = (playlist.event).findIndex((event: any) => (event._id).toString() === eventId)
            if (eventIndex !== -1) {
                const selectedEvent = (playlist.event)[eventIndex];
                const filteredSongList = (selectedEvent.songs).filter((song: any) => (song._id).toString() !== songId);
                ((playlist.event)[eventIndex]).songs = filteredSongList;
                const savePlaylist = await playlist.save();
                return successResponse(200, 'song removed', savePlaylist);
            } else {
                return errorResponse(404, 'event not found');
            }
        } else {
            return errorResponse(404, 'playlist not found.');
        }
    }


    createWeddingVow = async (weddingId: string, payload: CreateVowDto) => {
        payload.weddingId = weddingId;
        const vow: any = new this.vowModel(payload);
        const saveVow = await vow.save();
        return successResponse(200, 'vow created', saveVow);
    };


    addWeddingVow = async (weddingId: string, vowId: string, payload: UpdateVowDto) => {
        const vow: any = await this.vowModel.findById(vowId);

        if (vow) {
            if (vow.detail) {
                if (payload.detail.default) {
                    const updatedWeddingVow = (vow.detail).map((t) => {
                        t.default = false;
                        return t;
                    });
                    (updatedWeddingVow).push(payload.detail)
                    vow.detail = updatedWeddingVow;
                } else {
                    (vow.detail).push(payload.detail)
                }
            } else {
                vow.detail = [payload.detail];
            }
            await vow.save();
            return successResponse(200, 'new vow added', vow);
        } else {
            return errorResponse(404, 'vow not found');
        }
    };


    updateVow = async (weddingId: string, vowId: string, vowSubId: string, payload: UpdateVowDto) => {
        const vow: any = await this.vowModel.findById(vowId);

        if (vow) {
            let index = (vow.detail).findIndex((r) => (r._id).toString() === vowSubId);

            if (index !== -1) {
                if (payload.detail.default) {
                    const updateVow = (vow.detail).map((t) => {
                        t.default = false;
                        return t;
                    });
                    updateVow[index] = payload.detail;
                    vow.detail = updateVow;
                } else {
                    (vow.detail)[index] = payload.detail;
                }
                await vow.save();
                return successResponse(200, 'vow updated', vow);
            } else {
                return errorResponse(404, 'vow not found');
            }
        } else {
            return errorResponse(404, 'vow not found');
        }
    };

    updateVowToDefault = async (weddingId: string, vowId: string, vowSubId: string) => {
        const vow: any = await this.vowModel.findById(vowId);

        if (vow) {
            let index = (vow.detail).findIndex((r) => (r._id).toString() === vowSubId);

            if (index !== -1) {
                const updateVow = (vow.detail).map((t) => {
                    t.default = false;
                    return t;
                });
                updateVow[index].default = true;
                vow.detail = updateVow;
                await vow.save();
                return successResponse(200, 'vow updated', vow);
            } else {
                return errorResponse(404, 'vow not found');
            }
        } else {
            return errorResponse(404, 'vow not found');
        }
    };

    removeVows = async (weddingId: string, vowId: string, vowSubId: string) => {
        const vow: any = await this.vowModel.findById(vowId);

        if (vow) {
            let index = (vow.detail).findIndex((r) => (r._id).toString() !== vowSubId);

            if (index !== -1) {
                let filteredRecipient = (vow.detail).filter((t) => (t._id).toString() !== vowSubId);
                vow.detail = filteredRecipient;
                await vow.save();
                return successResponse(200, 'vow removed', vow);
            } else {
                return errorResponse(404, 'vow not found');
            }
        } else {
            return errorResponse(404, 'vow not found');
        }
    };


    getVows = async (weddingId: string) => {
        const vow: any = await this.vowModel.find({weddingId});

        if (vow) {
            return successResponse(200, 'vows', vow);
        } else {
            return errorResponse(404, 'vow not found');
        }
    };


    getMetricsBudget = (budget, total) => {
        const allocatedBudgetSpent = budget.filter((item) => item.confirmed).reduce((result, item) => result + item.amount, 0);
        const unallocatedBudgetEstimates = budget.filter((item) => !item.confirmed).reduce((result, item) => result + item.amount, 0);
        const unspentBudgetRemaining = total - allocatedBudgetSpent;
        const weddingBudgetSurplus = (total) - (allocatedBudgetSpent + unallocatedBudgetEstimates);
        return {allocatedBudgetSpent, unallocatedBudgetEstimates, unspentBudgetRemaining, weddingBudgetSurplus}
    }


    createBudget = async (weddingId: string, payload: CreateBudgetDto) => {
        payload.weddingId = weddingId;
        const budgetPlanner: any = new this.budgetPlannerModel(payload);
        const saveBudgetPlanner = await budgetPlanner.save();
        return successResponse(200, 'budget planner created', saveBudgetPlanner);
    };


    addBudget = async (weddingId: String, budgetPlannerId: String, payload: AddUpdateBudgetDto) => {
        const budgetPlanner: any = await this.budgetPlannerModel.findById(budgetPlannerId);
        if (budgetPlanner) {
            (budgetPlanner.budget).push(payload.budget);
            const saveBudgetPlanner = await budgetPlanner.save();
            return successResponse(200, 'budget planner updated', saveBudgetPlanner);
        } else {
            return errorResponse(404, 'No budget planner  found.');
        }
    }


    updateBudgetTotalAmount = async (weddingId: String, budgetPlannerId: String, payload: UpdateBudgetTotalDto) => {
        const budgetPlanner: any = await this.budgetPlannerModel.findById(budgetPlannerId);
        if (budgetPlanner) {
            budgetPlanner.total = payload.total;
            const saveBudgetPlanner = await budgetPlanner.save();
            return successResponse(200, 'budget planner updated', saveBudgetPlanner);
        } else {
            return errorResponse(404, 'No budget planner  found.');
        }
    }


    updateBudget = async (weddingId: String, budgetPlannerId: String, budgetId: String, payload: AddUpdateBudgetDto) => {
        const budgetPlanner: any = await this.budgetPlannerModel.findById(budgetPlannerId);
        if (budgetPlanner) {
            const selectedBudgetPlannerIndex = (budgetPlanner.budget)
                .findIndex((budget: any) => (budget._id).toString() === budgetId);
            if (selectedBudgetPlannerIndex !== -1) {
                (budgetPlanner.budget)[selectedBudgetPlannerIndex] = payload.budget;
                const saveBudgetPlanner = await budgetPlanner.save();
                return successResponse(200, 'budget planner updated', saveBudgetPlanner);
            } else {
                return errorResponse(404, 'budget planner  found.');
            }
        } else {
            return errorResponse(404, 'budget planner  found.');
        }
    }


    removeBudgetPlanner = async (budgetPlannerId, budgetId) => {
        let budgetPlanner = await this.budgetPlannerModel.findById(budgetPlannerId);
        if (budgetPlanner) {
            budgetPlanner.budget = (budgetPlanner.budget).filter((budget: any) => (budget._id).toString() !== budgetId)
            const saveBudgetPlanner = await budgetPlanner.save();
            return successResponse(200, 'budget planner removed', saveBudgetPlanner);
        } else {
            return errorResponse(404, 'budget planner not found.');
        }
    }


    getWeddingBudgetPlanner = async (weddingId: String) => {
        const budgetPlanner = await this.budgetPlannerModel.find({weddingId}).lean();
        let budgetDetails = [];
        for (let b of budgetPlanner) {
            const metrics = this.getMetricsBudget(b.budget, b.total);
            budgetDetails.push({...b, ...metrics});
        }

        return successResponse(200, 'budget planner', budgetDetails);
    }

    getBudgetPlanner = async (weddingId: String, budgetPlannerId: String) => {
        const budgetPlanner = await this.budgetPlannerModel.findById(budgetPlannerId);
        const metric = this.getMetricsBudget(budgetPlanner.budget, budgetPlanner.total);
        return successResponse(200, 'budget planner', {...budgetPlanner, ...metric});
    }


    updateWeddingAnniversary = async (weddingId: String, payload: WeddingAnniversaryDto) => {
        const wedding: any = await this.weddingModel.findById(weddingId);
        if (wedding) {
            (wedding.anniversary_reminder) = (payload.wedding_anniversary);
            const saveWedding = await wedding.save();
            return successResponse(200, 'wedding updated', saveWedding);
        } else {
            return errorResponse(404, 'No wedding  found.');
        }
    }


    sendAnnouncement = async (announcementId: String, payload: SendAnnouncementDto) => {
        const announcement = await this.weddingAnnouncementModel.findById(announcementId);
        if (announcement) {
            if (announcement.recipient) {
                const templates = announcement.template;
                const recipients = announcement.recipient;
                const selectedTemplate = templates.filter((templte: any) => templte.default);
                if (selectedTemplate && selectedTemplate.length > 0) {
                    const templateDescription = (selectedTemplate[0]).description;
                    for (let i = 0; i < recipients.length; i++) {
                        try {
                            const recipient = recipients[i];
                            const description = formattedDescription(templateDescription, recipient.first_name,
                                recipient.last_name, payload.engagement_date, payload.wedding_date);
                            const msg = {
                                To: recipient.email,
                                from: 'hello@PupEEE.com',
                                subject: "Wedding announcement",
                                text: description,
                            };
                            await SgMail.send(msg);
                        } catch (e) {
                        }
                    }
                    return successResponse(200, 'wedding announcement sent', {});
                } else {
                    return errorResponse(404, 'No default template found.Please select template.');
                }
            }
        } else {
            return errorResponse(404, 'Wedding announcement not found');
        }
    }

}
