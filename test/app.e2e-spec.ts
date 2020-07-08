import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "../src/app.module";

describe("AppController (e2e)", () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it("/api", () => {
    return request(app.getHttpServer())
      .get("/api")
      .set("Accept", "application/json")
      .query({ username: "rizzeol", languages: "java,python" })
      .expect(200);
  });

  it("/api", () => {
    return request(app.getHttpServer())
      .get("/api")
      .set("Accept", "application/json")
      .query({
        username: "harry styles",
        languages: "javascript,python"
      })
      .expect(200);
  });

  it("test api with normal user string and languages", () => {
    return request(app.getHttpServer())
      .get("/api")
      .set("Accept", "application/json")
      .query({
        username: "hamzamus",
        languages: "go,c++"
      })
      .expect(200);
  });

  it("test api with obvious user string and languages", () => {
    return request(app.getHttpServer())
      .get("/api")
      .set("Accept", "application/json")
      .query({
        username: "helloworld",
        languages: "python,c"
      })
      .expect(200);
  });
});
