declare module "*.svg" {
  import React = require("react")
  const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>
  export default ReactComponent
}

declare const IS_PROD: boolean
declare const IS_DEV: boolean
declare const IS_DEV_SERVER: boolean
