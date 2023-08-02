const callbacks: Array<Function | any> = [];


export function triggerCallback({name:callbackName,data}:any) {
  const index = callbacks.findIndex(item => item.name === callbackName);

  if (index !== -1) {
    const { callback } = callbacks[index];
    callback(data);
    callbacks.splice(index, 1); // Remove the triggered callback from the list
  } 
}

export function addCallBack({
  name,
  callbackFn,
}: {
  name: string;
  callbackFn: Function;
}) {
  const index = callbacks.findIndex(item => item.name === name);

  if (index === -1) {
    callbacks.push({ name, callback: callbackFn });
  } else {
    return;
  }
}
