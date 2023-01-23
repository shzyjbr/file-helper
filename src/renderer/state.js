const { contextBridge } = require('electron')


function getRegisterTimely() {
    
}

contextBridge.exposeInMainWorld('myAPI', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  getRegister: () => {
    
  },
  // 能暴露的不仅仅是函数，我们还可以暴露变量
})