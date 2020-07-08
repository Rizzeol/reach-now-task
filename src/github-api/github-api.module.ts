import { Module, HttpModule } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { GithubApiService } from "./github-api.service";
import { GithubApiController } from "./github-api.controller";

@Module({
  imports: [
    HttpModule.register({ timeout: 5000 }),
    ConfigModule.forRoot({ isGlobal: true })
  ],
  providers: [GithubApiService],
  controllers: [GithubApiController]
})
export class GithubApiModule {}
