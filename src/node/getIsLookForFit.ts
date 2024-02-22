import {
  TinderUser,
  lookForOptions,
  relationshipWords,
  sexWords,
  transWords,
} from "@/pages/api/util"

export const getIsLookForFit = (lookFor: string, user: TinderUser): boolean => {
  console.log("Looking for:", lookFor)

  switch (lookFor) {
    case lookForOptions.TRANS: {
      let wordsIncludes = transWords.filter((word) =>
        user.bio.toLowerCase().includes(word)
      )
      console.log(wordsIncludes.length > 0 ? "Trans fit." : "Not trans fit.")
      return wordsIncludes.length > 0
    }
    case lookForOptions.RELATIONSHIP:
    case lookForOptions.SEX: {
      const pref = user.relationship_intent?.body_text || ""
      console.log("Preference:", pref)
      const wordsList =
        lookFor === lookForOptions.RELATIONSHIP ? relationshipWords : sexWords
      let wordsIncludes = wordsList.filter((choice) => choice === pref)
      console.log(
        wordsIncludes.length > 0 ? `${lookFor} fit.` : `Not ${lookFor} fit.`
      )
      return wordsIncludes.length > 0
    }
    default: {
      throw new Error(`option of ${lookFor} is not supported}`)
    }
  }
}
