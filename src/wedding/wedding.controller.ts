import {Body, Controller, Delete, Get, Param, Post, Put} from '@nestjs/common';
import {
    CreateWeddingDto, SendAnnouncementDto, UpdateCheckListDto, UpdateChecklistStatusDto,
    UpdateRecipientDto, UpdateWeddingDto, UpdateWeddingVowsDto,
} from "./dtos/wedding.dto";
import {WeddingService} from "./wedding.service";
import {
    AddWeddingAnnouncementDto,
    AddWeddingTemplateDto,
    UpdateWeddingAnnouncementDto, UpdateWeddingTemplateDto
} from "./dtos/wedding-announcement.dto";
import {AddWeddingReceptionDto, UpdateWeddingServicesUpdate} from "./dtos/wedding-services.dto";
import {AddWeddingRegistry, UpdateWeddingRegistry} from "./dtos/wedding-registry.dto";
import {CreateWeddingAlbumDto, ShareAlbumDto, UpdateWeddingAlbumDto} from "./dtos/wedding-album.dto";
import {
    AddUpdateOrderOfProceedingEventDto,
    CreateOrderOfProceedingDto,
    ShareOrderOfProceedingDto
} from "./dtos/order-of-proceeding.dto";
import {CreatePlaylistDto, SharePlaylistDto, AddUpdateEventDto} from "./dtos/playlist.dto";
import {CreateVowDto, UpdateVowDto} from "./dtos/vow.dto";
import {AddUpdateBudgetDto, CreateBudgetDto, UpdateBudgetTotalDto} from "./dtos/budget-planner.dto";
import {WeddingAnniversaryDto} from "./dtos/wedding-anniversary.dto";

@Controller('wedding')
export class WeddingController {
    constructor(private weddingService: WeddingService) {
    }

    @Get('/guests')
    async getWeddingGuests() {
        const guests = await this.weddingService.getWeddingGuests();
        return guests;
    }

    @Get('/budget')
    async getWeddingBudget() {
        const budget = await this.weddingService.getWeddingBudget();
        return budget;
    }

    @Get('/services')
    async getWeddingServices() {
        const weddingServices = await this.weddingService.getWeddingServices();
        return weddingServices;
    }

    @Delete('/:id')
    async deleteWedding(@Param('id') id) {
        const group = await this.weddingService.deleteWeddingById(id);
        return group;
    }


    @Post('/')
    async create(@Body() body: CreateWeddingDto) {
        const wedding = await this.weddingService.createWedding(body);
        return wedding;
    }


    @Put('/:id')
    async update(@Param('id') id,@Body() body: UpdateWeddingDto) {
        const wedding = await this.weddingService.updateWedding(id,body);
        return wedding;
    }

    @Put('/:id/recipient')
    async updateRecipient(@Param('id') id, @Body() body: UpdateRecipientDto) {
        const group = await this.weddingService.addRecipient(id, body);
        return group;
    }

    @Delete('/:id/recipient/:recipient_id')
    async deleteRecipient(@Param('id') id, @Param('recipient_id') recipient_id) {
        const group = await this.weddingService.removeRecipient(id, recipient_id);
        return group;
    }


    @Put('/:id/checklist')
    async addCheckList(@Param('id') id, @Body() body: UpdateCheckListDto) {
        const group = await this.weddingService.addCheckList(id, body);
        return group;
    }


    @Put('/:id/checklist/:checklistId')
    async updateCheckListStatus(@Param('id') id, @Param('checklistId') checklistId, @Body() body: UpdateChecklistStatusDto) {
        const group = await this.weddingService.updateCheckList(id, checklistId, body);
        return group;
    }

    @Delete('/:id/checklist/:checklistId')
    async deleteCheckList(@Param('id') id, @Param('checklistId') checklistId) {
        const group = await this.weddingService.removeChecklist(id, checklistId);
        return group;
    }

    @Get('/:id')
    async get(@Param('id') id) {
        const group = await this.weddingService.getWeddingById(id);
        return group;
    }

    @Get('/:id/user')
    async getUserWeddings(@Param('id') id) {
        const group = await this.weddingService.getWeddingByUserId(id);
        return group;
    }


    @Put('/:id/announcement')
    async addAnnouncement(@Param('id') id, @Body() body: AddWeddingAnnouncementDto) {
        const weddingAnnouncement = await this.weddingService.addWeddingAnnouncement(id, body);
        return weddingAnnouncement;
    }

    @Put('/announcement/:id')
    async updateAnnouncement(@Param('id') id, @Body() body: UpdateWeddingAnnouncementDto) {
        const weddingAnnouncement = await this.weddingService.updateWeddingAnnouncement(id, body);
        return weddingAnnouncement;
    }


