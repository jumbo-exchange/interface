# Jumbo

## Getting started

To make it easy for you to get started with GitLab, here's a list of recommended next steps.

Already a pro? Just edit this README.md and make it your own. Want to make it easy? [Use the template at the bottom](#editing-this-readme)!

## Add your files

- [ ] [Create](https://gitlab.com/-/experiment/new_project_readme_content:da2ac3ecaa37230e96aeb3a6d870c044?https://docs.gitlab.com/ee/user/project/repository/web_editor.html#create-a-file) or [upload](https://gitlab.com/-/experiment/new_project_readme_content:da2ac3ecaa37230e96aeb3a6d870c044?https://docs.gitlab.com/ee/user/project/repository/web_editor.html#upload-a-file) files
- [ ] [Add files using the command line](https://gitlab.com/-/experiment/new_project_readme_content:da2ac3ecaa37230e96aeb3a6d870c044?https://docs.gitlab.com/ee/gitlab-basics/add-file.html#add-a-file-using-the-command-line) or push an existing Git repository with the following command:

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
    near call $CONTRACT_ID add_simple_pool '{"tokens": ["'$TOKEN_1'","'$TOKEN_2'"], "decimals": [18,18],"fee": 25, "amp_factor": 1}' --accountId=$OWNER_ID --depositYocto=3480000000000000000000
    export POOL_ID=(number from command above)
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
near call $CONTRACT_ID add_liquidity '{"pool_id": '$POOL_ID', "amounts":["10000000000000000000","10000000000000000000"]}' --accountId $OWNER_ID --depositYocto=840000000000000000000
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
