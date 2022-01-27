# Jumbo

## Getting started to deploy

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
    near call $CONTRACT_ID add_simple_pool '{"tokens": ["'$TOKEN_1'","'$TOKEN_2'"], "decimals": [18,18],"fee": 25, "amp_factor": 1}' --accountId=$OWNER_ID --depositYocto=3420000000000000000000
    export POOL_ID=(number from command above)
```

Tokens storage deposit

```
    near call $TOKEN_1 storage_deposit '{"account_id": "'$CONTRACT_ID'","registration_only": true}' --accountId=$CONTRACT_ID
    near call $TOKEN_2 storage_deposit '{"account_id": "'$CONTRACT_ID'","registration_only": true}' --accountId=$CONTRACT_ID
```

Token registration 

```
   near call $CONTRACT_ID register_tokens '{"token_ids": ["token.solniechniy.testnet","ref.fakes.testnet"]}' --accountId=$OWNER_ID --depositYocto=1
```

Transfer tokens 

```
near call $TOKEN_1 ft_transfer_call '{"receiver_id": "'$CONTRACT_ID'", "amount": "10000000000000000000", "msg": ""}' --accountId=$OWNER_ID --depositYocto=1 --gas=200000000000000
near call $TOKEN_2 ft_transfer_call '{"receiver_id": "'$CONTRACT_ID'", "amount": "10000000000000000000", "msg": ""}' --accountId=$OWNER_ID --depositYocto=1 --gas=200000000000000
```

Add liquidity 

```
near call $CONTRACT_ID add_liquidity '{"pool_id": $POOL_ID, "amounts":["10000000000000000000","10000000000000000000"]}' --accountId $OWNER_ID --depositYocto=840000000000000000000
```

Internal SWAP~SWAP
```
near call $CONTRACT_ID swap '{"actions": [{"pool_id": '$POOL_ID',"token_in": "'$TOKEN_1'","amount_in": "1","token_out": "'$TOKEN_2'","min_amount_out": "0"}]}' --accountId $OWNER_ID
```




## Errors
E10: account not registered
```
near call $CONTRACT_ID storage_deposit '{"account_id": "'$OWNER_ID'", "registration_only":true}' --accountId=$OWNER_ID --deposit=0.0125
```
