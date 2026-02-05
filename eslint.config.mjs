import nextConfig from "eslint-config-next"

const eslintConfig = [
  ...nextConfig,
  {
    ignores: ["components/animate-ui/**"],
  },
]

export default eslintConfig
