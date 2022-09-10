import "reflect-metadata";

import { AppError } from "../../../../shared/errors/AppError";

import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";


let usersRepositoryInMemory: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;


describe("Authenticate user", () =>{
  beforeEach(async () =>{
    usersRepositoryInMemory = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(usersRepositoryInMemory);
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);

    await createUserUseCase.execute({
      name: "Minerva Adams",
      email: "wabezme@niemapit.cm",
      password: "1775886879"
    });

  });


  it("should not be able to authenticate with a not existent user", async () =>{
    expect( async () =>{
      await authenticateUserUseCase.execute({
        email:"korsemtog@al.eg",
        password:"1501944580"

      });
    }).rejects.toBeInstanceOf(AppError)

  });

  it("should not be able to authenticate with a wrong password ser", async () =>{
    expect( async () =>{
      await authenticateUserUseCase.execute({
        email:"wabezme@niemapit.cm",
        password:"1501944580"

      });
    }).rejects.toBeInstanceOf(AppError)

  });

  it("should be able create the authentication to user", async () =>{
    const session = await authenticateUserUseCase.execute({
      email:"wabezme@niemapit.cm",
      password:"1775886879"
    });

    expect(session).toHaveProperty("token");

  })

})
