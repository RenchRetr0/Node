import CustomError from "../CustomError";
import  dotenv from 'dotenv';
import  is from 'is_js';
import  bcrypt from 'bcrypt';
import User from "../database/models/User";
import jwt from 'jsonwebtoken';
import sequelize from '../database/sequelize';
import {Sequelize} from 'sequelize-typescript';
dotenv.config();

interface GenericResponse {
    status: number,
    message: string;
}

export default class AuthApi {
    sequelize: Sequelize;

    constructor() {
        this.sequelize = sequelize;
    }
    
    public async signUp(options: {
        email: string,
        password: string
    }): Promise<any> {
        const {email, password} = options;

        try {

            if ( !email || !password ) {
                throw new CustomError({
                    status: 400,
                    message: 'All parameters are required.'
                });
            }

            if (!is.email(email)) {
                throw new CustomError({
                    status: 400,
                    message: 'Invalid email address'
                });
            }

            if (password.search(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/i) === -1) {
                throw new CustomError({
                    status: 400,
                    message: 'Password must be at least 8 characters, must contain 1 special character and number.'
                });
            }

            const user = await User.findOne({
                where: {
                    email: email
                },
                attributes: {
                    exclude: ['password']
                }
            });

            if (user) {
                throw new CustomError({
                    status: 400,
                    message: 'User already exists.'
                });
            }

            const passwordHash = await bcrypt.hash(password, Number(process.env.SALT_ROUNDS));
            const createdUser = await User.create({
                email: email,
                password: passwordHash,
            });

            if (!createdUser) {
                throw new CustomError({
                    status: 500,
                    message: 'Internal server error: could not connect to database.'
                });
            }

            return {
                status: 200,
                message: 'User was successfully created.'
            };
        } catch (e) {
            console.log(e);
            throw e;
            // return reply.code(500).send(e);
        }
    }

    public async signIn(options: {
        email: string,
        password: string
    }): Promise<any> {
        try {
            const {email, password} = options;

            if (!email || !password) {
                throw new CustomError({
                    status: 400,
                    message: 'All parameters are required.'
                });
            }

            if (!is.email(email)) {
                throw new CustomError({
                    status: 400,
                    message: 'Invalid email address'
                });
            }

            const user = await User.findOne({
                where: {
                    email: email,
                }
            });

            if (!user) {
                throw new CustomError({
                    status: 404,
                    message: 'Cannot find user with current email address.'
                });
            }
            
            const hashCompare = await bcrypt.compare(password, user.password);
            if (!hashCompare) {
                throw new CustomError({
                    status: 400,
                    message: 'Invalid email or password.'
                });
            }

            const token = jwt.sign({
                data: {
                    id: user.id,
                    email: user.email,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt
                }
            }, process.env.TOKEN_SECRET, {
                expiresIn: '86400000'
            });

            await user.reload({
                attributes: {
                    exclude: ['password']
                }
            });

            return {
                status: 200,
                message: 'OK',
                user,
                token
            };
        } catch (e) {
            throw e;
        }
    }
}