import { Customer } from "@/api/firestore/customer/interfaces"
import { Message } from "@/api/firestore/message/interfaces"
import { modals } from "@/util"
import { Timestamp } from "firebase/firestore"
import { makeAutoObservable } from "mobx"

const data: Customer[] = [
  {
    id: "cust123",
    name: "Lee",
    createdDate: Timestamp.now(),
  },
  {
    id: "cust121",
    name: "Rich",
    createdDate: Timestamp.now(),
  },
]

class CustomerS {
  customers: Customer[] = [...data]
  chosenCustomer: Customer | null = null
  likes: any[] = []
  messages: Message[] = []

  constructor() {
    makeAutoObservable(this)
    this.getCustomers()
    this.getMessages()
    this.getLikes()
  }

  setChosenCustomer(customer: Customer) {
    this.chosenCustomer = customer
  }
  async getCustomers() {
    // this.customers = await getCustomersFirestore()
  }
  getLikes() {
    this.likes = [
      {
        id: "4H475PbGrcSwyV8Cegfz",
        userId: "5980deb74a75f5b45fb118ee",
        createdDate: {
          seconds: 1707275899,
          nanoseconds: 583000000,
        },
        likeUrls: [
          "https://images-ssl.gotinder.com/u/ixawztDkGvU6RzTjdcfrJa/3QBG9s8vbn5g4Cd1yR5M46.jpeg?Policy=eyJTdGF0ZW1lbnQiOiBbeyJSZXNvdXJjZSI6IiovdS9peGF3enREa0d2VTZSelRqZGNmckphLyoiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3MDgxNTY1MjZ9fX1dfQ__&Signature=jiDTbDwi4eWgn5qRAqjhuJ-xsdl6xvXHqTk0vF5bUGGeef~B~D3dLRcTE7WWDiBDHKaV8Ihr8iK6HwG7pcvPf3ZoFyha-y1FhYrorSWWwPkyBuiUdJPZQ62PEBVshStHnLt9O8EUhbmOoDEQnOxy9kdg1lJSBaLFmyQWdkcTJk4nJSCGfPffKP4tQv-0XI9YF1fv1dv7ozakSyfPnBzEdJoXsyt8AYYdirY-8WejUrXyA~3XJuxpWIAopqe54o8ElvCENIHqy0JGH1ZwsO4B~yYRKlemVwyi0s-baC67nn~fHS-p94h0wC5SRNaE3MZ~R~Kng3QaPXGJ2tBw-lCzwA__&Key-Pair-Id=K368TLDEUPA6OI",
          "https://images-ssl.gotinder.com/u/3BcbbGsAGnLyYVgwwLZ1LS/dK1BxTsUdAKNW65YMvWqDJ.jpeg?Policy=eyJTdGF0ZW1lbnQiOiBbeyJSZXNvdXJjZSI6IiovdS8zQmNiYkdzQUduTHlZVmd3d0xaMUxTLyoiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3MDgxNjI2ODV9fX1dfQ__&Signature=d-1xR5kuClW~cXf1K2LV9u3gwDffrLHeIjmgZqQumCR7HBd7~7jKtlxjE-fpmGLePP77yhyhS1nmrYPElDM8eTKgI5bd2XPjpCFpO40CVoPRMBcVCa8zWwZKSGHjYW4SX25ZCR4thiJux5WdP4oRr0gp6sWuQCxqyVz-Ke4Vjjnk4N3soD7~~jHsqG~oBzybO2NdZegXU1xfBPblR--hyZCfkvleIiqqLzAGavo2nf-gHeCVv~m2WSbBHDEIhQYUFkO2F9kz4pXTTDFQcGWbCX7mPO2mByNaCCg6RtJNtf06IaIUMY4i0JKZSdS2J3VwZQKJ3~zkwI2sRfRx9TiYuQ__&Key-Pair-Id=K368TLDEUPA6OI",
          "https://images-ssl.gotinder.com/u/iXs9LehKjdWYkgYe5p5947/9wdGAtoghcGCdWPYUKsmE4.jpeg?Policy=eyJTdGF0ZW1lbnQiOiBbeyJSZXNvdXJjZSI6IiovdS9pWHM5TGVoS2pkV1lrZ1llNXA1OTQ3LyoiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3MDgxNDU0NDZ9fX1dfQ__&Signature=Cn8kemlyIyduli7T8gSopYD3X4~oXYlPNj2edXoGvAzHLaN4jWW~BBwqa98agF-6rx-NlLWh7SYuNgHy0uOk5P7tzOni3ZaILT3-Dk~TRj57Rb5rHqjrTxSXEiyhZgaD2T104nMr~5pQ7S9CvBMUjgYeLF3AdQKhht8xtZQcH2ReABmN~MT5wT~Mis-B-a76gjebzKYkifaT2mtJt9~-WwRcI1FLEJx7iPoKtHOjISGvPJrQxrcKqxBde2CKh~qDxucL46HxpaSDXnXMqRz7QxkLdOMRfaU6eH8n6EFLcQtfatXzG3c~tzarGlNY8omCSCUKlAy-tCMjiuDOg1T~3g__&Key-Pair-Id=K368TLDEUPA6OI",
          "https://images-ssl.gotinder.com/u/atZckucmYLH8P1Xm9V9wZb/ruamAkuBZPcBgm39c1PbjS.jpeg?Policy=eyJTdGF0ZW1lbnQiOiBbeyJSZXNvdXJjZSI6IiovdS9hdFpja3VjbVlMSDhQMVhtOVY5d1piLyoiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3MDgxMTcxMTZ9fX1dfQ__&Signature=NhQYCS1KtA10Y3gQFktUAAjfpI0CysBynN659vL7OB5JQ5wYY4O34Wyhur10O5uM0mOeT7gYiWUqQf-lJbS-VqLCWAMszdKVbw1F2yd--Z4ckwyUFycjZR8rxzILHex5VRZO1gMgq95GT07gFKTQwDNsv51ewyzCCoyf~zs9HEdaTwwspaGnxbu8smzxNOH0nmfhLy1IyIUW0d4fXFXl-67HNePoWAnEnsKey8UuMTlgjbrbs~HvMrdloz5Hs5msFLs6KU1Y1uji0kz-ZtwzznZHYDWlIbA~D0evPk3PBJIdGX6EangbNRexU5B6TJlhzRzEcVUUp8IF3OYl7gx~IQ__&Key-Pair-Id=K368TLDEUPA6OI",
          "https://images-ssl.gotinder.com/u/sWsLitNxrtLMw8sd6KFVnW/kdXqFPCowKgnahoNefYFjU.jpeg?Policy=eyJTdGF0ZW1lbnQiOiBbeyJSZXNvdXJjZSI6IiovdS9zV3NMaXROeHJ0TE13OHNkNktGVm5XLyoiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3MDgwOTc0MTV9fX1dfQ__&Signature=ifwP~xCYkd~DG05q8Q6ZpOFR26C6GzSjqzifmkqxhjLdA-FC23XiyuL5q-1-1koMiIHdpiLgxVZKCnDOr3KFQMlH9i8~Xy9S0cXUTXSbPm-Y0jgVws1uM3uzBrENl3aDSVcjumX7~WWyWt9PPCtEHVYhEI~xvIHIDnF5B6E3-1VuDRE8g4hU758l2cf5VOpzeLto1edO2b8em0V3~u6iPYN3Jzw0P7fTF2MM2ylAgy5P9eRs0Fm5YsatAQnoV1vLTl0y2b9VsDYUXnirvrCs5yAbK5gKNR7qMb21z32qmI66Ny9vQ7ER~GELx3Ek40-8NKkRPNoM9biHx1-ILzUEMw__&Key-Pair-Id=K368TLDEUPA6OI",
        ],
      },
      {
        id: "4H475PbGrcSwyV8Cegfz",
        userId: "5980deb74a75f5b45fb118ee",
        createdDate: {
          seconds: 1707584400,
          nanoseconds: 0,
        },
        likeUrls: [
          "https://images-ssl.gotinder.com/u/ixawztDkGvU6RzTjdcfrJa/3QBG9s8vbn5g4Cd1yR5M46.jpeg?Policy=eyJTdGF0ZW1lbnQiOiBbeyJSZXNvdXJjZSI6IiovdS9peGF3enREa0d2VTZSelRqZGNmckphLyoiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3MDgxNTY1MjZ9fX1dfQ__&Signature=jiDTbDwi4eWgn5qRAqjhuJ-xsdl6xvXHqTk0vF5bUGGeef~B~D3dLRcTE7WWDiBDHKaV8Ihr8iK6HwG7pcvPf3ZoFyha-y1FhYrorSWWwPkyBuiUdJPZQ62PEBVshStHnLt9O8EUhbmOoDEQnOxy9kdg1lJSBaLFmyQWdkcTJk4nJSCGfPffKP4tQv-0XI9YF1fv1dv7ozakSyfPnBzEdJoXsyt8AYYdirY-8WejUrXyA~3XJuxpWIAopqe54o8ElvCENIHqy0JGH1ZwsO4B~yYRKlemVwyi0s-baC67nn~fHS-p94h0wC5SRNaE3MZ~R~Kng3QaPXGJ2tBw-lCzwA__&Key-Pair-Id=K368TLDEUPA6OI",
          "https://images-ssl.gotinder.com/u/atZckucmYLH8P1Xm9V9wZb/ruamAkuBZPcBgm39c1PbjS.jpeg?Policy=eyJTdGF0ZW1lbnQiOiBbeyJSZXNvdXJjZSI6IiovdS9hdFpja3VjbVlMSDhQMVhtOVY5d1piLyoiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3MDgxMTcxMTZ9fX1dfQ__&Signature=NhQYCS1KtA10Y3gQFktUAAjfpI0CysBynN659vL7OB5JQ5wYY4O34Wyhur10O5uM0mOeT7gYiWUqQf-lJbS-VqLCWAMszdKVbw1F2yd--Z4ckwyUFycjZR8rxzILHex5VRZO1gMgq95GT07gFKTQwDNsv51ewyzCCoyf~zs9HEdaTwwspaGnxbu8smzxNOH0nmfhLy1IyIUW0d4fXFXl-67HNePoWAnEnsKey8UuMTlgjbrbs~HvMrdloz5Hs5msFLs6KU1Y1uji0kz-ZtwzznZHYDWlIbA~D0evPk3PBJIdGX6EangbNRexU5B6TJlhzRzEcVUUp8IF3OYl7gx~IQ__&Key-Pair-Id=K368TLDEUPA6OI",
          "https://images-ssl.gotinder.com/u/sWsLitNxrtLMw8sd6KFVnW/kdXqFPCowKgnahoNefYFjU.jpeg?Policy=eyJTdGF0ZW1lbnQiOiBbeyJSZXNvdXJjZSI6IiovdS9zV3NMaXROeHJ0TE13OHNkNktGVm5XLyoiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3MDgwOTc0MTV9fX1dfQ__&Signature=ifwP~xCYkd~DG05q8Q6ZpOFR26C6GzSjqzifmkqxhjLdA-FC23XiyuL5q-1-1koMiIHdpiLgxVZKCnDOr3KFQMlH9i8~Xy9S0cXUTXSbPm-Y0jgVws1uM3uzBrENl3aDSVcjumX7~WWyWt9PPCtEHVYhEI~xvIHIDnF5B6E3-1VuDRE8g4hU758l2cf5VOpzeLto1edO2b8em0V3~u6iPYN3Jzw0P7fTF2MM2ylAgy5P9eRs0Fm5YsatAQnoV1vLTl0y2b9VsDYUXnirvrCs5yAbK5gKNR7qMb21z32qmI66Ny9vQ7ER~GELx3Ek40-8NKkRPNoM9biHx1-ILzUEMw__&Key-Pair-Id=K368TLDEUPA6OI",
        ],
      },
    ]
  }
  getMessages() {
    this.messages = [
      {
        userId: "5980deb74a75f5b45fb118ee",
        amount: 5,
        createdDate: {
          seconds: 1707575899,
          nanoseconds: 299000000,
        },
      },
    ]
  }
}
export const CustomerStore = new CustomerS()
