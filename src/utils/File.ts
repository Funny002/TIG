export function FileToReader(keys: 'base64' | 'text', file: File): Promise<string>;
export function FileToReader(keys: 'arraybuffer', file: File): Promise<ArrayBuffer>;
export function FileToReader(keys: 'base64' | 'arraybuffer' | 'text', file: File): Promise<any> {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    if (keys === 'arraybuffer') reader.readAsArrayBuffer(file);
    if (keys === 'base64') reader.readAsDataURL(file);
    if (keys === 'text') reader.readAsText(file);
    throw new Error(`not know how to read`);
  });
}

export const FileToArrayBuffer = (file: File) => FileToReader('arraybuffer', file);
export const FileToBase64 = (file: File) => FileToReader('base64', file);
export const FileToText = (file: File) => FileToReader('text', file);

export interface InputOptions {
  accept: string[];
  multiple: boolean;
  filtration: boolean;
  webkitdirectory: boolean;
}

function handleFile(files: FileList): File[] {
  const target: File[] = [];
  for (let i = files.length - 1; i >= 0; i--) {
    target.push(files.item(i) as File);
  }
  return target;
}

export function createInput(element?: HTMLInputElement, opt?: Partial<InputOptions>) {
  const accept = opt?.accept?.map(v => v.toLocaleLowerCase()) || [];
  return new Promise<File[]>(success => {
    const dom = element || document.createElement('input');
    dom.accept = (accept => accept ? '.' + accept : '')(accept.join(' .'));
    dom.webkitdirectory = opt?.webkitdirectory || false;
    dom.multiple = opt?.multiple || false;
    dom.type = 'file';
    dom.onchange = function () {
      const files = handleFile(dom.files as FileList);
      // // 未选择文件夹，选中的文件加入验证
      if (accept.length > 0) {
        const reg = new RegExp(`\\.(${accept.join('|')})$`, 'i');
        // 验证格式是否与传入一致 - 过滤，还是报错
        for (let key = files.length - 1; key >= 0; key--) {
          const FileName = files[key].name;
          if (!reg.test(FileName)) {
            const errMeg = `path:${ (files[key] as any).path } 与传入的格式不一致。`;
            if (opt?.filtration) {
              console.error(errMeg);
              files.splice(key, 1);
            } else {
              throw new Error(errMeg);
            }
          }
        }
      }
      success(files);
      dom.remove();
    };
    dom.onblur = function () {
      console.log(dom.files);
    };
    dom.click();
  });
}

type  FileOptions = Partial<{ accept: string[]; multiple: boolean; element: HTMLInputElement }>

export function getFile({ element, accept, multiple }: FileOptions) {
  return createInput(element, { accept, multiple, filtration: true });
}

export function getFolder({ element, accept, multiple }: FileOptions) {
  return createInput(element, { accept, multiple, filtration: true, webkitdirectory: true });
}

export function getDragFile({ dataTransfer }: { dataTransfer: DataTransfer }) {
  const files: File[] = [];

  function traverseFileTree(item: any, path?: string) {
    path = path || '';
    if (item.isFile) {
      // Object.defineProperty(file, 'path', { value: path });
      item.file((file: File) => files.push(file));
    } else if (item.isDirectory) {
      item.createReader().readEntries(function (entries: string | any[]) {
        for (let i = 0; i < entries.length; i++) {
          traverseFileTree(entries[i], path + item.name + '/');
        }
      });
    }
  }

  const items = dataTransfer.items;
  for (let i = 0; i < items.length; i++) {
    const item = items[i].webkitGetAsEntry();
    if (item) traverseFileTree(item);
  }
  return files;
}
