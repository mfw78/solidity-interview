/* eslint-disable keyword-spacing */
/* eslint-disable camelcase */
import { expect } from "./chai-setup"
import { ethers, deployments, getUnnamedAccounts, getNamedAccounts, waffle } from "hardhat"
import { utils } from "ethers"

// eslint-disable-next-line camelcase
import { ReentrancyAttack, TestERC20 } from "../typechain"
import { setupUser, setupUsers } from "./utils"

// Number of test tokens
const NUM_TEST_TOKENS = utils.parseUnits("50", 18)

const setup = deployments.createFixture(async () => {
    await deployments.fixture("TestERC20")
    const { deployer, user } = await getNamedAccounts()
    const contracts = {
        erc20: <TestERC20>await ethers.getContract("TestERC20"),
        attacker: <ReentrancyAttack>await ethers.getContract("ReentrancyAttack")
    }
    const users = await setupUsers(await getUnnamedAccounts(), contracts)

    // Setup the tokens for testing
    return {
        users,
        deployer: await setupUser(deployer, contracts),
        user: await setupUser(user, contracts),
        ...contracts
    }
})

describe("ERC20", function () {
    let users: ({ address: string; } & { erc20: TestERC20; attacker: ReentrancyAttack})[]
    let deployer: { address: string; } & { erc20: TestERC20; attacker: ReentrancyAttack }
    let user: { address: string; } & { erc20: TestERC20; attacker: ReentrancyAttack }

    // helper for getting weth and token balances
    beforeEach("load fixture", async () => {
        ({ users, deployer, user } = await setup())

        // Deposit some ETH to get some tokens from the deployer
        await deployer.erc20.deposit({value: NUM_TEST_TOKENS})
    })

    context(`Constructor / deployment`, async () => {
        it("deploys the test token correctly", async () => {
            expect(await deployer.erc20.name()).to.be.eq("TestToken")
            expect(await deployer.erc20.symbol()).to.be.eq("TEST")
            expect(await deployer.erc20.totalSupply()).to.be.eq(NUM_TEST_TOKENS)
        })

        it("mints the correct amount to the deployer", async () => {
            expect(await deployer.erc20.balanceOf(deployer.address)).to.be.eq(NUM_TEST_TOKENS)
        })
    })

    context("Objectives", async () => {
        it(`#1 - Catch missing private identifier`, async () => {
            const abi = [{
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "sender",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "recipient",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    }
                ],
                "name": "_transfer",
                "outputs": [
                    {
                        "internalType": "bool",
                        "name": "",
                        "type": "bool"
                    }
                ],
                "stateMutability": "nonpayable",
                "type": "function"
            }]

            const badERC20 = await ethers.getContractAt(abi, user.erc20.address, user.address)

            await expect(
                badERC20.functions._transfer(deployer.address, user.address, NUM_TEST_TOKENS)
            ).to.be.reverted
            expect(await deployer.erc20.balanceOf(deployer.address)).to.be.eq(NUM_TEST_TOKENS)
        })

        it("#2 - Catch reentrancy attack vector", async () => {
            // Use the user account and deposit 1 ETH
            const ATTACK_AMOUNT = utils.parseEther("1")
            await user.erc20.deposit({ value: ATTACK_AMOUNT })

            // Now transfer this to the attack contract so that it can abuse the vector
            await user.erc20.transfer(user.attacker.address, ATTACK_AMOUNT)

            // Now the contract has a balance, attempt to drain completely of ETH.
            await user.attacker.executeAttack(user.erc20.address, ATTACK_AMOUNT)

            // If the contract worked as expected, should only have withdrawn 1 ETH.
            expect(await waffle.provider.getBalance(user.attacker.address)).to.be.eq(ATTACK_AMOUNT)
        })
    })

    context(`Objective #2 - Catch reentrancy attack vector in transferFrom()`, async () =>{

    })

})
