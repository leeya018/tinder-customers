const TeachableMachine = require("@sashido/teachablemachine-node")

// modelUrl: "https://teachablemachine.withgoogle.com/models/r6BBk-hiN/",
const model = new TeachableMachine({
  modelUrl: `https://teachablemachine.withgoogle.com/models/${process.env.NEXT_PUBLIC_MODEL_PATH_ID}`,
})
export const predict = async (imageUrl: string) => {
  const pred = await model.classify({
    imageUrl,
  })
  console.log("Predictions:", pred)
  return pred
}
