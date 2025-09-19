// 自动化导入
const modules: any[] = [];

// 递归导入当前目录及子目录下所有 .ts 文件
const modulesFiles: Record<string, any> = import.meta.glob('./**/*.ts', {
  eager: true
});

Object.keys(modulesFiles).forEach((key) => {
  const value = modulesFiles[key];
  if (value.default) {
    modules.push(value.default);
  }
});

export default modules;
