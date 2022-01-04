# Assessment - Contract Review

## Guidance for Candidate

Your colleagues have implemented a simple ERC20 contract that also provides a `Bank` interface.
This `Bank` interface allows anyone to deposit Ether, and receive a corresponding amount of
tokens in return. The interface specification is available in the `TestERC20.sol` smart contract. 

Prior to sending this contract for audit, you have been tasked to review this contract. As part
of this review you should consider:

1. ERC20 compliance.
2. Gas deployment efficiency.
3. Security.

Your job is to review the contract and provide corrections to your colleagues, if any.


## Assessor's Guidance

The contract contains the following errors that should be rectified:

1. Incorrect `public`/`private` identifier on `_transfer()`, allowing for unprivileged
   transactions of all funds. 
2. `Bank` interface `withdraw` method contains reentrant attack vector - the internal contract
   balances are not set prior to transferring ETH to withdrawing party.
3. `increaseAllowance()` and `decreaseAllowance()` contain inefficient code, making external 
   calls to the same contract to retrieve allowances, instead of using internal calls.
