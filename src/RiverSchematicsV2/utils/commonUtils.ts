export const CommonUtils = {
  Maths: {
    roundDecimal: (num: number, places = 2) =>
      Number.isFinite(num) ? Math.round(num * Math.pow(10, places)) / Math.pow(10, places) : null,
  },
  Text: {
    commaMarkUp: (value: number) => (+value).toLocaleString(['en-AU', 'en-US']),
    roundedCommaMarkUp: (value: number) => CommonUtils.Text.commaMarkUp(Math.round(+value)),
    checkNegative: (num: number) => (Math.sign(num) === -1 ? 0 : num),
    stripPrefix: (str: string, prefix: string) => str.substring(prefix.length),
    markUpNum: (value: number) =>
      CommonUtils.Text.commaMarkUp(CommonUtils.Text.checkNegative(Math.round(+value))),
  },
}
