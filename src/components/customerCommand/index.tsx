import React, { useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { Button, OutlinedInput } from "@mui/material"
import { Token } from "@/mobx/tokenStore"
import tokensStore from "@/mobx/tokenStore"
import { startApi } from "@/lib/api"
import { toJS } from "mobx"

type CustomerCommandProps = {
  token: Token
  index: number
}
const CustomerCommand = observer<CustomerCommandProps>(({ token, index }) => {
  const { tokens, setTokens } = tokensStore
  console.log(token)

  const start = async (index: number) => {
    let dupTokens = [...tokens]
    dupTokens[index].isProcess = true

    const name = await startApi(tokens[index].key)
    console.log(name)
    dupTokens[index].name = name
    setTokens(dupTokens)
  }
  return (
    <li className="flex items-center gap-2">
      <OutlinedInput
        disabled={token.isProcess === true}
        onChange={(e) => {
          let dupTokens = [...tokens]
          dupTokens[index].key = e.target.value
          setTokens(dupTokens)
        }}
        value={token.key}
        placeholder="token"
        className="h-10"
      />
      <Button
        className="h-10"
        variant="outlined"
        disabled={token.key === "" || token.isProcess === true}
        onClick={() => start(index)}
      >
        {token.isProcess === true ? "in Process" : "Start"}
      </Button>
      <div>{token.name}</div>
    </li>
  )
})

export default CustomerCommand

//  trans
//  relathithip
//  sex
