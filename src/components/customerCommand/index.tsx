import React, { useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import {
  Button,
  Checkbox,
  FormControlLabel,
  OutlinedInput,
} from "@mui/material"
import { Token } from "@/mobx/tokenStore"
import tokensStore from "@/mobx/tokenStore"
import { startApi } from "@/lib/api"
import { toJS } from "mobx"
import BasicSelect from "@/ui/basicSelect"
import { lookForOptions } from "@/util"

type CustomerCommandProps = {
  customerXlsData: any
  index: number
}
const CustomerCommand = observer<CustomerCommandProps>(
  ({ customerXlsData, index }) => {
    console.log(customerXlsData)

    const start = async (index: number) => {}
    console.log({ customerXlsData })
    return (
      <li className="flex items-center gap-2">
        <OutlinedInput
          value={customerXlsData.token}
          placeholder="token"
          className="h-10"
        />
        <BasicSelect
          className="w-36 h-full box-content"
          handleChange={() => {}}
          value={customerXlsData.lookFor}
          options={Object.keys(lookForOptions)}
          name="look for"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={customerXlsData.isLookGood}
              // onChange={() => setIsLookGood((prev) => !prev)}
              name="is looking good"
            />
          }
          label="Looking good"
        />
        <Button
          className="h-10"
          variant="outlined"
          // disabled={
          //   token.key === "" || token.isProcess === true || lookFor === ""
          // }
          onClick={() => start(index)}
        >
          {/* {token.isProcess === true ? "in Process" : "Start"} */}
          start
        </Button>
        <div>{customerXlsData.name}</div>
      </li>
    )
  }
)

export default CustomerCommand
