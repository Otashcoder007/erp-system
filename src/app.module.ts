import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {typeormConfig} from "./config/typeorm.config";
import {AuthModule} from "./features/black-hole/auth/auth.module";
import {GroupsModule} from "./features/black-hole/groups/groups.module";
import {LessonsModule} from "./features/black-hole/lessons/lessons.module";
import {TasksModule} from "./features/black-hole/tasks/tasks.module";
import {TemplatesModule} from "./features/black-hole/templates/templates.module";
import {SubmissionsModule} from "./features/black-hole/submissions/submissions.module";

@Module({
  imports: [TypeOrmModule.forRoot(typeormConfig), AuthModule, LessonsModule, TasksModule, GroupsModule, TemplatesModule, SubmissionsModule],
})
export class AppModule {}
