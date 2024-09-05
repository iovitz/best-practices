const decamelize = require('decamelize');
const camelcase = require('camelcase');

/**
 * 转换文件名为小驼峰
 * @param {string} filePath
 * @returns newPath
 */
function convertFileName(filePath) {
  return filePath
    .replaceAll(' ', '')
    .replaceAll('.', '/')
    .split('/')
    .map((str) => decamelize(str, { separator: '-' }))
    .join('/');
}

module.exports = function (plop) {
  // controller generator
  plop.setGenerator('action', {
    description: 'Route Actions',
    prompts: [{
      type: 'rawlist',
      name: 'method',
      message: 'Action method please',
      required: true,
      choices: [
        {
          name: 'GET',
          value: 'GET',
        },
        {
          name: 'POST',
          value: 'POST',
        },
        {
          name: 'PUT',
          value: 'PUT',
        },
        {
          name: 'DELETE',
          value: 'DELETE',
        },
      ],
    }, {
      type: 'input',
      name: 'name',
      message: 'Action name please',
      required: true,
    }, {
      type: 'input',
      name: 'description',
      message: 'Action description please',
    }],
    actions: (data) => {
      data.usage = '\'POST /api/v1/dd\': { action: \'dd\' }';
      // 替换名字
      data.name = convertFileName(data.name);
      data.friendlyName = data.name.split('/').pop();
      data.usage = '123';
      return [{
        type: 'add',
        path: 'api/controllers/{{name}}.js',
        templateFile: 'generators/action.hbs',
      }];
    },
  });

  plop.setGenerator('service', {
    description: 'App Service',
    prompts: [{
      type: 'input',
      name: 'name',
      message: 'Service name please',
      required: true,
    }, {
      type: 'input',
      name: 'description',
      message: 'Service description please',
    }],
    actions: (data) => {
      // 替换名字
      data.name = camelcase(`${data.name}Service`, { pascalCase: true });
      return [{
        type: 'add',
        path: 'api/services/{{name}}.js',
        templateFile: 'generators/service.hbs',
      }];
    },
  });

  plop.setGenerator('helper', {
    description: 'App Helper',
    prompts: [{
      type: 'input',
      name: 'name',
      message: 'Helper name please',
      required: true,
    }, {
      type: 'input',
      name: 'description',
      message: 'Service description please',
    }],
    actions: (data) => {
      // 替换名字
      data.name = convertFileName(data.name);
      data.friendlyName = data.name.split('/').pop();
      data.usage = `await sails.helpers.${data.name.split('/').map((name) => camelcase(name)).join('.')}.with({})`;
      return [{
        type: 'add',
        path: 'api/helpers/{{name}}.js',
        templateFile: 'generators/helper.hbs',
      }];
    },
  });

  plop.setGenerator('hook', {
    description: 'App hook',
    prompts: [{
      type: 'input',
      name: 'name',
      message: 'Hook name please',
      required: true,
    }, {
      type: 'input',
      name: 'description',
      message: 'Hook description please',
    }],
    actions: (data) => {
      // 替换名字
      data.name = camelcase(data.name);
      return [{
        type: 'add',
        path: 'api/hooks/{{name}}/index.js',
        templateFile: 'generators/hook.hbs',
      }];
    },
  });

  plop.setGenerator('response', {
    description: 'Request response',
    prompts: [{
      type: 'input',
      name: 'name',
      message: 'Response name please',
      required: true,
    }, {
      type: 'input',
      name: 'description',
      message: 'Response description please',
    }],
    actions: (data) => {
      // 替换名字
      data.name = camelcase(data.name);
      return [{
        type: 'add',
        path: 'api/responses/{{name}}.js',
        templateFile: 'generators/response.hbs',
      }];
    },
  });
};
