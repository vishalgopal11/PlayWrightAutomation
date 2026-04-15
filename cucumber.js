module.exports = {
  default: {
    publishQuiet: true,
    requireModule: ['ts-node/register'],
    require: ['features/step_definitions/*.ts', 'features/support/*.ts'],
    format: ['html:reports/cucumber-report.html'],
    formatOptions: { snippetInterface: 'async-await' },
  },
};