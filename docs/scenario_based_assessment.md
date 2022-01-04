# Assessment - Scenario Based Assessment

## Assessors notes

The following scenario based assessment contains a scenario with multiple obvious options already
gamed out for guidance for the assessor. There are 4 methods for achieving the desired outcome
with subsequent questions to follow up for each of these methods.

The examples below of how the scenario may be completed are not exhaustive. Of importance is the
candidate's ability to objectively assess, reason, and game out pros / cons within the limtiations
of Solidity / EVM.

## Candidate Scenario

  Winding Tree is deploying a loyalty program whereby they are wanting to distribute a large quantity 
  (1000s) of tokens (fungible or non-fungible). 

### Questions

1. What token distribution method would you use? What considerations do you have in choosing your distribution method?

   i.   Use wallet to programmatically send tokens to one recipient at a time (High gas cost, poor security / transparency).
   ii.  Use smart contract to batch transactions to multiple recipients at a time (More gas efficient than i).
   iii. If token is built with the EIP712 Permit extension, transfer all tokens to an EOA wallet and publish permit signatures 
        for all claimmants (Gas efficient, but requires very careful mnemonic / private key security).
   iv.  Use MerkleTree (MerkleDrop) whereby all claimmants and amounts are constructed in a merkle tree with the root hash 
        of the merkle tree stored in a smart contract that contains the tokens being claimed. (Gas efficient, mnemonic / 
        private key security risk is eliminated).

2. From the perspective of the receiver, how gas efficient is the distribution?

   i.   Zero gas cost for receiver. Very efficient.
   ii.  Zero gas cost for receiver. Very efficient.
   iii. Requires two calls (one for permitted approve to transfer tokens, the other to actually transfer the tokens). 
        Moderately gas efficient.
   iv.  Requires submission of claim proof with gas cost proportional to the log(number of distribution receipients).

3. From the perspective of the sender, how gas efficient is the distribution?

   i.   Extremely high cost of gas. Very poor gas efficiency.
   ii.  More gas efficient than (i) by at least 21000 gas per additional recipient in batch.
   iii. Extremely gas efficient as all signatures can be sent off of chain. No smart contract deployment required.
   iv.  Less gas efficient than (iii) due to smart contract deployment requirement.

4. What are the security risks for your described method?

   i.   Relies upon security of private key / mnemonic used by the deployer to conduct the distribution. Security is solely 
        dependent on human practices.
   ii.  If the distribution contract is upgradeable and/or has administrative methods, those present security risks. If 
        deployed with no upgradeability and/or administrtive methods, all security risks are impleme ntation related.
   iii. Same as (i).
   iv.  Same as (ii)

5. Does the distribution achieve the desired outcome? 

   Of critical note with the scenario presented, there is no clearly defined economic objective. Clarification of the desired 
   objective should ideally be sought by the candidate.
   
   The distribution may be out of a desire to increase the decentralisation of token supply, or as an advertising campaign for 
   the system. Considering these two:
   
   Decentralisation
   
   i.   More likely to guarantee increased decentralisation through forced distribution of tokens. May present cases where 
        accounts have "dust" amounts of tokens that are not economical for distribution (distribution costs more than value), 
        and/or don't meet the  objective of providing reasonable, viable decentralisation. Likely to create "wastage" tokens 
        that are not utilised.
   ii.  Same as (i).
   iii. Less likely to guarantee increased decentralisation as unlikely to have a 100% claim rate due to some claims not 
        being economically viable and some claimants not realising that they are eligible. Tokens are more likely to be 
        utilised due active claim process. Less token wastage.
   iv.  Same as (iii).
   
   Advertising
   
   i.   Likely good advertising, however on assumption of tokens having value, token wastage becomes a consideration from a cost
        perspective.
   ii.  Same as (i).
   iii. Presents a higher cost to the claimmant and therefore may create increased hesitancy. Reduces cost for advertising due to
        gas reductions and reduced wastage.
   iv.  Same as (iii).
