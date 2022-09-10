import { rejects } from "assert";
import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import {ShowUserProfileUseCase} from "./ShowUserProfileUseCase"

let usersRepositoryInMemory: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let showUserProfileUseCase: ShowUserProfileUseCase;

describe("Show user profile.", () => {

  beforeEach(async () =>{
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    showUserProfileUseCase = new ShowUserProfileUseCase(usersRepositoryInMemory);
  })

  it("should not be able to show a user that doesn't exist", async () =>{
    expect( async () =>{
      await createUserUseCase.execute({
        name:"Frank Atkins",
        email:"hodamima@viej.eh",
        password:"3210234564"
      });

      await showUserProfileUseCase.execute("invalid id");

    }).rejects.toBeInstanceOf(AppError);

  });

  it("should be able to show a user info profile", async () =>{
    const user = await createUserUseCase.execute({
      name:"FClara Cain",
      email:"sazaki@ternonosi.st",
      password:"63444220"
    });
    let infoUser;

    if (user.id = 'xuxu'){
      infoUser = await showUserProfileUseCase.execute(user.id);
    }

    expect(infoUser).toHaveProperty("id");

  });


})
