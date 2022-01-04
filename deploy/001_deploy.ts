import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"


/**
 * Deploy Test ERC20 token
 * @param hre Hardhat runtime environment
 */
const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre
  const { deploy } = deployments

  const { deployer, user } = await getNamedAccounts()

  // --- Account listing ---
  console.log(`Deployer: ${deployer}`)
  console.log(`Test user: ${user}`)

  // --- Deploy the contracts ---
  await deploy("TestERC20", {
    from: deployer,
    args: ['TestToken', 'TEST'],
    log: true,
    autoMine: true
  })

  await deploy("ReentrancyAttack", {
    from: deployer,
    log: true,
    autoMine: true
  })

}

export default func
func.tags = ["TestERC20"]
