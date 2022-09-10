import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetBalanceUseCase } from "../getBalance/GetBalanceUseCase";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

let userRepository:InMemoryUsersRepository;
let statementsRepository:InMemoryStatementsRepository;
let getBalanceUseCase :GetBalanceUseCase;
let createStatementUseCase:CreateStatementUseCase;
let createUserRepository:CreateUserUseCase;

let user_id:any;


enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe("Create Statement", () => {
  beforeEach( async () =>{
    userRepository = new InMemoryUsersRepository();
    statementsRepository = new InMemoryStatementsRepository();
    getBalanceUseCase = new GetBalanceUseCase(statementsRepository, userRepository)
    createStatementUseCase = new CreateStatementUseCase(userRepository, statementsRepository);
    createUserRepository = new CreateUserUseCase(userRepository);

    const user = await createUserRepository.execute({
      name:"Lou Young",
      email:"cagdognis@pojecbef.nr",
      password:"4212664668"
    });

    user_id = user.id;

  });

  it("should not be abel to create a statement for an existing user", async () =>{
    expect( async () =>{
      await createStatementUseCase.execute({
        user_id:"invalid_id",
        type:OperationType.DEPOSIT,
        amount:10000,
        description:"Description deposit 01"
      })
    }).rejects.toBeInstanceOf(AppError);
  });

  it("should be able to create a desposit statement", async () =>{
    const value = 1000;
    await createStatementUseCase.execute({
      user_id,
      type:OperationType.DEPOSIT,
      amount:value,
      description:"Description deposit 01"
    });
    const balance = await getBalanceUseCase.execute({user_id})
    expect(balance.balance).toEqual(value);
  });

  it("should be able to create a desposit whitdraw", async () =>{
    const value = 1000;

    await createStatementUseCase.execute({
      user_id,
      type:OperationType.DEPOSIT,
      amount:value,
      description:"Description DEPOSIT 01"
    });

    await createStatementUseCase.execute({
      user_id,
      type:OperationType.WITHDRAW,
      amount:value,
      description:"Description WITHDRAW 01"
    });

    const balance = await getBalanceUseCase.execute({user_id});
    expect(balance.balance).toEqual(0);

  });

  it("should be not able to create a statement whitdraw with insufficient fund", async () =>{
    expect ( async () =>{
      const value = 1000;
      await  createStatementUseCase.execute({
        user_id,
        type:OperationType.WITHDRAW,
        amount:value,
        description:"Description WITHDRAW 01"
      })}
    ).rejects.toBeInstanceOf(AppError);
  });


});
