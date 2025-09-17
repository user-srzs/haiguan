import mitt from 'mitt';

const emitter = mitt();

// 触发事件 emitter.emit('test1');

// 绑定事件 emitter.on('test1',()=>{});

// 取消绑定事件 emitter.off('test1');

export default emitter;
