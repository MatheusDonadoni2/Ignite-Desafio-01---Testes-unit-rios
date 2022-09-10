import "reflect-metadata";

import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "./CreateUserUseCase";

import { AppError } from "../../../../shared/errors/AppError";


let createUserUseCase: CreateUserUseCase;
let usersRepositoryInMemory: InMemoryUsersRepository;

describe("Create user", () =>{
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  })

  it("should be able to create a new user", async  () =>{
    const user = await createUserUseCase.execute(
      {
        name:"Stella Tucker",
        email:"lu@setemsav.li",
        password:"4025792200"
      }
    );

    expect(user).toHaveProperty('id');

  });

  it("should not be able to create a user with exists user.", () => {
     expect( async () => {
        await createUserUseCase.execute(
          {
            name:"Angel Becker",
            email:"gieca@virapofu.wf",
            password:"123456"
          }
        );
        await createUserUseCase.execute(
          {
            name:"Angel Becker",
            email:"gieca@virapofu.wf",
            password:"123456"
          }
        );
    }).rejects.toBeInstanceOf(AppError);
  });



});
