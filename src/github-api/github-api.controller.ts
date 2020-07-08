import { Controller, Get, Query } from "@nestjs/common";
import { GithubApiService } from "./github-api.service";

@Controller("api")
export class GithubApiController {
  constructor(private readonly githubApiService: GithubApiService) {}

  @Get()
  public async findUsers(
    @Query("username") username: string,
    @Query("languages") languages: string
  ): Promise<any> {
    return this.githubApiService.findGithubUsers(username, languages);
  }
}
