        import { Strategy as GoggleStrategy } from 'passport-google-oauth20';
        import passport from 'passport';
        import configKey from '../configs/configkeys';
        import User from '../models/user.model';
        import { Express } from 'express';
        import { SocialLoginEnums, UserRolesEnum } from '../types/constants/common.constant';
        import AppError from '../utils/AppError';
        import HttpStatus from '../types/constants/http-statuscodes';

        try {   
            passport.serializeUser<any,any>((req,user:Express.User, next) => {
                next(null,user._id  )
            })

            passport.deserializeUser(async (id, next) => {
                try {

                    const user = await User.findById(id);
                    if (user) next(null, user);
                    else next(new AppError("User does not exist", HttpStatus.NOT_FOUND), null);
                } catch (error) {
                    next(
                        new AppError(
                            "Something went wrong while deserializing the user. Error: " + error
                            , HttpStatus.INTERNAL_SERVER_ERROR),
                        null
                    );
                }
            
            
            })


            passport.use(new GoggleStrategy({
                clientID: configKey().GOOGLE_CLIENT_ID,
                clientSecret: configKey().GOOGLE_CLIENT_SECRET,
                callbackURL: configKey().GOOGLE_CALLBACK_URL
            }, async (_, __, profile, next) => {
            
                const user = await User.findOne({ email: profile?._json?.email });
                if (user) {
                    if (user?.loginType !== SocialLoginEnums.GOOGLE) {
                        next(new AppError(`you have previously registered using 
                    ${user?.loginType.toLowerCase()}
                . Please use the ${user?.loginType?.toLowerCase()}
                login option to access your account.`, HttpStatus.BAD_REQUEST))
                    } else next(null,user)
                } else {
                
                    const createdUser = await User.create({
                        email: profile?._json.email,
                        password: profile?._json.sub,
                        firstname: profile?._json.given_name,
                        lastname: profile?._json.family_name,
                        role: UserRolesEnum.USER,
                        avatar: {
                            url: profile._json.picture,
                            localPath: ''
                        },
                        loginType: SocialLoginEnums.GOOGLE
                    })
                    if (createdUser) {
                        next(null, createdUser)
                    } else {
                        next(new AppError("Error while registering the user", HttpStatus.INTERNAL_SERVER_ERROR));
                    }
                }
            
            }))

        } catch (error) {
            console.error("PASSPORT ERROR: ", error);

        }