module.exports = {
    roots: ['<rootDir>'],
    transform: {
      '^.+\\.tsx?$': 'ts-jest',
    },
    // testRegex: '(/tests/.*|(\\.|/)(test|spec|tests))\\.tsx?$',
    // testRegex: '(/tests/.*|(\\\\.|/)(test|spec))\\\\.[jt]sx?$',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  };