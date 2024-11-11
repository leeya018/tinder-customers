import {
  TinderUser,
  lookForOptions,
  relationshipWords,
  sexWords,
  transWords,
  womenWords,
} from "@/pages/api/util";

export const getIsLookForFit = (lookFor: string, user: TinderUser): boolean => {
  console.log("Looking for:", lookFor);

  switch (lookFor) {
    case lookForOptions.TRANS: {
      let wordsIncludes = transWords.filter((word) =>
        user.bio.toLowerCase().includes(word)
      );
      console.log(wordsIncludes.length > 0 ? "Trans fit." : "Not trans fit.");
      return wordsIncludes.length > 0;
    }
    case lookForOptions.RELATIONSHIP:
    case lookForOptions.SEX: {
      // fit for trans and sex now
      const pref = user.relationship_intent?.body_text || "";
      console.log("Preference:", pref);
      const wordsList =
        lookFor === lookForOptions.RELATIONSHIP ? relationshipWords : sexWords;
      let wordsIncludes = wordsList.filter((choice) => choice === pref);
      console.log(
        wordsIncludes.length > 0 ? `${lookFor} fit.` : `Not ${lookFor} fit.`
      );
      // trans
      let wordsIncludesT = transWords.filter((word) =>
        user.bio.toLowerCase().includes(word)
      );
      console.log(wordsIncludes.length > 0 ? "Trans fit." : "Not trans fit.");
      // return wordsIncludes.length > 0;
      return wordsIncludes.length > 0 || wordsIncludesT.length > 0;
    }

    case lookForOptions.WOMEN: {
      console.log("I am in women search mode");
      let wordsIncludes = transWords.filter((word) =>
        user.bio.toLowerCase().includes(word)
      );
      const isWomen = wordsIncludes.length === 0;
      console.log({ isWomen });
      return isWomen;
    }
    default: {
      throw new Error(`option of ${lookFor} is not supported}`);
    }
  }
};
