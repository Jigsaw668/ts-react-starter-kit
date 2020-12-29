module.exports = {
  stories: ["../src/**/*.stories.(js|jsx|ts|tsx)"],
  typescript: {
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      compilerOptions: {
        allowSyntheticDefaultImports: false,
        esModuleInterop: false,
      },
    }
  },
  addons: [
    "@storybook/preset-scss",
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    '@storybook/preset-typescript',
    '@storybook/addon-actions',
  ]
}