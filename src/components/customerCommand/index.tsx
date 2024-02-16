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
import { CustomerStore } from "@/mobx/customerStore"
//  need to continuse with the xls
// https://docs.google.com/spreadsheets/d/194xGNn4jMguCqcqJCcqzzKR7ZIgCHQzwtpHajv80wWU/edit#gid=1701642647
type CustomerCommandProps = {
  customerXlsData: any
  index: number
}
const CustomerCommand = observer<CustomerCommandProps>(
  ({ customerXlsData, index }) => {
    console.log(customerXlsData)

    const isAllFieldsFill = () => {
      const { name, token, lookFor, isProcess } = customerXlsData

      return name && token && lookForOptions[lookFor] && !isProcess
    }

    const start = async (index: number) => {}
    console.log({ customerXlsData })
    return (
      <li className="flex items-center gap-2">
        <div>{customerXlsData.name}</div>
        <BasicSelect
          className="w-36 h-full box-content"
          handleChange={(value: string) => {
            CustomerStore.updateCustomersXls(index, {
              lookFor: value,
            })
          }}
          value={customerXlsData.lookFor}
          options={Object.keys(lookForOptions)}
          name="look for"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={customerXlsData.isLookGood}
              onChange={(e) => {
                CustomerStore.updateCustomersXls(index, {
                  isLookGood: e.target.checked,
                })
              }}
              name="is_looking_good"
            />
          }
          label="Looking good"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={customerXlsData.isWithLikes}
              onChange={(e) => {
                CustomerStore.updateCustomersXls(index, {
                  isWithLikes: e.target.checked,
                })
              }}
              name="with_likes"
            />
          }
          label="with_likes"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={customerXlsData.isWithMessages}
              onChange={(e) => {
                CustomerStore.updateCustomersXls(index, {
                  isWithMessages: e.target.checked,
                })
              }}
              name="sending messages"
            />
          }
          label="sending messages"
        />
        <Button
          className={`h-10 ${isAllFieldsFill() ? "cursor-pointer" : ""}`}
          variant="outlined"
          disabled={!isAllFieldsFill()}
          // onClick={() => start(index)}
        >
          {customerXlsData.isProcess === true ? "in Process" : "Start"}
        </Button>
        <div className="group flex justify-center items-center p-2   shadow-md cursor-pointer">
          <div className="group-hover:hidden">Show Token</div>
          <div className="hidden  group-hover:flex  ">
            {customerXlsData.token}
          </div>
        </div>
      </li>
    )
  }
)

export default CustomerCommand