    @Get('/:id/announcement/:type')
    async getWeddingAnnouncement(@Param('id') id, @Param('type') type) {
        const weddingAnnouncement = await this.weddingService.getWeddingAnnouncements(id, type);
        return weddingAnnouncement;
    }

    @Put('/announcement/:id/recipient')
    async addAnnouncementRecipient(@Param('id') id, @Body() body: UpdateRecipientDto) {
        const group = await this.weddingService.addAnnouncementRecipient(id, body);
        return group;
    }



    @Put('/announcement/:id/recipient/:recipient_id')
    async updateAnnouncementRecipient(@Param('id') id, @Param('recipient_id') recipient_id,
                                      @Body() body: UpdateRecipientDto) {
        const group = await this.weddingService.updateAnnouncementRecipient(id, recipient_id,body);
        return group;
    }

    @Delete('/announcement/:id/recipient/:recipient_id')
    async deleteAnnouncementRecipient(@Param('id') id, @Param('recipient_id') recipient_id) {
        const group = await this.weddingService.removeAnnouncementRecipient(id, recipient_id);
        return group;
    }


    @Put('/announcement/:id/template')
    async addWeddingTemplate(@Param('id') id, @Body() body: AddWeddingTemplateDto) {
        const wedding = await this.weddingService.addWeddingTemplate(id, body);
        return wedding;
    }


    @Put('/announcement/:id/template/:templateId')
    async updateWeddingTemplate(@Param('id') id, @Param('templateId') templateId, @Body() body: UpdateWeddingTemplateDto) {
        const wedding = await this.weddingService.updateWeddingTemplate(id, templateId, body);
        return wedding;
    }

    @Put('/announcement/:id/template/:templateId/default')
    async updateWeddingTemplateToDefault(@Param('id') id, @Param('templateId') templateId) {
        const wedding = await this.weddingService.updateWeddingTemplateToDefault(id, templateId);
        return wedding;
    }

    getWeddingAnnouncements


    @Delete('/announcement/:id/template/:templateId')
    async removeWeddingTemplate(@Param('id') id, @Param('templateId') templateId) {
        const wedding = await this.weddingService.removeWeddingTemplate(id, templateId);
        return wedding;
    }


    @Put('/:id/vows')
    async updateWeddingVows(@Param('id') id, @Body() body: UpdateWeddingVowsDto) {
        const group = await this.weddingService.updateWeddingVows(id, body);
        return group;
    }


    @Put('/:id/service')
    async addService(@Param('id') id, @Body() body: AddWeddingReceptionDto) {
        const weddingService = await this.weddingService.addWeddingService(id, body);
        return weddingService;
    }

    @Put('/service/:id')
    async updateService(@Param('id') id, @Body() body: UpdateWeddingServicesUpdate) {
        const weddingService = await this.weddingService.updateWeddingService(id, body);
        return weddingService;
    }


    @Get('/:id/service')
    async getWeddingService(@Param('id') id) {
        const weddingService = await this.weddingService.getWeddingService(id);
        return weddingService;
    }


    @Put('/:id/registry')
    async addRegistry(@Param('id') id, @Body() body: AddWeddingRegistry) {
        const weddingRegistry = await this.weddingService.addWeddingRegistry(id, body);
        return weddingRegistry;
    }

    @Put('/registry/:id')
    async updateRegistry(@Param('id') id, @Body() body: UpdateWeddingRegistry) {
        const weddingRegistry = await this.weddingService.updateWeddingRegistry(id, body);
        return weddingRegistry;
    }


    @Get('/:id/registry')
    async getRegistry(@Param('id') id) {
        const weddingRegistry = await this.weddingService.getWeddingRegistry(id);
        return weddingRegistry;
    }

    @Delete('/registry/:id')
    async deleteRegistry(@Param('id') id) {
        const weddingRegistry = await this.weddingService.removeWeddingRegistry(id);
        return weddingRegistry;
    }


    @Post('/:id/album')
    async createWeddingAlbum(@Param('id') id, @Body() body: CreateWeddingAlbumDto) {
        const weddingAlbum = await this.weddingService.createWeddingAlbum(id, body);
        return weddingAlbum;
    }


    @Delete('/album/:albumId')
    async deleteWeddingAlbum(@Param('albumId') id) {
        const weddingAlbum = await this.weddingService.deleteWeddingAlbum(id);
        return weddingAlbum;
    }

    @Put('/:id/album/:albumId')
    async updateWeddingAlbum(@Param('id') weddingId, @Param('albumId') albumId, @Body() body: UpdateWeddingAlbumDto) {
        const weddingAlbum = await this.weddingService.updateWeddingAlbum(weddingId, albumId, body);
        return weddingAlbum;
    }


