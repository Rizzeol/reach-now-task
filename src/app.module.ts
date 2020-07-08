import { Module } from "@nestjs/common";

import { GithubApiModule } from "./github-api/github-api.module";

@Module({
  imports: [GithubApiModule]
})
export class AppModule {}
