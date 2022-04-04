# Jumbo

```
    export NEAR_ENV=testnet
    export TOKEN_1=ref.fakes.testnet
    export TOKEN_2=token.solniechniy.testnet
    export CONTRACT_ID=ref-contract.solniechniy.testnet
    export OWNER_ID=solniechniy.testnet
```

## Creating LP 

Creating simple pool
```
    near call $CONTRACT_ID add_simple_pool '{"tokens": ["'$TOKEN_1'","'$TOKEN_2'"], "fee": 25}' --accountId=$OWNER_ID --depositYocto=3480000000000000000000
    export POOL=(number from command above)
```

Creating stable pool
```
  near call $CONTRACT_ID add_simple_pool '{"tokens": ["'$TOKEN_1'","'$TOKEN_2'"], "decimals": [18, 18], "fee": 25, "amp_factor": 1}' --accountId=$OWNER_ID --depositYocto=4000000000000000000000
    export POOL=(number from command above)
```

Tokens storage deposit

```
    near call $TOKEN_1 storage_deposit '{"account_id": "'$CONTRACT_ID'","registration_only": true}' --accountId=$CONTRACT_ID --deposit 0.00125 
    near call $TOKEN_2 storage_deposit '{"account_id": "'$CONTRACT_ID'","registration_only": true}' --accountId=$CONTRACT_ID --deposit 0.00125 
```

Token registration 

```
  near call $CONTRACT_ID register_tokens '{"token_ids": ["'$TOKEN_2'","'$TOKEN_1'"]}' --accountId=$OWNER_ID --depositYocto=1
```

Transfer tokens 

```
near call $TOKEN_1 ft_transfer_call '{"receiver_id": "'$CONTRACT_ID'", "amount": "10000000000000000000", "msg": ""}' --accountId=$OWNER_ID --depositYocto=1 --gas=200000000000000
near call $TOKEN_2 ft_transfer_call '{"receiver_id": "'$CONTRACT_ID'", "amount": "10000000000000000000", "msg": ""}' --accountId=$OWNER_ID --depositYocto=1 --gas=200000000000000
```

Add liquidity 

```
near call $CONTRACT_ID add_liquidity '{"pool_id": '$POOL', "amounts":["10000000000000000000","10000000000000000000"]}' --accountId $OWNER_ID --depositYocto=840000000000000000000
```

Add stable liquidity
```
near call $CONTRACT_ID add_stable_liquidity '{"pool_id": '$POOL', "amounts":["10000000000000000000","10000000000000000000"], "min_shares": "0"}' --accountId $OWNER_ID --depositYocto=840000000000000000000  --gas=200000000000000
```

Internal SWAP~SWAP
```
near call $CONTRACT_ID swap '{"actions": [{"pool_id": '$POOL',"token_in": "'$TOKEN_1'","amount_in": "1","token_out": "'$TOKEN_2'","min_amount_out": "0"}]}' --accountId $OWNER_ID
```

Remove liquidity
```
near call $CONTRACT_ID remove_liquidity '{"pool_id": $POOL, "shares": "1000000000000000000000000", "min_amounts": ["1", "1"]}' --accountId $OWNER_ID --depositYocto=840000000000000000000
```

Withdraw Funds
```
near call $CONTRACT_ID withdraw "{\"token_id\": \"$TOKEN1\", \"amount\": \"900000000000\"}" --accountId $OWNER_ID --depositYocto=840000000000000000000
```


### FARMING 
```
near call $FARMING_CONTRACT create_simple_farm '{"terms": {"seed_id": "'$EX'@0", "reward_token": "'$TOKEN_1'", "start_at": 0, "reward_per_session": "100", "session_interval": 120}}' --accountId $OWNER_ID --deposit 0.01
```
```
near call $TOKEN_1 storage_deposit '{"account_id": "'$FARM'"}' --accountId $OWNER --deposit 0.00125
```

```
near call $REWARD_1 ft_transfer_call '{"receiver_id": "'$FARM'", "amount": "100000000", "msg": "jumbo-testnet-v3.solniechniy.testnet@0#0"}' --accountId $OWNER --depositYocto 1 --gas 100000000000000
```


## Errors
E10: account not registered
```
near call $CONTRACT_ID storage_deposit '{"account_id": "'$OWNER_ID'", "registration_only":true}' --accountId=$OWNER_ID --deposit=0.0125
```

E11: insufficient $NEAR storage deposit
```
near call $CONTRACT_ID storage_deposit '{"account_id": "'$OWNER_ID'", "registration_only":false}' --accountId=$OWNER_ID --deposit=0.125
```

## All commands for checking

1. [Deposit balances](https://web.nearapi.org/?q=woPCqGNvbnRyYWN0w5kgcmVmLcSCxITEhsSILnNvbG5pZWNoxJh5LnRlc3RuZXTCpm3EpWhvZMKsZ8SlX2RlcG9zaXRzwqZwYcSGbXPCgcKqxIfEgnXEhF9pZMKwcHJvdmVya2HEn8ShxKPEpQ)
2. [Get pool's information](https://web.nearapi.org/?q=woPCqGNvbnRyYWN0w5kgcmVmLcSCxITEhsSILnNvbG5pZWNoxJh5LnRlc3RuZXTCpm3EpWhvZMKoZ8SlX3BvxJbCpnBhxIZtc8KBwqfEscSWX2lkAA)
3. [Get number of liquidity shares in the pool](https://web.nearapi.org/?q=woPCqGNvbnRyYWN0w5kgcmVmLcSCxITEhsSILnNvbG5pZWNoxJh5LnRlc3RuZXTCpm3EpWhvZMKvZ8SlX3BvxJZfc2hhxIxzwqZwxLdhbXPCgsKnxLHEs2lkAMKqxIfEgnXEhF_FhMKwcHJvdmVya2HEn8ShxKPEpQ)
