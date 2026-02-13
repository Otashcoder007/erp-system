import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {typeormConfig} from './config/typeorm.config';
import {AuthModule} from './features/black-hole/auth/auth.module';
import {GroupsModule} from './features/black-hole/groups/groups.module';

@Module({
    imports: [TypeOrmModule.forRoot(typeormConfig), AuthModule, GroupsModule],
})
export class AppModule {}
