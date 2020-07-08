import {
  HttpService,
  HttpException,
  Injectable,
  NotFoundException,
  RequestTimeoutException,
  HttpStatus,
  ForbiddenException,
  InternalServerErrorException
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { GithubApi } from "./github-api";
import { AxiosResponse } from "axios";

@Injectable()
export class GithubApiService {
  private readonly baseUrl: string;
  requestSetting: any = {};
  requestHeaders: any = {};
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService
  ) {
    this.baseUrl = configService.get<string>("GITHUB_URL");
    if (configService.get(<string>"TOKEN")) {
      this.requestHeaders = {
        Authorization: `token ${configService.get<string>("TOKEN")}`
      };
      this.requestSetting = {
        headers: {
          Authorization: `token ${configService.get<string>("TOKEN")}`
        }
      };
    }
  }

  public async findGithubUsers(
    username: string,
    languages: string
  ): Promise<any> {
    let langArray = languages.split(",", 5);
    let response, newResponse: AxiosResponse;
    let requestUrl = this.baseUrl + `search/users?q=${username}+language:`;

    try {
      response = await this.httpService
        .get(requestUrl + `${langArray[0]}`, { headers: this.requestHeaders })
        .toPromise();
    } catch (err) {
      if (!response.data.items.length || err === RequestTimeoutException) {
        try {
          newResponse = await this.httpService
            .get(requestUrl + `${langArray[0]}` + `${langArray[1]}`)
            .toPromise();
        } catch (err) {
          if (err instanceof HttpException) {
            if (err instanceof NotFoundException) {
              throw new NotFoundException(
                "Error occur while searching for Users. Not Found !!"
              );
            } else if (err instanceof ForbiddenException) {
              throw new ForbiddenException(
                "This Request was forbidden due to Authorization or API calls limit !!"
              );
            } else
              throw new Error(
                "Unknown Error occur. Please Contact Development Team."
              );
          }
        }
        if (!newResponse.data.items.length) {
          throw new NotFoundException(
            "Zero result found for your query!! Please change the search query and try again."
          );
        } else
          return newResponse.data.items.map(_user =>
            this.mapUserDetailsData(_user)
          );
      }
      throw new NotFoundException(
        "Error occur while searching for Users. Not Found !!"
      );
    }

    return Promise.all(
      response.data.items.map(async _user => this.mapUserDetailsData(_user))
    );
  }

  private async countFollowers(username: string): Promise<number> {
    let response: AxiosResponse;
    try {
      response = await this.httpService
        .get(this.baseUrl + `users/${username}/followers`, {
          headers: this.requestHeaders
        })
        .toPromise();
    } catch (err) {
      if (err === HttpStatus.NOT_FOUND) {
        throw new NotFoundException("Error occur while searching user's Name");
      } else {
        throw new InternalServerErrorException(
          " Internal Server Error Occur!!"
        );
      }
    }
    return response.data.length;
  }

  private async getName(username: string): Promise<string> {
    let response: AxiosResponse;
    try {
      response = await this.httpService
        .get(this.baseUrl + `users/${username}`, {
          headers: this.requestHeaders
        })
        .toPromise();
    } catch (err) {
      if (err === HttpStatus.NOT_FOUND) {
        throw new NotFoundException("Error occur while searching user's Name");
      } else {
        throw new InternalServerErrorException(
          " Internal Server Error Occur!!"
        );
      }
    }

    return response.data.name;
  }

  private async mapUserDetailsData(user): Promise<GithubApi> {
    return {
      id: user.id,
      username: user.login,
      name: await this.getName(user.login),
      avatar_url: user.avatar_url,
      type: user.type,
      number_of_followers: await this.countFollowers(user.login),
      followers_url: user.followers_url,
      following_url: user.following_url,
      starred_url: user.starred_url,
      repos_url: user.repos_url
    };
  }
}
