import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { User } from './schema/user.schema'
import { hashSync } from 'bcrypt'
import { v4 as uuidv4 } from 'uuid'
import { UsersRepository } from './users.repository';
@Injectable()
export class UsersService {

    constructor(private readonly usersRepository: UsersRepository){}

    async getAll(){
        return await this.usersRepository.find();
    }

    async getById(uuid: string){
        const user = await this.usersRepository.findOne({userUuid: uuid});
        if(!user) throw new NotFoundException('User not found');
        return user
    }

    async getByEmail(email:string){
        const user = await this.usersRepository.findOne({email})
        if(!user) throw new NotFoundException('User not found');
        return user
    }

    async create(user:User){
        try{
            let hashPassword = hashSync(user.password,10)
            user.password = hashPassword;
            user.userUuid = uuidv4();
            return await this.usersRepository.create(user)
        }catch(e){
            throw new InternalServerErrorException(e)
        }
        
    }

    async update(uuid:string, user:User){
        const userStored: any = await this.getById(uuid);
        return await this.usersRepository.update({_id: userStored._id}, user)
    }

    async delete(uuid){
        const userStored: any = await this.getById(uuid);
        return await this.usersRepository.deleteMany({_id: userStored._id});
    }

}
