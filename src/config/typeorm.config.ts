import {TypeOrmModuleOptions} from '@nestjs/typeorm';

export const typeormConfig: TypeOrmModuleOptions = {
    type: 'postgres',
    url: process.env.DB_URL,
    synchronize: true,
    entities: ['dist/features/**/*.entity.{ts,js}'],
    autoLoadEntities: true,
};
