import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";


let statementsRepository:InMemoryStatementsRepository;
let userRepository:InMemoryUsersRepository;
let getStatementOperationUseCase: GetStatementOperationUseCase;
let createStatementUseCase: CreateStatementUseCase;
let createUserUseCase:CreateUserUseCase;


let user_id:any;
let statement:any;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe("Get statement operation", () =>{
  beforeEach( async () =>{
    userRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(userRepository);
    statementsRepository = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(userRepository, statementsRepository);
    getStatementOperationUseCase = new GetStatementOperationUseCase(userRepository, statementsRepository);

    const user = await createUserUseCase.execute({
      name:"Lou Young",
      email:"cagdognis@pojecbef.nr",
      password:"4212664668"
    });

    user_id = user.id;

    statement = await createStatementUseCase.execute({
      user_id,
      type:OperationType.DEPOSIT,
      amount:1000,
      description:"Description deposit 01"
    });

  });

  it("should not be able to get operation and non-existing user", async () =>{
    expect (async () =>{
      await getStatementOperationUseCase.execute({
        statement_id: statement.id,
        user_id:"invalid_user_id"
      })
    }).rejects.toBeInstanceOf(AppError)
  });

  it("should not be able to get operation and non-existing statement", async () =>{
    expect (async () =>{
      await getStatementOperationUseCase.execute({
        statement_id: "invalid_statement_id",
        user_id
      })
    }).rejects.toBeInstanceOf(AppError)
  });

  it("should be able to get statement operation", async () =>{
    console.log(statement)
    const statementeOperation = await getStatementOperationUseCase.execute({
      statement_id: statement.id,
      user_id
    })

    expect(statementeOperation).toHaveProperty("id")

  });


})