    @Put('/:id/album/:albumId/share')
    async shareWeddingAlbum(@Param('id') weddingId, @Param('albumId') albumId, @Body() body: ShareAlbumDto) {
        const weddingAlbum = await this.weddingService.shareAlbum(weddingId, albumId, body);
        return weddingAlbum;
    }


    @Get('/:id/album/user/:userId')
    async getWeddingAlbum(@Param('id') weddingId, @Param('userId') userId) {
        const weddingAlbum = await this.weddingService.getWeddingAlbums(weddingId, userId);
        return weddingAlbum;
    }


    @Post('/:id/orderOfProceeding')
    async createOrderOfProceeding(@Param('id') id, @Body() body: CreateOrderOfProceedingDto) {
        const orderOfProceeding = await this.weddingService.createOrderOfProceeding(id, body);
        return orderOfProceeding;
    }

    @Post('/:id/orderOfProceeding/:orderOfProceedingId')
    async addOrderOfProceedingEvent(@Param('id') weddingId, @Param('orderOfProceedingId') orderOfProceedingId, @Body() body: AddUpdateOrderOfProceedingEventDto) {
        const orderOfProceeding = await this.weddingService.addOrderOfProceedingEvent(weddingId, orderOfProceedingId, body);
        return orderOfProceeding;
    }

    @Put('/:id/orderOfProceeding/:orderOfProceedingId/event/:eventId')
    async updateOrderOfProceedingEvent(@Param('id') weddingId, @Param('orderOfProceedingId') orderOfProceedingId
        , @Param('eventId') eventId, @Body() body: AddUpdateOrderOfProceedingEventDto) {
        const orderOfProceeding = await this.weddingService.updateOrderOfProceedingEvent(weddingId, orderOfProceedingId, eventId, body);
        return orderOfProceeding;
    }


    @Put('/:id/orderOfProceeding/:orderOfProceedingId/share')
    async shareOrderOfProceeding(@Param('id') weddingId, @Param('orderOfProceedingId') orderOfProceedingId, @Body() body: ShareOrderOfProceedingDto) {
        const orderOfProceeding = await this.weddingService.shareOrderOfProceeding(weddingId, orderOfProceedingId, body);
        return orderOfProceeding;
    }


    @Get('/:id/orderOfProceeding/user/:userId')
    async getOrderOfProceeding(@Param('id') weddingId, @Param('userId') userId) {
        const orderOfProceeding = await this.weddingService.getOrderOfProceeding(weddingId, userId);
        return orderOfProceeding;
    }


    @Get('/:id/orderOfProceeding/:orderOfProceedingId')
    async getOrderOfProceedingById(@Param('id') weddingId, @Param('orderOfProceedingId') orderOfProceedingId) {
        const orderOfProceeding = await this.weddingService.getOrderOfProceedingById(weddingId, orderOfProceedingId);
        return orderOfProceeding;
    }

    @Post('/:id/playlist')
    async createPlaylist(@Param('id') id, @Body() body: CreatePlaylistDto) {
        const playlist = await this.weddingService.createPlaylist(id, body);
        return playlist;
    }

    @Post('/:id/playlist/:playlistId')
    async addEventToPlayList(@Param('id') weddingId, @Param('playlistId') playlistId, @Body() body: AddUpdateEventDto) {
        const playlist = await this.weddingService.addPlaylistEvent(weddingId, playlistId, body);
        return playlist;
    }


    @Put('/:id/playlist/:playlistId/event/:eventId')
    async updateEventPlaylist(@Param('id') weddingId, @Param('playlistId') playlistId, @Param('eventId') eventId, @Body() body: AddUpdateEventDto) {
        const playlist = await this.weddingService.updatePlaylistEvent(weddingId, playlistId, eventId, body);
        return playlist;
    }


    @Put('/:id/playlist/:playlistId/share')
    async sharePlaylist(@Param('id') weddingId, @Param('playlistId') orderOfProceedingId, @Body() body: SharePlaylistDto) {
        const playlist = await this.weddingService.sharePlaylist(weddingId, orderOfProceedingId, body);
        return playlist;
    }


    @Get('/:id/playlist/user/:userId')
    async getPlaylist(@Param('id') weddingId, @Param('userId') userId) {
        const playlist = await this.weddingService.getPlaylist(weddingId, userId);
        return playlist;
    }


    @Get('/:id/playlist/:playlistId')
    async getPlaylistById(@Param('id') weddingId, @Param('playlistId') playlistId) {
        const playlist = await this.weddingService.getPlaylistById(weddingId, playlistId);
        return playlist;
    }


    @Delete('/playlist/:id/event/:eventId')
    async deletePlaylist(@Param('id') playlistId, @Param('eventId') eventId) {
        const playlist = await this.weddingService.removePlaylist(playlistId, eventId);
        return playlist;
    }


