import React, { useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { Button, OutlinedInput } from "@mui/material"
import { Token } from "@/mobx/tokenStore"
import tokensStore from "@/mobx/tokenStore"
import { startApi } from "@/lib/api"
import { toJS } from "mobx"
import BasicSelect from "@/ui/basicSelect"
import { lookForOptions } from "@/util"

type CustomerCommandProps = {
  token: Token
  index: number
}
const CustomerCommand = observer<CustomerCommandProps>(({ token, index }) => {
  const [lookFor, setLookFor] = useState<string>("")
  const { tokens, setTokens } = tokensStore
  console.log(token)

  const start = async (index: number) => {
    let dupTokens = [...tokens]
    dupTokens[index].isProcess = true

    const name = await startApi(tokens[index].key, lookFor)
    console.log(name)
    dupTokens[index].name = name
    setTokens(dupTokens)
  }
  console.log({ lookFor })
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
      <BasicSelect
        className="w-36 h-full box-content"
        handleChange={setLookFor}
        value={lookFor}
        options={Object.keys(lookForOptions)}
        name="look for"
      />
      <Button
        className="h-10"
        variant="outlined"
        disabled={
          token.key === "" || token.isProcess === true || lookFor === ""
        }
        onClick={() => start(index)}
      >
        {token.isProcess === true ? "in Process" : "Start"}
      </Button>
      <div>{token.name}</div>
    </li>
  )
})

export default CustomerCommand
