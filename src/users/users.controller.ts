import {
    Body,
    Controller,
    Post,
    Get,
    Param,
    Session,
    UseGuards,
    InternalServerErrorException,
    Delete,
    Patch,
    Put,
    Query,
} from '@nestjs/common';
import {AuthGuard} from '../guards/auth.guard';
import {isMongoIdValid} from '../utils/mongo';
import {Serialize} from '../interceptors/serialize.intercepror';
import {AuthService} from './auth.service';
import {CurrentUser} from './decorators/current-user.decorator';
import {
    CreateUserDto,
    EmailExistDto,
    EmailVerifyDto,
    ResetPasswordDto,
} from './dtos/create-user.dto';
import {LoginUserDto} from './dtos/login-user.dto';
import {DeleteUserImageDto, FeedbackDto, UserDto} from './dtos/user.dto';
import {Users} from './models/users.model';
import {UsersService} from './users.service';
import {
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
import {LikePostDto} from '../posts/dtos/posts.dto';
import {errorResponse} from '../utils/response';
import {UpdateWeddingVowsDto} from "../wedding/dtos/wedding.dto";
import {CreateMyListDto} from "./dtos/my-list.dto";
import {FilterDto} from "./dtos/filter.dto";
import {SearchAndFilterDto} from "./dtos/search-and-filter.dto";
import {CreateReportProblem} from "./dtos/report-problem.dto";
import {CreateAdminDto, UpdateAdminDto} from "./dtos/admin.dto";

const stripe = require('stripe')("sk_test_51L5qqGClYFsBJMtmr6mZXJgnlM5xV2wEU9jjoP1XhAUBuH8pG5dMo02pA24LVscakTih8HqLpqCEFxylMfrbv8Rf00Hyh8bIXv");

@Controller('users')
// @Serialize(UserDto)
export class UsersController {
    constructor(
        private userService: UsersService,
        private authService: AuthService,
    ) {
    }

    @Get('/whoami')
    @UseGuards(AuthGuard)
    whoAmI(@CurrentUser() user: Users) {
        return user;
    }

    @Post('/signup')
    async createUser(@Body() body: CreateUserDto, @Session() session: any) {

        const user = await this.authService.signup(
            body.email,
            body.password,
            body.user_type,
            body.user_name,
        );
        session.userEmail = user.data.email;
        return user;
    }

    @Post('/reset_password')
    async resetPassword(@Body() body: ResetPasswordDto) {
        const response = await this.authService.resetPassword(
            body.email,
            body.current_password,
            body.new_password,
        );
        return response;
    }

    @Post('/signin')
    async loginUser(@Body() body: LoginUserDto, @Session() session: any) {
        const user = await this.authService.signin(body.email, body.password);
        session.userEmail = user.email;
        return user;
    }

    @Post('/signin')
    async signin(@Body() body: CreateUserDto, @Session() session: any) {
        const user = await this.authService.signin(body.email, body.password);
        session.userEmail = user.email;
        return user;
    }

    @Post('/signout')
    signOut(@Session() session: any) {
        session.userEmail = null;
    }

    @Post('/check_email')
    async checkEmail(@Body() body: EmailExistDto) {
        const user = await this.userService.emailExists(body.email);
        return user;
    }

    // @UseInterceptors(new SerializeInterceptor(UserDto))
    @Get()
    findAllUsers() {
        return this.userService.findAll();
    }

    @Get('/:id')
    async getByid(@Param('id') id: string) {
        if (!isMongoIdValid(id)) {
            throw new InternalServerErrorException(
                'Validation failed (ObjectId is expected)',
            );
        }
        const response = await this.userService.findById(id);
        return response;
    }


    @Get('/:occupation/occupation')
    async getUserByExpertise(@Param('occupation') occupation: string) {
        const response = await this.userService.findByOccupation(occupation);
        return response;
    }


    @Get('/all/users')
    async getByUserType(@Query() query) {
        const {user_type} = query;
        if (!user_type) {
            return errorResponse(500, 'user_type required in query');
        }
        const response = await this.userService.findByUserType(user_type);
        return response;
    }

    @Delete('/:id')
    deleteUser(@Param('id') id: string) {
        if (!isMongoIdValid(id)) {
            throw new InternalServerErrorException(
                'Validation failed (ObjectId is expected)',
            );
        }
        return this.userService.delete(id);
    }

    @Post('/profile')
    async updateProfileInfo(@Body() body: CreateUserProfileDto) {
        const user = await this.userService.updateProfileInfo(body);
        return user;
    }

    @Post('/profile/add_qualifications')
    async updateProfileQualification(@Body() body: UpdateQualificationDto) {
        const response = await this.userService.updateQualification(body);
        return response;
    }

    @Post('/profile/add_certificates')
    async updateProfileCertificates(@Body() body: UpdateCertificateDto) {
        const response = await this.userService.updateCertificate(body);
        return response;
    }

    @Post('/profile/driving_license')
    async updateProfileDrivingLicense(@Body() body: CreateDrivingLicenseDto) {
        const response = await this.userService.updateDrivingLicense(body);
        return response;
    }

    @Post('/profile/other_document')
    async updateProfileOtherDocument(@Body() body: CreateOtherDocumentDto) {
        const response = await this.userService.updateOtherDocument(body);
        return response;
    }

    @Post('/profile/passport')
    async updateProfilePassport(@Body() body: CreatePassportDto) {
        const response = await this.userService.updatePassport(body);
        return response;
    }

    @Post('/profile/payment_method')
    async updateProfilePaymentMethod(@Body() body: CreatePaymentMethodDto) {
        const user = await this.userService.createPaymentMethod(body);
        return user;
    }

    @Post('/profile/degree_or_qualification')
    async updateProfileDegree(@Body() body: CreateQualificationOrDegreeDto) {
        const user = await this.userService.createDegreeOrQualification(body);
        return user;
    }

    @Post('/profile/like_post')
    async profileLikePost(@Body() body: LikeProfileDto) {
        const response = await this.userService.likeUserProfile(body);
        return response;
    }

    @Post('/profile/dis_like_post')
    async profileDisLikePost(@Body() body: DisLikeProfileDto) {
        const response = await this.userService.disLikeUserProfile(body);
        return response;
    }

    @Post('/send_verification_code')
    async sendVerificationCode(@Body() body: EmailExistDto) {
        const response = await this.userService.sendVerifcationCode(body);
        return response;
    }

    @Post('/verify_email')
    async verifyEmail(@Body() body: EmailVerifyDto) {
        const response = await this.userService.verifyEmail(body);
        return response;
    }

    @Get('/:id/earnings')
    async getUserEarnings(@Param('id') id: string) {

        const response = await this.userService.getEarnings(id);
        return response;
    }


    @Put('/:id/my-list')
    async addNewMyList(@Param('id') id,@Body() body: CreateMyListDto) {
        const user = await this.userService.addNewList(id,body);
        return user;
    }

    @Put('/:id/my-list/:listId')
    async updatedMyList(@Param('id') id,@Param('listId') listId,@Body() body: CreateMyListDto) {
        const user = await this.userService.updateMyList(id,listId,body);
        return user;
    }


    @Delete('/:id/my-list/:listId')
    async removeList(@Param('id') id,@Param('listId') listId) {
        const user = await this.userService.removeMyList(id,listId);
        return user;
    }


    @Get('/:id/my-list')
    async getMyList(@Param('id') id) {
        const user = await this.userService.getMyList(id);
        return user;
    }



    @Post('/filter')
    async userFilter(@Body() body: FilterDto) {
        const user = await this.userService.filterUser(body);
        return user;
    }

    @Put('/profile/multiple')
    async updateUserProfileMultiple(@Body() body: UpdateMultipleUsersDto) {
        const user = await this.userService.updateMultipleUsers(body);
        return user;
    }


    @Post('/search')
    async searchByAnyField(@Body() body: SearchAndFilterDto) {
        const user = await this.userService.searchByField(body);
        return user;
    }

    @Post('/:id/report-problem')
    async addReportProblem(@Param('id') id,@Body() body: CreateReportProblem) {
        const reportProblem = await this.userService.createReportProblem(id,body);
        return reportProblem;
    }

    @Get('/report-problem/all')
    async getReportProblem() {
        const reportProblem = await this.userService.getAllReportProblems();
        return reportProblem;
    }

    @Get('/:id/report-problem/type/:type')
    async getReportProblemById(@Param('id') id,@Param('type') type) {
        const reportProblem = await this.userService.getAllReportProblemsOfUser(id,type);
        return reportProblem;
    }


    @Get('/:id/contacts')
    async getUserContactsList(@Param('id') id) {
        const contacts = await this.userService.getUserContactsList(id);
        return contacts;
    }

    @Get('/:id/images')
    async getUserImages(@Param('id') id) {
        const contacts = await this.userService.getUserImages(id);
        return contacts;
    }


    @Put('/images/delete')
    async deleteAssets(@Body() payload: DeleteUserImageDto) {
        const contacts = await this.userService.deleteUserImage(payload);
        return contacts;
    }


    @Post('/:id/feedback')
    async postFeedback(@Param('id') id,@Body() payload: FeedbackDto) {
        const contacts = await this.userService.postFeedback(id,payload);
        return contacts;
    }


    @Get('/:id/feedback')
    async getFeedback(@Param('id') id) {
        const contacts = await this.userService.getFeedback(id);
        return contacts;
    }


    @Put('/:id/feedback')
    async updateFeedback(@Param('id') id,@Body() payload: FeedbackDto) {
        const contacts = await this.userService.updateFeedback(id,payload);
        return contacts;
    }


    @Get('/:id/hashtags')
    async getUserHashTags(@Param('id') id) {
        const hashtags = await this.userService.getUserHashTags(id);
        return hashtags;
    }

    @Delete('/:id/hashtags')
    async clearHashTags(@Param('id') id) {
        const hashtags = await this.userService.clearHashTags(id);
        return hashtags;
    }




}