    @Delete('/playlist/:id/event/:eventId/song/:songId')
    async deletePlaylistSong(@Param('id') playlistId, @Param('eventId') eventId, @Param('songId') songId) {
        const playlist = await this.weddingService.removeSongFromPlaylist(playlistId, eventId, songId);
        return playlist;
    }


    @Post('/:id/vow')
    async createVow(@Param('id') id, @Body() body: CreateVowDto) {
        const vow = await this.weddingService.createWeddingVow(id, body);
        return vow;
    }


    @Post('/:id/vow/:vowId')
    async addNewVow(@Param('id') weddingId, @Param('vowId') vowId, @Body() body: UpdateVowDto) {
        const vow = await this.weddingService.addWeddingVow(weddingId, vowId, body);
        return vow;
    }


    @Put('/:id/vow/:vowId/item/:itemId')
    async updateWeddingVow(@Param('id') weddingId, @Param('vowId') vowId, @Param('itemId') subId, @Body() body: UpdateVowDto) {
        const vow = await this.weddingService.updateVow(weddingId, vowId, subId, body);
        return vow;
    }


    @Put('/:id/vow/:vowId/item/:itemId/default')
    async updateVowToDefault(@Param('id') weddingId, @Param('vowId') vowId, @Param('itemId') subId) {
        const vow = await this.weddingService.updateVowToDefault(weddingId, vowId, subId);
        return vow;
    }


    @Delete('/:id/vow/:vowId/item/:itemId')
    async removeVows(@Param('id') weddingId, @Param('vowId') vowId, @Param('itemId') subId) {
        const vow = await this.weddingService.removeVows(weddingId, vowId, subId);
        return vow;
    }


    @Get('/:id/vow')
    async getVows(@Param('id') weddingId) {
        const vow = await this.weddingService.getVows(weddingId);
        return vow;
    }


    @Post('/:id/budgetPlanner')
    async createBudgetPlanner(@Param('id') id, @Body() body: CreateBudgetDto) {
        const budget = await this.weddingService.createBudget(id, body);
        return budget;
    }

    @Post('/:id/budgetPlanner/:budgetPlannerId')
    async addBudgetToBudgetPlanner(@Param('id') weddingId, @Param('budgetPlannerId') budgetPlannerId, @Body() body: AddUpdateBudgetDto) {
        const playlist = await this.weddingService.addBudget(weddingId, budgetPlannerId, body);
        return playlist;
    }


    @Put('/:id/budgetPlanner/:budgetPlannerId/total')
    async updateBudgetTotalAmount(@Param('id') weddingId, @Param('budgetPlannerId') budgetPlannerId
        , @Body() body: UpdateBudgetTotalDto) {
        const budget = await this.weddingService.updateBudgetTotalAmount(weddingId, budgetPlannerId, body);
        return budget;
    }

    @Put('/:id/budgetPlanner/:budgetPlannerId/budget/:budgetId')
    async updateBudgetBudgetPlanner(@Param('id') weddingId, @Param('budgetPlannerId') budgetPlannerId,
                                    @Param('budgetId') budgetId, @Body() body: AddUpdateBudgetDto) {
        const budget = await this.weddingService.updateBudget(weddingId, budgetPlannerId, budgetId, body);
        return budget;
    }

    @Delete('/budgetPlanner/:id/budget/:budgetId')
    async deleteBudget(@Param('id') budgetPlannerId, @Param('budgetId') budgetId) {
        const budget = await this.weddingService.removeBudgetPlanner(budgetPlannerId, budgetId);
        return budget;
    }

    @Get('/:id/budgetPlanner')
    async getWeddingBudgetPlanner(@Param('id') weddingId) {
        const budget = await this.weddingService.getWeddingBudgetPlanner(weddingId);
        return budget;
    }


    @Get('/:id/budgetPlanner/:budgetPlannerId')
    async getBudgetPlanner(@Param('id') weddingId, @Param('budgetPlannerId') budgetPlannerId) {
        const budget = await this.weddingService.getBudgetPlanner(weddingId, budgetPlannerId);
        return budget;
    }


    @Put('/:id/weddingAnniversary/')
    async updateWeddingAnniversary(@Param('id') weddingId, @Body() body: WeddingAnniversaryDto) {
        const wedding = await this.weddingService.updateWeddingAnniversary(weddingId, body);
        return wedding;
    }


    @Post('/:id/announcement/:announcementId/send')
    async sendAnnouncement(@Param('id') weddingId, @Param('announcementId') announcementId
        , @Body() body: SendAnnouncementDto) {
        const wedding = await this.weddingService.sendAnnouncement(announcementId, body);
        return wedding;
    }
}
