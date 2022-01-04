# Assessment - Technical Questions

1. In the following code snippet, what is the value assigned to `result`?

```solidity
uint256 result = 3 / 2;
```

**Answer**: Solidity follows normal integer arithmetic, therefore `result = 1`.

2. In the following code snippet, what is the value assigned to `result`?

```solidity
uint256 result = 1 / 0;
```

**Answer**: Per the Ethereum Yellow Paper, divide by 0 equals 0, therefore `result = 0`.

3. Is this the most gas efficient way to pack these variables? If not, why?

```solidity
struct Test {
  uint128 a;
  uint256 b;
  uint128 c;
}
```

**Answer**: No, this is not the most gas efficient way to pack these variables. EVM
operates with 32 byte words, and stores variables in the order of declaration. 
Therefore, if storing in order `a, c, b`, this would result in more efficient packing
of variables into state.

4. You are writing a function that accepts a `bytes` parameter. From a gas 
   consumption perspective is it more expensive to store this in `memory` or
   `calldata`?.

**Answer**: If the function is `external`, it would be more efficient to store the
`bytes` parameter in `calldata` than `memory`. `calldata` is not avilable for allocation
if the function is `internal` or `private`.

5. You write a smart contract that does not contain a `fallback()` or `receive()`
   function. Can you forcibly send ether to this address? If yes, explain.

**Answer**: Yes, you can forcibly allocate Ether to an address. Any contract that has
`selfdestruct(addr)` called will send the contract's Ether balance to the `addr`
specified, irrespetive if that `addr` contains a `receive()` or `fallback()` function.

6. Can you rely on all contract addresses containing code?

**Answer**: No. An address that has no code may be an address of a contract that hasn't
been deployed yet, or it could also be a contract that is currently being deployed
(ie. the constructor is running, at which time the address being deployed to won't
have any code).

7. In a minimum `ERC20` token compliant implementation, is it possible to iterate over
   all token holders with a balance? If not, how would you go about generating a 
   list of all token holders?

**Answer**: As the ERC20 token implementation is generally done with a balances `mapping`,
it is not possible to iterate over all the token holders. The ERC20 token implementation
requires the emission of `Transfer` events when minting / burning / transfering ERC20
tokens, therefore the `Transfer` event logs would have to be replayed to build a list of
all token holders.

8. What is the difference between `call()` and `delegatecall()`?

**Answer**: `call()` passes the execution context to the called contract, with `msg.sender`
set to the contract's address who made the `call()`, and `msg.value` set to a value 
specified by the calling contract.

`delegatecall()` passes the execution context to the called contract, however then gives
the called contract access to the calling contract's storage. `msg.sender` remains the
original value, as does `msg.value`.

`delegatecall()` essentially allows any delegatecalled contract full access to the storage.

9. In your own words, describe the `EIP-1967` Transparent Proxy Standard.

**Answer**: Provides a proxy separation between state storage and logic implementation. The
proxy's administrator can set the implementation address, allowing for upgrades to for a
contract's logic.

The logic controll is passed to the implementation contract by means of `delegatecall()`.

10. What is the gas refund for `SELFDESTRUCT` ?

**Answer**: None. Since the London hardfork, EIP-3529 went active which removed gas refunds
for `SELFDESTRUCT`.