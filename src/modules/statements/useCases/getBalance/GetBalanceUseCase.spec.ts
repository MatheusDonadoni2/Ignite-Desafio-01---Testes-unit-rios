import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetBalanceUseCase } from "./GetBalanceUseCase"


let createStatementUseCase: CreateStatementUseCase;
let createUserUseCase: CreateUserUseCase;

let usersRepository:InMemoryUsersRepository;
let statementsRepository: InMemoryStatementsRepository;
let getBalanceUseCase: GetBalanceUseCase;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe("Get balance", () =>{

  let user_id:any;

  beforeEach( async () =>{
    usersRepository = new InMemoryUsersRepository();
    statementsRepository = new InMemoryStatementsRepository;
    createUserUseCase= new CreateUserUseCase(usersRepository);
    createStatementUseCase = new CreateStatementUseCase(usersRepository, statementsRepository);
    getBalanceUseCase = new GetBalanceUseCase(statementsRepository, usersRepository);

    const user = await  createUserUseCase.execute({
      name:"Lettie Henry",
      email:"cavewut@du.fr",
      password:"1792002480"
    });

    user_id = user.id;

  });


  it("should not be able to get balance with a non-existing user.", async () =>{
    expect(async () =>{
      await getBalanceUseCase.execute({user_id:"invalid-user-id"})
    }).rejects.toBeInstanceOf(AppError)
  });

  it("should be to get on balance", async () =>{

    await createStatementUseCase.execute({
      user_id,
      type: OperationType.DEPOSIT,
      amount:1000,
      description:"Desosit 1"
    });

    const balance = await getBalanceUseCase.execute({user_id});

    expect(balance).toHaveProperty("balance");
  })


})
