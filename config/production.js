

module.exports = {

  api: {
    port: 3002,
    root: '/api',
  },

  auth: {
    jwt: {
      secret: '5edb26e5-ec21-4150-9fde-57735eabba99',
    },
    resetPassword: {
      secret: '27e048c1-5575-4807-873e-5b3775419286',
    },
  },

  db: {
    url: 'mongodb://localhost:27017/bundle-node-prod',
    name: process.env.DB_NAME || 'prod',
  },
};
